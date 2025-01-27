# Typed Router Client

This package provides a type-safe client for consuming routes defined by the [TypedRouter](../express-ts-rpc).
It uses Axios under the hood to perform HTTP requests, automatically mapping route definitions from the server to a friendly, typed client API.

## Installation

```bash
npm install express-ts-rpc-client
```

## Usage

1. Define your routes with the TypedRouter on the server (see the express-ts-rpc package).
2. Import createAPIClient from this package.
3. Pass in an Axios instance, and you can begin calling your routes as typed functions.

Example:

```typescript
import axios from 'axios';
import { type UserRouter } from 'location_of_typeof_your_typedRouter'
import createAPIClient from 'express-ts-rpc-client';
const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' })
const apiClient = createAPIClient<RouterType>(axiosInstance);

// If you defined a route like:
  new TypedRouter().get('/users/:id', ...)
//
// You can now call:
apiClient.users[':id'].get({ params: { id: '123' } }).then(data => {
  console.log(data); // Typed response from server
});
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue on GitHub.

## License

MIT

## Roadmap

- Add native fetch support
  - at the moment the client requires axios as it's underling api client. That does not need to be the case and add this api could very need zero deps
  - for now I suggest using [redaxios](https://www.npmjs.com/package/redaxios/v/0.1.0?activeTab=readme) if you do not want to bring in fetch
- Improve typing and empty params

  - as of now, listing never in the router type does not play well with the generated client.

- Add compatiablity for honoClient.
  - hono has already solved most of the problems this client aims to solve. We would use the hono client but at the moment their requsted router type is not compatible with the type outputed by the typed router. Hono's types are complex but it should be possible to transform the router type into something that the honoclient will understand
