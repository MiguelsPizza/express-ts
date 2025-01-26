import type { ErrorComponentProps } from "@tanstack/react-router";
import * as React from "react";
import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent, useRouter } from "@tanstack/react-router";

import { PostNotFoundError } from "../clientAPI/posts";
import { postQueryOptions } from "../clientAPI/posts/postQueryOptions";

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ context: { queryClient }, params: { postId } }) => {
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  errorComponent: PostErrorComponent,
  component: PostComponent,
});

export function PostErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  React.useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  if (error instanceof PostNotFoundError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          router.invalidate();
        }}
      >
        retry
      </button>
      <ErrorComponent error={error} />
    </div>
  );
}

function PostComponent() {
  const postId = Route.useParams().postId;
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{post.title}</h4>
      <div className="text-sm">{post.body}</div>
    </div>
  );
}
