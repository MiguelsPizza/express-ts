import type { ExtractPathParams, TypedRouter } from "@typed-router/typed-router";

// Define the complex type utilities here
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

// Utility type to split a path string into an array of segments
export type SplitPath<T extends string> = T extends `/${infer Rest}`
  ? SplitPath<Rest>
  : T extends `${infer Segment}/${infer Rest}`
    ? [Segment, ...SplitPath<Rest>]
    : T extends ""
      ? []
      : [T];

// Utility type to build a nested route type from path segments
export type BuildNestedRouteType<Segments extends string[], RouteInfo> = Segments extends [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends string[]
      ? { [K in First]: BuildNestedRouteType<Rest, RouteInfo> }
      : Record<First, RouteInfo>
    : never
  : RouteInfo;

// Utility type to build a route object for a single route
export type BuildRoute<Method extends string, Path extends string, RouteInfo> = BuildNestedRouteType<
  SplitPath<Path>,
  Record<Method, RouteInfo>
>;

// Corrected BuildNestedRoutes type
// Utility type to convert a union to an intersection
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Corrected BuildNestedRoutes type using UnionToIntersection
export type BuildNestedRoutes<
  R extends Partial<Record<HttpMethod, Record<string, { query: any; body: any; response: any }>>>,
> = UnionToIntersection<
  {
    [M in keyof R]: {
      [P in keyof R[M]]: BuildRoute<
        // @ts-ignore this works
        M,
        P & string,
        {
          params: ExtractPathParams<P & string>;
          // @ts-ignore this works
          query: R[M][P]["query"];
          // @ts-ignore this works
          body: R[M][P]["body"];
          // @ts-ignore this works
          response: R[M][P]["response"];
        }
      >;
    }[keyof R[M]];
  }[keyof R]
>;

// Extract routes from TypedRouter
export type ExtractRoutes<T> = T extends TypedRouter<infer R> ? R : never;

// Updated AllRoutes type
export type AllRoutes<T extends TypedRouter> = BuildNestedRoutes<ExtractRoutes<T>>;

// Map routes to client methods
// Utility type to map routes to client methods
export type MapRoutesToClient<R> = {
  [K in keyof R]: R[K] extends { params: any; query: any; body: any; response: any }
    ? (args: { params: R[K]["params"]; query: R[K]["query"]; body: R[K]["body"] }) => Promise<R[K]["response"]>
    : MapRoutesToClient<R[K]>;
};
