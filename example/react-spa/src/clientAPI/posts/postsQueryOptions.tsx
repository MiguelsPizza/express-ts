import { queryOptions } from "@tanstack/react-query";

import { fetchPosts } from ".";

export const postsQueryKeys = ["posts"] as const;
export const postsQueryOptions = queryOptions({
  queryKey: postsQueryKeys,
  queryFn: () => fetchPosts(),
});
