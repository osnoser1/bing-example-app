import useSWR from "swr";

import { fetcher } from "./fetcher";
import { SearchResult } from "./types/search-result";

export function useBingSearch(query: string) {
  return useSWR(
    () => query.trim(),
    query => fetcher<SearchResult[]>("/api/search", { params: { q: query } }),
    { keepPreviousData: true },
  );
}
