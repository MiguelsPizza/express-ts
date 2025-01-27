import type { HttpMethod, TypedRouter } from "@express-ts-rpc/router";
import type { AllRoutes, MapRoutesToClient } from "./types";
import type { AxiosInstance } from "axios";
import type axiosLight from "redaxios";

type RedaxiosInstance = ReturnType<(typeof axiosLight)["create"]>;

/**
 * Creates a type-safe API client that transforms a typed router definition into a chainable API client.
 *
 * @template T - Type parameter extending TypedRouter<any> that defines the API routes and their types
 *
 * @param apiInstance - An Axios or Redaxios instance that will be used to make HTTP requests
 *
 * @returns A proxy-based API client that matches the structure of your router definition
 *          and provides type-safe access to your API endpoints
 *
 * @example
 * ```typescript
 * // Define your router type
 * const MyRouter = new TypedRouter().get('/users',...)
 * type MyRouterType = typeof MyRouter
 * // Create the client
 * const api = createAPIClient<MyRouterType>(axios);
 *
 * // Make type-safe API calls
 * const users = await api.users.get({ query: { limit: 10 } });
 * ```
 */
export function createAPIClient<T extends TypedRouter<any>>(
  apiInstance: AxiosInstance | RedaxiosInstance,
): MapRoutesToClient<AllRoutes<T>> {
  return createProxy([]);

  /**
   * Creates a recursive proxy that builds the API path and handles method calls
   *
   * @param pathParts - Array of strings representing the current API path segments
   * @returns A proxy object that either continues building the path or executes the API call
   */
  function createProxy(pathParts: string[]): any {
    return new Proxy(() => {}, {
      /**
       * Handles property access to build the API path
       *
       * @param target - The target object (unused in this implementation)
       * @param prop - The property being accessed
       * @returns A new proxy for the extended path
       */
      get(target, prop: string) {
        return createProxy([...pathParts, prop.toString()]);
      },

      /**
       * Handles function calls to execute the API request or continue path building
       *
       * @param target - The target object (unused in this implementation)
       * @param thisArg - The 'this' context (unused in this implementation)
       * @param argumentsList - The arguments passed to the function
       * @returns Promise with the API response or a new proxy for continued path building
       */
      apply(target, thisArg, argumentsList: unknown[]) {
        const args = argumentsList[0] as {
          params?: Record<string, string | number>;
          query?: Record<string, unknown>;
          body?: unknown;
        };

        // List of valid HTTP methods
        const methods: HttpMethod[] = ["get", "post", "put", "delete", "patch"];
        // Get the last path part which should be the HTTP method
        const method = pathParts[pathParts.length - 1];

        if (methods.includes(method as HttpMethod)) {
          // Replace path parameters with actual values from the args
          const pathWithParams = pathParts.slice(0, -1).map((part) => {
            if (part.startsWith(":") && args?.params) {
              const paramName = part.slice(1);
              return args.params[paramName];
            }
            return part;
          });

          const fullPath = `/${pathWithParams.join("/")}`;

          // Execute the API request
          return (apiInstance as AxiosInstance)
            .request({
              url: fullPath,
              method: method as HttpMethod,
              params: args?.query,
              data: args?.body,
            })
            .then((res) => res.data);
        }

        // If not a method call, continue building the path
        return createProxy([...pathParts, args.toString()]);
      },
    });
  }
}

export default createAPIClient;
