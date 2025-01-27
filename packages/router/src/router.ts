/**
 * @fileoverview TypedRouter implementation for Express providing Hono-style type inference
 * @module express-ts-rpc
 */

import type { HttpMethod, InferResponseType, TypedRequestHandler, TypedResponse, UpdateRouter } from "./types";
import type { NextFunction, Request, RequestHandler, Response, RouterOptions } from "express";
import { Router } from "express";

/**
 * Creates a new TypedResponse instance wrapping an Express Response
 * @internal
 * @template ResBody - Type of the response body
 * @template Info - Array tracking method call history
 * @param res - The Express Response object to wrap
 * @returns A typed response object with enhanced type information
 */
export function createTypedResponse<ResBody = never, Info extends any[] = []>(
  res: Response,
): TypedResponse<ResBody, Info> {
  const typedRes = Object.create(res) as TypedResponse<ResBody, Info>;

  /**
   * Sets the HTTP status code for the response
   * @template T - Status code type (number)
   * @param code - HTTP status code
   * @returns TypedResponse with updated type information
   */
  typedRes.status = function status<T extends number>(code: T) {
    res.status(code);
    return createTypedResponse<ResBody, [...Info, { status: T }]>(res);
  };

  /**
   * Sets the Link header field with the given links
   * @template T - Links object type
   * @param links - Object with URLs as values
   * @returns TypedResponse with updated type information
   */
  typedRes.links = function links<T extends Record<string, string>>(links: T) {
    res.links(links);
    return createTypedResponse<ResBody, [...Info, { links: T }]>(res);
  };

  /**
   * Sets the response status code and sends its string representation
   * @template T - Status code type (number)
   * @param code - HTTP status code
   * @returns TypedResponse with updated type information
   */
  typedRes.sendStatus = function sendStatus<T extends number>(code: T) {
    res.sendStatus(code);
    return createTypedResponse<ResBody, [...Info, { sendStatus: T }]>(res);
  };

  /**
   * Sets the Content-Type HTTP header
   * @template T - Content type string
   * @param type - MIME type string
   * @returns TypedResponse with updated type information
   */
  typedRes.contentType = function contentType<T extends string>(type: T) {
    res.contentType(type);
    return createTypedResponse<ResBody, [...Info, { contentType: T }]>(res);
  };

  /**
   * Sets the Content-Type HTTP header (alias of contentType)
   * @template T - Content type string
   * @param type - MIME type string
   * @returns TypedResponse with updated type information
   */
  typedRes.type = function type<T extends string>(type: T) {
    res.type(type);
    return createTypedResponse<ResBody, [...Info, { type: T }]>(res);
  };

  /**
   * Performs content-negotiation based on the Accept HTTP header
   * @template T - Format handlers object type
   * @param obj - Object with format handlers
   * @returns TypedResponse with updated type information
   */
  typedRes.format = function format<T extends Record<string, () => void>>(obj: T) {
    res.format(obj);
    return createTypedResponse<ResBody, [...Info, { format: T }]>(res);
  };

  /**
   * Sets the Content-Disposition header for file attachment
   * @template T - Filename type
   * @param filename - Optional filename for the attachment
   * @returns TypedResponse with updated type information
   */
  typedRes.attachment = function attachment<T extends string>(filename?: T) {
    res.attachment(filename);
    return createTypedResponse<ResBody, [...Info, { attachment: T | undefined }]>(res);
  };

  /**
   * Sends a JSON response with the correct content-type
   * @template T - JSON response body type
   * @param body - Response data to be serialized as JSON
   * @returns TypedResponse with updated type information
   */
  typedRes.json = function json<T>(body: T) {
    res.json(body);
    return createTypedResponse<T, [...Info, { json: T }]>(res);
  };

  /**
   * Sends a JSONP response with the correct content-type
   * @template T - JSONP response body type
   * @param body - Response data to be serialized as JSONP
   * @returns TypedResponse with updated type information
   */
  typedRes.jsonp = function jsonp<T>(body: T) {
    res.jsonp(body);
    return createTypedResponse<T, [...Info, { jsonp: T }]>(res);
  };

  /**
   * Sends the HTTP response with various type support
   * @template T - Response body type
   * @param body - Response data (string, object, Buffer, etc.)
   * @returns TypedResponse with updated type information
   */
  typedRes.send = function send<T>(body: T) {
    res.send(body);
    return createTypedResponse<T, [...Info, { send: T }]>(res);
  };

  return typedRes;
}

/**
 * TypedRouter class providing type-safe route definitions for Express
 * @template T - Current type state of defined routes
 * @example
 * ```typescript
 * const router = new TypedRouter()
 *   .get<'/users/:id', { fields?: string[] }, never, User>(
 *     '/users/:id',
 *     async (req, res) => {
 *       const { id } = req.params; // typed as string
 *       const { fields } = req.query; // typed as string[] | undefined
 *       return res.json({ id, name: 'John' });
 *     }
 *   );
 * ```
 */
export class TypedRouter<
  T extends Partial<Record<HttpMethod, Record<string, { query: any; body: any; response: any }>>> = {},
> {
  /** @internal Underlying Express router instance */
  private router: Router;

  /**
   * Creates a new TypedRouter instance
   * @param options - Express RouterOptions configuration
   */
  constructor(options: RouterOptions = {}) {
    this.router = Router(options);
  }

  /**
   * Internal method to add a route with type checking
   * @internal
   * @template M - HTTP method
   * @template P - Route path with params
   * @template TQuery - Query parameters type
   * @template TBody - Request body type
   * @template TResponse - Response body type
   * @template Handler - Route handler type
   * @param method - HTTP method to register
   * @param path - Route path pattern
   * @param handlers - Array of middleware and final handler
   * @returns Updated TypedRouter instance with new route type information
   */
  private addRoute<
    M extends HttpMethod,
    P extends string,
    TQuery = any,
    TBody = any,
    TResponse = unknown,
    Handler extends TypedRequestHandler<P, TQuery, TBody, TResponse> = TypedRequestHandler<P, TQuery, TBody, TResponse>,
  >(
    method: M,
    path: P,
    handlers: [...RequestHandler[], Handler],
  ): TypedRouter<
    UpdateRouter<
      T,
      M,
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse extends unknown ? InferResponseType<ReturnType<Handler>> : TResponse;
      }
    >
  > {
    const middlewares = handlers.slice(0, -1) as RequestHandler[];
    const handler = handlers[handlers.length - 1] as Handler;

    const wrappedHandler = (req: Request, res: Response, next: NextFunction) => {
      const typedRes = createTypedResponse(res);
      const result = handler(req as any, typedRes, next);
      if (result instanceof Promise) {
        return result.catch(next);
      }
      return result;
    };

    (this.router as any)[method](path, ...middlewares, wrappedHandler);

    return this as any;
  }

  /** @internal Helper property for type inference */
  private __t!: T;

  /**
   * Registers a GET route with type checking
   * @template P - Route path with params
   * @template Handler - Route handler type
   * @param path - Route path (e.g., '/users/:id')
   * @param handlers - Middleware and route handler
   * @returns Updated TypedRouter instance
   * @example
   * ```typescript
   * router.get('/users/:id', async (req, res) => {
   *   const { id } = req.params; // typed as string
   *   return res.json({ id });
   * });
   * ```
   */
  get<P extends string, Handler extends TypedRequestHandler<P>>(
    path: P,
    ...handlers: [...RequestHandler[], Handler]
  ): TypedRouter<
    UpdateRouter<
      T,
      "get",
      P,
      {
        query: any;
        body: any;
        response: InferResponseType<ReturnType<Handler>>;
      }
    >
  >;

  /**
   * Registers a GET route with explicit type parameters
   * @template P - Route path with params
   * @template TQuery - Query parameters type
   * @template TBody - Request body type
   * @template TResponse - Response body type
   * @param path - Route path
   * @param handlers - Middleware and route handler
   * @returns Updated TypedRouter instance
   * @example
   * ```typescript
   * router.get<
   *   '/users/:id',
   *   { fields: string[] },
   *   never,
   *   User
   * >('/users/:id', async (req, res) => {
   *   const { fields } = req.query; // typed as string[]
   *   return res.json({ id: '1', name: 'John' });
   * });
   * ```
   */
  get<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ): TypedRouter<
    UpdateRouter<
      T,
      "get",
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse;
      }
    >
  >;

  // Implementation
  get<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ) {
    return this.addRoute("get", path, handlers);
  }

  // POST method overloads
  post<P extends string, Handler extends TypedRequestHandler<P>>(
    path: P,
    ...handlers: [...RequestHandler[], Handler]
  ): TypedRouter<
    UpdateRouter<
      T,
      "post",
      P,
      {
        query: any;
        body: any;
        response: InferResponseType<ReturnType<Handler>>;
      }
    >
  >;

  post<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ): TypedRouter<
    UpdateRouter<
      T,
      "post",
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse;
      }
    >
  >;

  post<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ) {
    return this.addRoute("post", path, handlers);
  }

  // PUT method overloads
  put<P extends string, Handler extends TypedRequestHandler<P>>(
    path: P,
    ...handlers: [...RequestHandler[], Handler]
  ): TypedRouter<
    UpdateRouter<
      T,
      "put",
      P,
      {
        query: any;
        body: any;
        response: InferResponseType<ReturnType<Handler>>;
      }
    >
  >;

  put<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ): TypedRouter<
    UpdateRouter<
      T,
      "put",
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse;
      }
    >
  >;

  put<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ) {
    return this.addRoute("put", path, handlers);
  }

  // DELETE method overloads
  delete<P extends string, Handler extends TypedRequestHandler<P>>(
    path: P,
    ...handlers: [...RequestHandler[], Handler]
  ): TypedRouter<
    UpdateRouter<
      T,
      "delete",
      P,
      {
        query: any;
        body: any;
        response: InferResponseType<ReturnType<Handler>>;
      }
    >
  >;

  delete<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ): TypedRouter<
    UpdateRouter<
      T,
      "delete",
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse;
      }
    >
  >;

  delete<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ) {
    return this.addRoute("delete", path, handlers);
  }

  // PATCH method overloads
  patch<P extends string, Handler extends TypedRequestHandler<P>>(
    path: P,
    ...handlers: [...RequestHandler[], Handler]
  ): TypedRouter<
    UpdateRouter<
      T,
      "patch",
      P,
      {
        query: any;
        body: any;
        response: InferResponseType<ReturnType<Handler>>;
      }
    >
  >;

  patch<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ): TypedRouter<
    UpdateRouter<
      T,
      "patch",
      P,
      {
        query: TQuery;
        body: TBody;
        response: TResponse;
      }
    >
  >;

  patch<P extends string, TQuery, TBody, TResponse>(
    path: P,
    ...handlers: [...RequestHandler[], TypedRequestHandler<P, TQuery, TBody, TResponse>]
  ) {
    return this.addRoute("patch", path, handlers);
  }

  /**
   * Returns the type information for the router's routes
   * @internal
   * @returns Empty object with type information
   */
  __type__(): T {
    return {} as T;
  }

  // use<U extends Partial<Record<HttpMethod, Record<string, { query: any; body: any; response: any }>>>>(
  //   router: Router & { __routeType?: U }
  // ): TypedRouter<DeepMerge<T, U>> {
  //   this.router.use(router);
  //   return this as any;
  // }

  /**
   * Returns the underlying Express router with type information
   * @returns Express Router with route type information
   * @example
   * ```typescript
   * const app = express();
   * const router = new TypedRouter()
   *   .get('/users', handler);
   * app.use(router.routes());
   * ```
   */
  routes(): Router & {
    __routeType: T;
  } {
    return Object.assign(this.router, {
      __routeType: this.__type__(),
    });
  }
}
