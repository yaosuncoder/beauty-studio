import { useCallback, useRef } from "react";

export function useLatestRequest() {
  const requestId = useRef(0);

  return useCallback(async function fetchWithLatestRequest<T>(
    fetchFunction: () => Promise<T>,
  ): Promise<T> {
    const currentRequestId = ++requestId.current;
    const result = await fetchFunction();

    if (currentRequestId !== requestId.current) {
      throw new Error("Request was superseded by a newer request.");
    }
    
    return result;
  }, []);
}