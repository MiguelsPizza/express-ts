import { createAPIClient } from "@typed-router/client";

import { NewPost, PostRouter } from "@typed-router/express-server";
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



export const createPost = async (newPost: NewPost) => {
  console.info("Creating new post...");
  return postsClient.posts.post({
    body: newPost,
    query: undefined,
    params: {},
  });
};

export const updatePost = async (postId: string, updatedPost: NewPost) => {
  console.info(`Updating post with id ${postId}...`);
  return postsClient.posts[":postId"].put({
    params: { postId },
    body: updatedPost,
    query: undefined,
  });
};

export const deletePost = async (postId: string) => {
  console.info(`Deleting post with id ${postId}...`);
  return postsClient.posts[":postId"].delete({
    params: { postId },
    query: undefined,
    body: undefined,
  });
};
