import { useEffect, useCallback, useRef } from 'react';
import { getRealtimeService } from '../services/realtime';
import { RealtimeEvent, Message, Conversation, Contact, TypingEvent } from '../types';

/**
 * Hook for subscribing to real-time message updates
 * Each call to this hook registers a new event listener
 */
export function useRealtimeMessages(
  conversationId: number | null,
  name: string,
  onMessage: (event: RealtimeEvent<Message>) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  if (!conversationId) return;
  const realtimeService = getRealtimeService();
  console.log('supabase connected', realtimeService.isConnected());
  if (!realtimeService.isConnected()) {
    console.warn('Realtime service not initialized');
    return;
  }

  // Each hook call creates its own subscription
  const subscription = realtimeService.subscribeToMessages(
    conversationId,
    name,
    (event: RealtimeEvent<Message>) => onMessage(event)
  );
  unsubscribeRef.current = subscription.unsubscribe;

  return () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };
}

/**
 * Hook for subscribing to real-time conversation updates
 */
export function useRealtimeConversation(
  conversationId: number | null,
  onConversation: (event: RealtimeEvent<Conversation>) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onConversationRef = useRef(onConversation);

  // Update ref when callback changes
  useEffect(() => {
    onConversationRef.current = onConversation;
  }, [onConversation]);

  useEffect(() => {
    if (!conversationId) return;

    const realtimeService = getRealtimeService();

    if (!realtimeService.isConnected()) {
      console.warn('Realtime service not initialized');
      return;
    }

    // Use the ref callback to always call the latest version
    const subscription = realtimeService.subscribeToConversation(
      conversationId,
      (event: RealtimeEvent<Conversation>) => onConversationRef.current(event)
    );
    unsubscribeRef.current = subscription.unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [conversationId]);
}

/**
 * Hook for subscribing to contact conversations
 */
export function useRealtimeContactConversations(
  contactId: number | null,
  onConversation: (event: RealtimeEvent<Conversation>) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onConversationRef = useRef(onConversation);

  // Update ref when callback changes
  useEffect(() => {
    onConversationRef.current = onConversation;
  }, [onConversation]);

  useEffect(() => {
    if (!contactId) return;

    const realtimeService = getRealtimeService();

    if (!realtimeService.isConnected()) {
      console.warn('Realtime service not initialized');
      return;
    }

    // Use the ref callback to always call the latest version
    const subscription = realtimeService.subscribeToContactConversations(
      contactId,
      (event: RealtimeEvent<Conversation>) => onConversationRef.current(event)
    );
    unsubscribeRef.current = subscription.unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [contactId]);
}

/**
 * Hook for subscribing to contact online status
 */
export function useRealtimeContactStatus(
  projectId: number | null,
  onStatusChange: (event: RealtimeEvent<Contact>) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);

  // Update ref when callback changes
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (!projectId) return;

    const realtimeService = getRealtimeService();

    if (!realtimeService.isConnected()) {
      console.warn('Realtime service not initialized');
      return;
    }

    // Use the ref callback to always call the latest version
    const subscription = realtimeService.subscribeToContactStatus(
      projectId,
      (event: RealtimeEvent<Contact>) => onStatusChangeRef.current(event)
    );
    unsubscribeRef.current = subscription.unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [projectId]);
}

/**
 * Hook for typing indicators
 */
export function useTypingIndicator(conversationId: number | null, contactId: number | null) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendTypingIndicator = useCallback(
    async (isTyping: boolean) => {
      if (!conversationId || !contactId) return;

      const realtimeService = getRealtimeService();

      if (!realtimeService.isConnected()) {
        return;
      }

      await realtimeService.sendTypingIndicator(conversationId, contactId, isTyping);
    },
    [conversationId, contactId]
  );

  const startTyping = useCallback(() => {
    sendTypingIndicator(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
  }, [sendTypingIndicator]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTypingIndicator(false);
  }, [sendTypingIndicator]);

  const subscribeToTyping = useCallback(
    (onTyping: (event: RealtimeEvent<TypingEvent>) => void) => {
      if (!conversationId) return;

      const realtimeService = getRealtimeService();

      if (!realtimeService.isConnected()) {
        console.warn('Realtime service not initialized');
        return;
      }

      const subscription = realtimeService.subscribeToTyping(conversationId, onTyping);
      unsubscribeRef.current = subscription.unsubscribe;
    },
    [conversationId]
  );

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    startTyping,
    stopTyping,
    subscribeToTyping,
  };
}

/**
 * Hook for presence (who's viewing the conversation)
 */
export function usePresence(conversationId: number | null, contactId: number | null) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const subscribeToPresence = useCallback(
    (onPresenceChange: (presences: Record<string, unknown> | unknown[]) => void) => {
      if (!conversationId || !contactId) return;

      const realtimeService = getRealtimeService();

      if (!realtimeService.isConnected()) {
        console.warn('Realtime service not initialized');
        return;
      }

      const subscription = realtimeService.subscribeToPresence(
        conversationId,
        contactId,
        onPresenceChange
      );
      unsubscribeRef.current = subscription.unsubscribe;
    },
    [conversationId, contactId]
  );

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    subscribeToPresence,
  };
}
