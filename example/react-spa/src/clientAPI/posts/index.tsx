import { createAPIClient } from "@typed-router/client"
import { PostRouter } from "@typed-router/express-server/post"
import axios from 'redaxios'
import axiosInstance from "../axiosInstance"

export class PostNotFoundError extends Error { }

const postsClient = createAPIClient<PostRouter, typeof axiosInstance>(axiosInstance)
export const fetchPost = async (postId: string) => {
  console.info(`Fetching post with id ${postId}...`)
  const post = await axios
    .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new PostNotFoundError(`Post with id "${postId}" not found!`)
      }
      throw err
    })

  return post
}

export const fetchPosts = async () => {
  console.info('Fetching posts...')
  await new Promise((r) => setTimeout(r, 500))
  return axios
    .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
    .then((r) => r.data.slice(0, 10))
}
