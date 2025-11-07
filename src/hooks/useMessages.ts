import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageService } from '../services';
import {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageFilters,
  ApiError,
  RealtimeEvent,
} from '../types';
import { useRealtimeMessages } from './useRealtime';
import { useCurrentConversation, useIsInitialized } from '../context';

/**
 * Hook for fetching and managing messages
 */
export function useMessages(filters?: MessageFilters) {
  const [conversation] = useCurrentConversation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useIsInitialized();

  const fetchMessages = useCallback(
    async (page: number = 1) => {
      if (!conversation || !isInitialized) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await MessageService.getMessages(conversation?.uuid, {
          ...filters,
          page,
        });

        if (page === 1) {
          setMessages(response.data);
        } else {
          // Prepend older messages
          setMessages(prev => [...response.data, ...prev]);
        }

        setHasMore(response.meta.current_page < response.meta.last_page);
        setCurrentPage(page);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [conversation, filters, isInitialized]
  );

  const sendMessage = useCallback(
    async (data: CreateMessageRequest) => {
      if (!conversation) return;
      try {
        setSending(true);
        setError(null);

        const response = await MessageService.createMessage(conversation?.uuid, data);

        // Add the new message to the list
        // setMessages(prev => [...prev, response.data]);

        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversation]
  );

  const receiveMessage = useCallback(
    async (message_uuid: string) => {
      if (!conversation) return;

      try {
        const response = await MessageService.getMessage(conversation?.uuid, message_uuid);

        // add the message to the list
        setMessages(prev => [...prev, response.data]);
        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      }
    },
    [conversation]
  );

  const refreshMessage = useCallback(
    async (message_uuid: string) => {
      if (!conversation) return;

      try {
        const response = await MessageService.getMessage(conversation?.uuid, message_uuid);

        // Update the message in the list
        setMessages(prev => prev.map(msg => (msg.uuid === message_uuid ? response.data : msg)));

        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      }
    },
    [conversation]
  );

  const updateMessage = useCallback(
    async (message_uuid: string, data: UpdateMessageRequest) => {
      if (!conversation) return;

      try {
        const response = await MessageService.updateMessage(conversation?.uuid, message_uuid, data);

        // Update the message in the list
        setMessages(prev => prev.map(msg => (msg.uuid === message_uuid ? response.data : msg)));

        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      }
    },
    [conversation]
  );

  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!conversation) return;

      try {
        await MessageService.deleteMessage(conversation?.uuid, messageId);

        // Remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } catch (err) {
        setError(err as ApiError);
        throw err;
      }
    },
    [conversation]
  );

  const markAsRead = useCallback(
    async (messageId: number) => {
      if (!conversation) return;

      try {
        const response = await MessageService.markAsRead(conversation?.uuid, messageId);

        // Update the message in the list
        setMessages(prev => prev.map(msg => (msg.id === messageId ? response.data : msg)));
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    },
    [conversation]
  );

  const markAsDelivered = useCallback(
    async (messageId: number) => {
      if (!conversation) return;

      try {
        const response = await MessageService.markAsDelivered(conversation?.uuid, messageId);

        // Update the message in the list
        setMessages(prev => prev.map(msg => (msg.id === messageId ? response.data : msg)));
      } catch (err) {
        console.error('Error marking message as delivered:', err);
      }
    },
    [conversation]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMessages(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchMessages]);

  const refresh = useCallback(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (conversation) {
      fetchMessages(1);
    }
  }, [conversation, fetchMessages]);
  // Subscribe to real-time message updates
  useRealtimeMessages(conversation?.id || null, 'use-message', (event: RealtimeEvent<Message>) => {
    switch (event.type) {
      case 'message:created':
        receiveMessage(event.payload.uuid);
        break;
      case 'message:updated':
        refreshMessage(event.payload.uuid);
        break;
    }
  });
  return {
    messages,
    loading,
    error,
    sending,
    hasMore,
    messagesEndRef,
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
    markAsDelivered,
    loadMore,
    refresh,
    scrollToBottom,
  };
}
