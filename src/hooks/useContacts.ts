import { useState, useCallback } from 'react';
import { ContactService } from '../services';
import { Contact, ContactFilters, ApiError } from '../types';

/**
 * Hook for fetching and managing contacts
 */
export function useContacts(filters?: ContactFilters) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchContacts = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await ContactService.getContacts({
          ...filters,
          page,
        });

        console.info('fetchContacts', response);

        if (page === 1) {
          setContacts(response.data);
        } else {
          setContacts(prev => [...prev, ...response.data]);
        }

        setHasMore(response.meta.current_page < response.meta.last_page);
        setCurrentPage(page);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchContacts(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchContacts]);

  const refresh = useCallback(() => {
    fetchContacts(1);
  }, [fetchContacts]);

  /*   useEffect(() => {
    fetchContacts(1);
  }, [fetchContacts]); */

  return {
    contacts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
