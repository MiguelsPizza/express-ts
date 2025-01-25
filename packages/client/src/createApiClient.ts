import type { HttpMethod, TypedRouter } from "@typed-router/router";
import { AxiosInstance } from "axios";
import axiosLight from "redaxios";
import type { AllRoutes, MapRoutesToClient } from "./types";
const test = axiosLight.i
type RedaxiosInstance = ReturnType<typeof axiosLight['create']>

export function createAPIClient<T extends TypedRouter<any>>(
  apiInstance: AxiosInstance | RedaxiosInstance,
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
