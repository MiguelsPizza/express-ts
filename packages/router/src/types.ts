import type { Request, Response } from "express";
// ---------- Type Definitions ----------

import type { ParamsDictionary } from "express-serve-static-core";

/** Supported HTTP methods */
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

/**
 * Enhanced Response type that tracks chained method calls for improved type inference
 * @template ResBody - Type of the response body
 * @template Info - Array tracking method call history
 */
export type TypedResponse<ResBody = unknown, Info extends any[] = []> = {
  status<T extends number>(code: T): TypedResponse<ResBody, [...Info, { status: T }]>;
  links<T extends Record<string, string>>(links: T): TypedResponse<ResBody, [...Info, { links: T }]>;
  sendStatus<T extends number>(code: T): TypedResponse<ResBody, [...Info, { sendStatus: T }]>;
  contentType<T extends string>(type: T): TypedResponse<ResBody, [...Info, { contentType: T }]>;
  type<T extends string>(type: T): TypedResponse<ResBody, [...Info, { type: T }]>;
  format<T extends Record<string, () => void>>(obj: T): TypedResponse<ResBody, [...Info, { format: T }]>;
  attachment<T extends string>(filename?: T): TypedResponse<ResBody, [...Info, { attachment: T | undefined }]>;
  json<T extends ResBody>(body: T): TypedResponse<T, [...Info, { json: T }]>;
  jsonp<T extends ResBody>(body: T): TypedResponse<T, [...Info, { jsonp: T }]>;
  send<T extends ResBody>(body: T): TypedResponse<T, [...Info, { send: T }]>;
} & Omit<
  Response,
  "status" | "links" | "sendStatus" | "contentType" | "type" | "format" | "attachment" | "json" | "jsonp" | "send"
>;

/**
 * Utility type to infer the response type from a handler or promise
 * @template T - The type to infer from (either a Promise or TypedResponse)
 * @returns The inferred response body type
 */
export type InferResponseType<T> =
  T extends Promise<infer U> ? InferResponseType<U> : T extends TypedResponse<infer R, any> ? R : unknown;

/**
 * Extracts path parameters from a route path string
 * @example
 * type Params = ExtractPathParams<'/users/:id/posts/:postId'>;
 * // Result: { id: string; postId: string }
 */
export type ExtractPathParams<T extends string> = string extends T
  ? ParamsDictionary
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractPathParams<Rest>]: string }
    : T extends `${infer _Start}:${infer Param}`
      ? Record<Param, string>
      : {};

/**
 * Type definition for route handlers with typed request/response
 */
export type TypedRequestHandler<TPath extends string, TQuery = any, TBody = any, TResponse = unknown> = (
  req: Request<ExtractPathParams<TPath>, any, TBody, TQuery>,
  res: TypedResponse<TResponse>,
  next: () => void,
) => TypedResponse<TResponse> | Promise<TypedResponse<TResponse>>;

/**
 * Helper type to update the router's type state when adding new routes
 * @internal
 * @template T - Current router type state
 * @template M - HTTP method being added
 * @template P - Route path being added
 * @template RouteInfo - Type information for the new route
 * @returns Updated router type state including the new route
 */
export type UpdateRouter<
  T extends Partial<Record<HttpMethod, Record<string, { query: any; body: any; response: any }>>>,
  M extends HttpMethod,
  P extends string,
  RouteInfo extends { query: any; body: any; response: any },
> = Omit<T, M> & Record<M, T[M] extends Record<string, any> ? T[M] & Record<P, RouteInfo> : Record<P, RouteInfo>>;
