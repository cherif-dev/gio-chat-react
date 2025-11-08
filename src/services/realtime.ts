import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import {
  RealtimeEvent,
  RealtimeSubscription,
  Message,
  Contact,
  Conversation,
  TypingEvent,
} from '../types';
import { getConfigService } from './config';

/**
 * Real-time service for managing Supabase real-time subscriptions
 */
export class RealtimeService {
  private client: SupabaseClient<any, any, any> | null = null;
  private channels: Map<string, RealtimeChannel> = new Map();
  private messageListeners: Map<string, Set<(event: RealtimeEvent<Message>) => void>> = new Map();

  /**
   * Initialize the real-time service
   */
  initialize(): void {
    try {
      const configService = getConfigService();
      if (!configService.isServiceInitialized()) {
        return;
      }
      const supabaseConfig = configService.getSupabaseConfig();

      this.client = createClient(supabaseConfig.url, supabaseConfig.anon_key, {
        db: { schema: supabaseConfig.schema },
        ...supabaseConfig.options,
      });
    } catch (error) {
      console.error('Error initializing real-time service:', error);
    }
  }

  /**
   * Check if the service is initialized
   */
  private ensureInitialized(): void {
    if (!this.client) {
      throw new Error('Realtime service not initialized. Call initialize() with config first.');
    }
  }

  /**
   * Get the Supabase client
   */
  getClient(): SupabaseClient<any, any, any> {
    this.ensureInitialized();
    return this.client!;
  }

  /**
   * Subscribe to messages for a conversation
   */
  subscribeToMessages(
    conversationId: number,
    name: string,
    onMessage: (event: RealtimeEvent<Message>) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `conversation.${conversationId}.messages`;
    const listenerKey = `${channelName}.${name}`;

    // Initialize listeners set for this channel if it doesn't exist
    if (!this.messageListeners.has(listenerKey)) {
      console.log('registering new listener', listenerKey);
      this.messageListeners.set(listenerKey, new Set());
    }
    // Add this listener to the set
    const listeners = this.messageListeners.get(listenerKey)!;
    if (listeners.size === 0) {
      listeners.add(onMessage);
    }

    // If channel doesn't exist, create it
    if (!this.channels.has(channelName)) {
      this.client!.from('messages')
        .select('*')
        .then(res => console.log({ res }));

      const channel = this.client!.channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'genit_io',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          payload => {
            console.log('message-created', payload);
            const event: RealtimeEvent<Message> = {
              type: 'message:created',
              payload: payload.new as Message,
              timestamp: new Date().toISOString(),
            };
            // Call all listeners for this channel
            this.messageListeners.forEach(listeners => listeners.forEach(l => l(event)));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'genit_io',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          payload => {
            console.log('message-updated', payload);
            const event: RealtimeEvent<Message> = {
              type: 'message:updated',
              payload: payload.new as Message,
              timestamp: new Date().toISOString(),
            };

            // Call all listeners for this channel
            this.messageListeners.get(listenerKey)?.forEach(listener => listener(event));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'genit_io',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          payload => {
            console.log('message deleted', payload);
            const event: RealtimeEvent<Message> = {
              type: 'message:deleted',
              payload: payload.old as Message,
              timestamp: new Date().toISOString(),
            };
            // Call all listeners for this channel
            this.messageListeners.get(listenerKey)?.forEach(listener => listener(event));
          }
        )
        .subscribe();

      this.channels.set(channelName, channel);
    }

    return {
      unsubscribe: () => {
        // Remove this specific listener
        const listeners = this.messageListeners.get(listenerKey);
        if (listeners) {
          listeners.delete(onMessage);

          // If no more listeners, unsubscribe from the channel
          if (listeners.size === 0) {
            this.unsubscribe(channelName).catch(err =>
              console.error('Error unsubscribing from messages:', err)
            );
            this.messageListeners.delete(listenerKey);
          }
        }
      },
      isSubscribed: true,
    };
  }

  /**
   * Subscribe to conversation updates
   */
  subscribeToConversation(
    conversationId: number,
    onConversation: (event: RealtimeEvent<Conversation>) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `conversation:${conversationId}`;

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName).catch(err =>
        console.error('Error removing existing conversation channel:', err)
      );
    }

    const channel = this.client!.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'genit_io',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        payload => {
          onConversation({
            type: 'conversation:updated',
            payload: payload.new as Conversation,
            timestamp: new Date().toISOString(),
          });
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      unsubscribe: () => {
        this.unsubscribe(channelName).catch(err =>
          console.error('Error unsubscribing from conversation:', err)
        );
      },
      isSubscribed: true,
    };
  }

  /**
   * Subscribe to contact conversations
   */
  subscribeToContactConversations(
    contactId: number,
    onConversation: (event: RealtimeEvent<Conversation>) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `contact-conversations:${contactId}`;

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName).catch(err =>
        console.error('Error removing existing contact-conversations channel:', err)
      );
    }

    const channel = this.client!.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'genit_io',
          table: 'conversations',
          filter: `or(first_participant_id.eq.${contactId},second_participant_id.eq.${contactId})`,
        },
        payload => {
          onConversation({
            type: 'conversation:created',
            payload: payload.new as Conversation,
            timestamp: new Date().toISOString(),
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'genit_io',
          table: 'conversations',
          filter: `or(first_participant_id.eq.${contactId},second_participant_id.eq.${contactId})`,
        },
        payload => {
          onConversation({
            type: 'conversation:updated',
            payload: payload.new as Conversation,
            timestamp: new Date().toISOString(),
          });
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      unsubscribe: () => {
        this.unsubscribe(channelName).catch(err =>
          console.error('Error unsubscribing from contact-conversations:', err)
        );
      },
      isSubscribed: true,
    };
  }

  /**
   * Subscribe to contact online status
   */
  subscribeToContactStatus(
    projectId: number,
    onStatusChange: (event: RealtimeEvent<Contact>) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `contacts-status:${projectId}`;

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName).catch(err =>
        console.error('Error removing existing contact-status channel:', err)
      );
    }

    const channel = this.client!.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'genit_io',
          table: 'contacts',
          filter: `project_id=eq.${projectId}`,
        },
        payload => {
          const oldContact = payload.old as Contact;
          const newContact = payload.new as Contact;

          // Only emit if online status changed
          if (oldContact.is_online !== newContact.is_online) {
            onStatusChange({
              type: newContact.is_online ? 'contact:online' : 'contact:offline',
              payload: newContact,
              timestamp: new Date().toISOString(),
            });
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      unsubscribe: () => {
        this.unsubscribe(channelName).catch(err =>
          console.error('Error unsubscribing from contact-status:', err)
        );
      },
      isSubscribed: true,
    };
  }

  /**
   * Subscribe to typing indicators
   */
  subscribeToTyping(
    conversationId: number,
    onTyping: (event: RealtimeEvent<TypingEvent>) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `typing:${conversationId}`;

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName).catch(err =>
        console.error('Error removing existing typing channel:', err)
      );
    }

    const channel = this.client!.channel(channelName)
      .on('broadcast', { event: 'typing' }, payload => {
        onTyping({
          type: payload.payload.is_typing ? 'typing:start' : 'typing:stop',
          payload: payload.payload as TypingEvent,
          timestamp: new Date().toISOString(),
        });
      })
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      unsubscribe: () => {
        this.unsubscribe(channelName).catch(err =>
          console.error('Error unsubscribing from typing:', err)
        );
      },
      isSubscribed: true,
    };
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(
    conversationId: number,
    contactId: number,
    isTyping: boolean
  ): Promise<void> {
    this.ensureInitialized();

    const channelName = `typing:${conversationId}`;
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.client!.channel(channelName);
      await channel.subscribe();
      this.channels.set(channelName, channel);
    }

    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        conversation_id: conversationId,
        contact_id: contactId,
        is_typing: isTyping,
      },
    });
  }

  /**
   * Subscribe to presence (who's currently viewing a conversation)
   */
  subscribeToPresence(
    conversationId: number,
    contactId: number,
    onPresenceChange: (presences: Record<string, unknown> | unknown[]) => void
  ): RealtimeSubscription {
    this.ensureInitialized();

    const channelName = `presence:${conversationId}`;

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName).catch(err =>
        console.error('Error removing existing presence channel:', err)
      );
    }

    const channel = this.client!.channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        onPresenceChange(state as Record<string, unknown>);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        onPresenceChange(newPresences as unknown[]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        onPresenceChange(leftPresences as unknown[]);
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            contact_id: contactId,
            online_at: new Date().toISOString(),
          });
        }
      });

    this.channels.set(channelName, channel);

    return {
      unsubscribe: () => {
        this.unsubscribe(channelName).catch(err =>
          console.error('Error unsubscribing from presence:', err)
        );
      },
      isSubscribed: true,
    };
  }

  /**
   * Unsubscribe from a channel
   */
  private async unsubscribe(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (channel) {
      await this.client!.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll(): Promise<void> {
    this.ensureInitialized();

    const channelNames = Array.from(this.channels.keys());
    await Promise.all(channelNames.map(name => this.unsubscribe(name)));
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.client !== null;
  }

  /**
   * Disconnect from Supabase
   */
  async disconnect(): Promise<void> {
    await this.unsubscribeAll();
    this.client = null;
  }
}

// Singleton instance
let realtimeServiceInstance: RealtimeService | null = null;

/**
 * Initialize the real-time service
 */
export function initializeRealtimeService(): RealtimeService {
  if (!realtimeServiceInstance) {
    realtimeServiceInstance = new RealtimeService();
  }
  realtimeServiceInstance.initialize();
  return realtimeServiceInstance;
}

/**
 * Get the real-time service instance
 */
export function getRealtimeService(): RealtimeService {
  if (!realtimeServiceInstance) {
    realtimeServiceInstance = new RealtimeService();
  }
  return realtimeServiceInstance;
}
