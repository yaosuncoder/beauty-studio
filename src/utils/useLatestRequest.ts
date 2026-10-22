import { useCallback, useEffect, useRef } from "react";

export function useLatestRequest() {
  const requestId = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestId.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, []);

  return useCallback(
    async function fetchWithLatestRequest<T>(
      fetchFunction: (signal: AbortSignal) => Promise<T>,
    ): Promise<T> {
      const currentRequestId = ++requestId.current;
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const result = await fetchFunction(controller.signal);

        if (currentRequestId !== requestId.current) {
          throw new DOMException("Request was aborted.", "AbortError");
        }

        return result;
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    },
    [],
  );
}

function isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === "AbortError";
}