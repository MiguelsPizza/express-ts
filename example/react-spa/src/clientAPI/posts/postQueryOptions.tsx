import { queryOptions } from "@tanstack/react-query";

import { fetchPost } from ".";

export const postQueryKey = (postId: string) => ["posts", { postId }] as const

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: postQueryKey(postId),
    queryFn: () => fetchPost(postId),
  });
