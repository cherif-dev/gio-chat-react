import { useState, useEffect, useCallback } from 'react';
import { ConversationService } from '../services';
import {
  UpdateConversationRequest,
  AssignConversationRequest,
  UpdateConversationStatusRequest,
  ApiError,
} from '../types';
import { useCurrentConversation, useIsInitialized } from '../context';

/**
 * Hook for fetching and managing a single conversation
 */
export function useConversation(contactUuid: string | null, participantUuid: string | null) {
  const isInitialized = useIsInitialized();
  const [conversation, setConversation] = useCurrentConversation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const fetchConversation = useCallback(async () => {
    if (!contactUuid || !participantUuid || !isInitialized) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await ConversationService.getConversation(contactUuid, participantUuid);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [contactUuid, participantUuid, isInitialized, setConversation]);

  const updateConversation = useCallback(
    async (data: UpdateConversationRequest) => {
      if (!contactUuid || !conversation) return;

      try {
        setUpdating(true);
        setError(null);

        const response = await ConversationService.updateConversation(
          contactUuid,
          conversation.id,
          data
        );
        setConversation(response.data);

        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [contactUuid, conversation]
  );

  const assignConversation = useCallback(
    async (data: AssignConversationRequest) => {
      if (!contactUuid || !conversation) return;

      try {
        setUpdating(true);
        const response = await ConversationService.assignConversation(
          contactUuid,
          conversation.id,
          data
        );
        setConversation(response.data);
        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [contactUuid, conversation]
  );

  const unassignConversation = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      setUpdating(true);
      const response = await ConversationService.unassignConversation(contactUuid, conversation.id);
      setConversation(response.data);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [contactUuid, conversation]);

  const updateStatus = useCallback(
    async (data: UpdateConversationStatusRequest) => {
      if (!contactUuid || !conversation) return;

      try {
        setUpdating(true);
        const response = await ConversationService.updateConversationStatus(
          contactUuid,
          conversation.id,
          data
        );
        setConversation(response.data);
        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [contactUuid, conversation]
  );

  const pin = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.pinConversation(contactUuid, conversation.id);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const unpin = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.unpinConversation(contactUuid, conversation.id);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const star = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.starConversation(contactUuid, conversation.id);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const unstar = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.unstarConversation(contactUuid, conversation.id);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const archive = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.archiveConversation(contactUuid, conversation.id);
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const unarchive = useCallback(async () => {
    if (!contactUuid || !conversation) return;

    try {
      const response = await ConversationService.unarchiveConversation(
        contactUuid,
        conversation.id
      );
      setConversation(response.data);
    } catch (err) {
      setError(err as ApiError);
    }
  }, [contactUuid, conversation]);

  const refresh = useCallback(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (isInitialized) {
      fetchConversation();
    }
  }, [isInitialized, fetchConversation]);

  return {
    conversation,
    loading,
    error,
    updating,
    updateConversation,
    assignConversation,
    unassignConversation,
    updateStatus,
    pin,
    unpin,
    star,
    unstar,
    archive,
    unarchive,
    refresh,
  };
}
