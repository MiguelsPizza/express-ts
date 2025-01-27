import type { NewPost } from "@typed-router/shared-lib/schema";
import type { ErrorComponentProps } from "@tanstack/react-router";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { insertPostSchema } from "@typed-router/shared-lib/schema";
import { useForm } from "react-hook-form";

import { deletePost, PostNotFoundError } from "../clientAPI/posts";
import { updatePost } from "../clientAPI/posts/index";
import { postQueryKey, postQueryOptions } from "../clientAPI/posts/postQueryOptions";
import { postsQueryKeys } from "../clientAPI/posts/postsQueryOptions";

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ context: { queryClient }, params: { postId } }) => {
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  errorComponent: PostErrorComponent,
  component: PostComponent,
});

export function PostErrorComponent({ error }: ErrorComponentProps) {
  const router = Route.router;

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
          router?.invalidate();
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
  const navigate = Route.useNavigate();
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const { queryClient } = Route.useRouteContext();
  const [isEditing, setIsEditing] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  });

  // Reset form when switching posts or canceling edit
  React.useEffect(() => {
    reset({
      title: post.title,
      body: post.body,
    });
  }, [post, reset]);

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, updatedPost }: { postId: string; updatedPost: NewPost }) => updatePost(postId, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKey(postId) });
      queryClient.invalidateQueries({ queryKey: postsQueryKeys });
      setIsEditing(false);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys });
      navigate({ to: "/posts" });
    },
  });

  const onSubmit = (data: NewPost) => {
    updatePostMutation.mutate({
      postId,
      updatedPost: data,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {!isEditing ? (
        // View mode
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xl font-bold underline">{post.title}</h4>
            <div className="text-sm whitespace-pre-wrap">{post.body}</div>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Edit Post
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this post?")) {
                  deletePostMutation.mutate(postId);
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        </div>
      ) : (
        // Edit mode
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">Title</span>
              <input
                {...register("title")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </label>

            <label className="block">
              <span className="text-gray-700">Content</span>
              <textarea
                {...register("body")}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.body && <span className="text-red-500 text-sm">{errors.body.message}</span>}
            </label>
          </div>

          <div className="space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              disabled={updatePostMutation.isPending}
            >
              Cancel
            </button>
          </div>

          {updatePostMutation.isError && (
            <div className="text-red-500">Error updating post: {updatePostMutation.error.message}</div>
          )}
        </form>
      )}

      {deletePostMutation.isError && (
        <div className="text-red-500">Error deleting post: {deletePostMutation.error.message}</div>
      )}
    </div>
  );
}
