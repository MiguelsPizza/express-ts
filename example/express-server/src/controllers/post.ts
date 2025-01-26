import { TypedRouter } from "@typed-router/router";
import type { PostDocument } from "@typed-router/shared-lib/model-types";
import type { JSONSerialized } from "mongoose";

import { Post } from "../models/post";

const postRouter = new TypedRouter()
  .get("/posts/:postId", async (req, res) => {
    const post = await Post.findById(req.params.postId).orFail();
    return res.json(post.toJSON());
  })
  .get<"/posts", { sort?: "asc" | "desc"; limit?: string }, void, JSONSerialized<PostDocument>[]>(
    "/posts",
    async (req, res) => {
      const { sort, limit } = req.query;
      const posts = await Post.find()
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .limit(Number(limit));

      return res.json(posts.map(post => post.toJSON()));
    },
  );

export default postRouter;

export type PostRouter = typeof postRouter;
