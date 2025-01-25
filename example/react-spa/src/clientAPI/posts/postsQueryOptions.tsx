import { queryOptions } from '@tanstack/react-query'
import { fetchPosts } from '.'

export const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
})
