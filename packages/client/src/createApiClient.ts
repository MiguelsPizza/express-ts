import type { HttpMethod, TypedRouter } from "@typed-router/router";
import type { AllRoutes, MapRoutesToClient } from "./types";
import type { AxiosInstance } from "axios";

function createAPIClient<T extends TypedRouter<any>, A extends AxiosInstance>(
  apiInstance: A,
): MapRoutesToClient<AllRoutes<T>> {
  return createProxy([]);

  function createProxy(pathParts: string[]): any {
    return new Proxy(() => {}, {
      get(target, prop: string) {
        return createProxy([...pathParts, prop.toString()]);
      },
      apply(target, thisArg, argumentsList: any[]) {
        const args = argumentsList[0];

        // Extract the method (get, post, etc.)
        const method = pathParts[pathParts.length - 1];
        const methods: HttpMethod[] = ["get", "post", "put", "delete", "patch"];

        if (methods.includes(method as HttpMethod)) {
          // Replace path parameters with actual values
          const pathWithParams = pathParts.slice(0, -1).map((part) => {
            if (part.startsWith(":") && args?.params) {
              const paramName = part.slice(1);
              return args.params[paramName];
            }
            return part;
          });

          const fullPath = `/${pathWithParams.join("/")}`;

          return apiInstance
            .request({
              url: fullPath,
              method: method as any,
              params: args.query,
              data: args.body,
            })
            .then((res) => res.data);
        }

        return createProxy([...pathParts, args.toString()]);
      },
    });
  }
}
export default createAPIClient;
