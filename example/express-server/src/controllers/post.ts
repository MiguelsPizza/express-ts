import { TypedRouter } from "@typed-router/router";
import type { PostDocument } from "@typed-router/shared-lib/model-types";
import type { JSONSerialized } from "mongoose";

import { Post } from "../models/post";

const postRouter = new TypedRouter()
  .get<"/posts/:postId", void, void, JSONSerialized<PostDocument>>("/posts/:postId", async (req, res) => {
    const post = await Post.findById(req.params.postId).orFail();
    return res.json(post);
  })
  .get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(10);

    return res.json(posts);
  });

export default postRouter;

export type PostRouter = typeof postRouter
