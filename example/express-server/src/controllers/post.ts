import type { NewPost, Post } from "@typed-router/shared-lib/schema";
import { TypedRouter } from "@typed-router/router";
import { insertPostSchema, posts } from "@typed-router/shared-lib/schema";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { Database } from "../config/db";
import { zValidator } from "../middleware/zValidator";
import { AppError } from "../util/appError";

export const postQuery = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.string().optional(),
});

export type PostQueyType = z.infer<typeof postQuery>;

const postRouter = new TypedRouter()
  .get("/posts/:postId", async (req, res) => {
    const post = await Database.instance.query.posts.findFirst({
      where: eq(posts.id, parseInt(req.params.postId)),
    });

    if (!post) {
      throw AppError.notFound("Post not found");
    }

    return res.json(post);
  })
  .get<"/posts", PostQueyType, void, Post[]>("/posts", zValidator("query", postQuery), async (req, res) => {
    const { sort, limit } = req.query;

    const results = await Database.instance
      .select()
      .from(posts)
      .orderBy(sort === "asc" ? asc(posts.createdAt) : desc(posts.createdAt))
      .limit(limit ? parseInt(limit) : 10);

    return res.json(results);
  })
  .post<"/posts", void, NewPost, Post>("/posts", zValidator("body", insertPostSchema), async (req, res) => {
    const newPost = await Database.instance.insert(posts).values(req.body).returning();

    return res.status(201).json(newPost[0]);
  })
  .put<"/posts/:postId", void, NewPost, Post>("/posts/:postId", async (req, res) => {
    const validation = insertPostSchema.safeParse(req.body);

    if (!validation.success) {
      throw AppError.badRequest("Invalid post data", {
        validation: validation.error.format(),
      });
    }

    const postId = parseInt(req.params.postId);
    const updatedPost = await Database.instance
      .update(posts)
      .set({
        ...validation.data,
      })
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost.length) {
      throw AppError.notFound("Post not found");
    }

    return res.json(updatedPost[0]);
  })
  .delete("/posts/:postId", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const deletedPost = await Database.instance.delete(posts).where(eq(posts.id, postId)).returning();

    if (!deletedPost.length) {
      throw AppError.notFound("Post not found");
    }

    return res.status(204).json({ message: "post Deleted" });
  });

export default postRouter;

export type PostRouter = typeof postRouter;
