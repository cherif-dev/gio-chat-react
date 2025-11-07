import { useState, useEffect, useCallback } from 'react';
import { ContactService } from '../services';
import { Contact, UpdateContactRequest, ApiError } from '../types';

/**
 * Hook for fetching and managing a single contact
 */
export function useContact(uuid: string | null) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchContact = useCallback(async () => {
    if (!uuid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await ContactService.getContact(uuid);
      setContact(response.data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  const updateContact = useCallback(
    async (data: UpdateContactRequest) => {
      if (!uuid) return;

      try {
        setUpdating(true);
        setError(null);

        const response = await ContactService.updateContact(uuid, data);
        setContact(response.data);

        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [uuid]
  );

  const updateOnlineStatus = useCallback(
    async (isOnline: boolean) => {
      if (!uuid) return;

      try {
        const response = await ContactService.updateOnlineStatus(uuid, { is_online: isOnline });
        setContact(response.data);
      } catch (err) {
        console.error('Error updating online status:', err);
      }
    },
    [uuid]
  );

  const refresh = useCallback(() => {
    fetchContact();
  }, [fetchContact]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return {
    contact,
    loading,
    error,
    updating,
    updateContact,
    updateOnlineStatus,
    refresh,
  };
}

