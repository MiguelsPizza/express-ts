import { TypedRouter } from "@typed-router/router";

import { PostObject } from "@typed-router/shared-lib/model-types";
import { Post } from "../models/post";

const postRouter = new TypedRouter()
  .get("/posts/:postId", async (req, res) => {
    const post = await Post.findById(req.params.postId).lean().orFail();
    //infer the res type
    return res.json(post);
  })
  // declare the types
  .get<"/posts", { sort?: "asc" | "desc"; limit?: string }, void, PostObject[]>(
    "/posts",
    async (req, res) => {
      const { sort, limit } = req.query;
      const posts = await Post.find()
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .limit(Number(limit))
        .lean()
      return res.json(posts);
    },
  );

export default postRouter;

export type PostRouter = typeof postRouter;
