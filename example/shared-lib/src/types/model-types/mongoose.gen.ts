/* eslint-disable */

// ######################################## THIS FILE WAS GENERATED BY MONGOOSE-TSGEN ######################################## //

// NOTE: ANY CHANGES MADE WILL BE OVERWRITTEN ON SUBSEQUENT EXECUTIONS OF MONGOOSE-TSGEN.

import mongoose from "mongoose";

/**
 * Lean version of PostDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `PostDocument.toObject()`. To avoid conflicts with model names, use the type alias `PostObject`.
 * ```
 * const postObject = post.toObject();
 * ```
 */
export type Post = {
  title: string;
  body: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of PostDocument (type alias of `Post`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Post } from "../models"
 * import { PostObject } from "../interfaces/mongoose.gen.ts"
 *
 * const postObject: PostObject = post.toObject();
 * ```
 */
export type PostObject = Post;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type PostQuery = mongoose.Query<any, PostDocument, PostQueries> &
  PostQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `PostSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type PostQueries = {};

export type PostMethods = {};

export type PostStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Post = mongoose.model<PostDocument, PostModel>("Post", PostSchema);
 * ```
 */
export type PostModel = mongoose.Model<PostDocument, PostQueries> & PostStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Post schema instances:
 * ```
 * const PostSchema: PostSchema = new mongoose.Schema({ ... })
 * ```
 */
export type PostSchema = mongoose.Schema<
  PostDocument,
  PostModel,
  PostMethods,
  PostQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Post = mongoose.model<PostDocument, PostModel>("Post", PostSchema);
 * ```
 */
export type PostDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  PostQueries
> &
  PostMethods & {
    title: string;
    body: string;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Lean version of UserDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type User = {
  firstName?: string;
  lastName?: string;
  displayName: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of UserDocument (type alias of `User`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { User } from "../models"
 * import { UserObject } from "../interfaces/mongoose.gen.ts"
 *
 * const userObject: UserObject = user.toObject();
 * ```
 */
export type UserObject = User;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type UserQuery = mongoose.Query<any, UserDocument, UserQueries> &
  UserQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `UserSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type UserQueries = {};

export type UserMethods = {};

export type UserStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserModel = mongoose.Model<UserDocument, UserQueries> & UserStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new User schema instances:
 * ```
 * const UserSchema: UserSchema = new mongoose.Schema({ ... })
 * ```
 */
export type UserSchema = mongoose.Schema<
  UserDocument,
  UserModel,
  UserMethods,
  UserQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  UserQueries
> &
  UserMethods & {
    firstName?: string;
    lastName?: string;
    displayName: string;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Check if a property on a document is populated:
 * ```
 * import { IsPopulated } from "../interfaces/mongoose.gen.ts"
 *
 * if (IsPopulated<UserDocument["bestFriend"]>) { ... }
 * ```
 */
export function IsPopulated<T>(doc: T | mongoose.Types.ObjectId): doc is T {
  return doc instanceof mongoose.Document;
}

/**
 * Helper type used by `PopulatedDocument`. Returns the parent property of a string
 * representing a nested property (i.e. `friend.user` -> `friend`)
 */
type ParentProperty<T> = T extends `${infer P}.${string}` ? P : never;

/**
 * Helper type used by `PopulatedDocument`. Returns the child property of a string
 * representing a nested property (i.e. `friend.user` -> `user`).
 */
type ChildProperty<T> = T extends `${string}.${infer C}` ? C : never;

/**
 * Helper type used by `PopulatedDocument`. Removes the `ObjectId` from the general union type generated
 * for ref documents (i.e. `mongoose.Types.ObjectId | UserDocument` -> `UserDocument`)
 */
type PopulatedProperty<Root, T extends keyof Root> = Omit<Root, T> & {
  [ref in T]: Root[T] extends mongoose.Types.Array<infer U>
    ? mongoose.Types.Array<Exclude<U, mongoose.Types.ObjectId>>
    : Exclude<Root[T], mongoose.Types.ObjectId>;
};

/**
 * Populate properties on a document type:
 * ```
 * import { PopulatedDocument } from "../interfaces/mongoose.gen.ts"
 *
 * function example(user: PopulatedDocument<UserDocument, "bestFriend">) {
 *   console.log(user.bestFriend._id) // typescript knows this is populated
 * }
 * ```
 */
export type PopulatedDocument<DocType, T> = T extends keyof DocType
  ? PopulatedProperty<DocType, T>
  : ParentProperty<T> extends keyof DocType
  ? Omit<DocType, ParentProperty<T>> & {
      [ref in ParentProperty<T>]: DocType[ParentProperty<T>] extends mongoose.Types.Array<
        infer U
      >
        ? mongoose.Types.Array<
            ChildProperty<T> extends keyof U
              ? PopulatedProperty<U, ChildProperty<T>>
              : PopulatedDocument<U, ChildProperty<T>>
          >
        : ChildProperty<T> extends keyof DocType[ParentProperty<T>]
        ? PopulatedProperty<DocType[ParentProperty<T>], ChildProperty<T>>
        : PopulatedDocument<DocType[ParentProperty<T>], ChildProperty<T>>;
    }
  : DocType;

/**
 * Helper types used by the populate overloads
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Augment mongoose with Query.populate overloads
 */
declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}> {
    populate<T extends string>(
      path: T,
      select?: string | any,
      model?: string | Model<any, THelpers>,
      match?: any
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;

    populate<T extends string>(
      options: Modify<PopulateOptions, { path: T }> | Array<PopulateOptions>
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;
  }
}
