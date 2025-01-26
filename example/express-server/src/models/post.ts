import type { PostModel, PostSchema } from "@typed-router/shared-lib/model-types";
import mongoose from "mongoose";

export const postSchema: PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Post: PostModel = mongoose.model("Post", postSchema);
