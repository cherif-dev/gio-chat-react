import { useState, useCallback, useEffect } from 'react';
import { ConversationService } from '../services';
import { Conversation, ConversationFilters, ApiError } from '../types';
import { useIsInitialized } from '../context';

/**
 * Hook for fetching and managing conversations
 */
export function useConversations(contactUuid: string | null, filters?: ConversationFilters) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isInitialized = useIsInitialized();

  const fetchConversations = useCallback(
    async (page: number = 1) => {
      if (!contactUuid || !isInitialized) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await ConversationService.getConversations(contactUuid, {
          ...filters,
          page,
        });
        if (page === 1) {
          setConversations(response.data);
        } else {
          setConversations(prev => [...prev, ...response.data]);
        }
        setHasMore(response.meta.current_page < response.meta.last_page);
        setCurrentPage(page);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [contactUuid, filters, isInitialized]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchConversations(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations(1);
  }, [fetchConversations]);
  useEffect(() => {
    if (isInitialized && contactUuid) {
      fetchConversations(1);
    }
  }, [contactUuid, isInitialized]);
  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
