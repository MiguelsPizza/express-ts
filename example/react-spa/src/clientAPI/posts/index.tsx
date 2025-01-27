import type { PostRouter } from "@express-ts-rpc/express-server";
import type { NewPost } from "@express-ts-rpc/shared-lib/schema";
import { createAPIClient } from "@express-ts-rpc/client";

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
  return postsClient.posts.get({
    query: {
      sort: "desc",
      limit: "10",
    },
    body: undefined,
    params: {},
  });
};

export const createPost = async (newPost: NewPost) => {
  console.info("Creating new post...");
  const response = await postsClient.posts.post({
    body: newPost,
    query: undefined,
    params: {},
  });
  return response;
};

export const updatePost = async (postId: string, updatedPost: NewPost) => {
  console.info(`Updating post with id ${postId}...`);
  const response = await postsClient.posts[":postId"].put({
    params: { postId },
    body: updatedPost,
    query: undefined,
  });
  return response;
};

export const deletePost = async (postId: string) => {
  console.info(`Deleting post with id ${postId}...`);
  const response = await postsClient.posts[":postId"].delete({
    params: { postId },
    query: undefined,
    body: undefined,
  });
  return response;
};
