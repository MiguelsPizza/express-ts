import type { PostRouter } from "@typed-router/express-server/post";
import { createAPIClient } from "@typed-router/client";

import axiosInstance from "../axiosInstance";

export class PostNotFoundError extends Error {}

const postsClient = createAPIClient<PostRouter>(axiosInstance);

export const fetchPost = async (postId: string) => {
  console.info(`Fetching post with id ${postId}...`);
  const post = await postsClient.posts[":postId"].get({
    params: { postId },
    query: undefined,
    body: undefined,
  });

  return post;
};

export const fetchPosts = async () => {
  console.info("Fetching posts...");
  await new Promise((r) => setTimeout(r, 500));
  return postsClient.posts.get({
    query: {
      sort: "desc",
      limit: "10",
    },
    body: undefined,
    params: {},
  });
};
