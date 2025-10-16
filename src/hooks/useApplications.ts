// hooks/useApplications.ts
import { useCallback, useEffect, useState } from "react";
import {
  fetchApplications,
  TApplication,
  TPaginationInfo,
} from "../api/fetchApplications";

type TUseApplicationsResult = {
  applications: TApplication[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useApplications(
  initialPage = 1,
  limit = 5
): TUseApplicationsResult {
  const [applications, setApplications] = useState<TApplication[]>([]);

  const [pagination, setPagination] = useState<TPaginationInfo>({
    currentPage: initialPage,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (page: number, append = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const { applications: chunk, pagination } = await fetchApplications(
          page,
          limit
        );

        setPagination(pagination);
        setApplications((prev) => (append ? [...prev, ...chunk] : chunk));
      } catch (error) {
        setError(error.message ? error.message : "Loading applications failed");
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    load(initialPage, false);
  }, [initialPage, load]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasNext || isLoading) return;
    await load(pagination.currentPage + 1, true);
  }, [pagination, isLoading, load]);

  const refresh = useCallback(async () => {
    await load(initialPage, false);
  }, [initialPage, load]);

  return {
    applications,
    isLoading,
    error,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    loadMore,
    refresh,
  };
}
