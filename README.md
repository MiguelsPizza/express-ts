# Typed Router for Express

A modern TypeScript wrapper for Express applications that provides end-to-end type safety without requiring major rewrites of existing code.

## Background

Node.js and Express revolutionized JavaScript development by enabling isomorphic code. While Express remains widely used and recently released version 5, modern alternatives like Hono and Fastify offer superior TypeScript support and performance benefits.

Several projects attempt to bring end-to-end type safety to Express (like tRPC), but they typically require significant refactoring of existing applications. This library takes a different approach by providing a thin TypeScript wrapper around Express Router, allowing incremental adoption in legacy projects.

## Features

- Drop-in replacement for Express Router with full type inference
- Compatible with existing Express middleware and plugins
- Type-safe route parameters, query strings, request bodies, and responses
- Minimal runtime overhead
- Inspired by Hono's API design

## Usage

The typed router maintains Express's familiar API while adding type safety. Here's a complete example showing both server and client usage:

```typescript
// Server-side route definition
import { TypedRouter } from "express-ts/router"

const router = new TypedRouter()

// Define a type-safe route
.get<{
  params: { id: string },
  query: { order?: "desc" | "asc" },
  body: any,
  response: User
}>('/users/:id', async (req, res) => {
  const { id } = req.params; // fully typed
  const { fields } = req.query; // typed as string[] | undefined

  const user = await getUser(id, fields);
  return res.json(user);
});

// Client-side consumption
import axios from 'axios';
import { createAPIClient } from 'express-ts-client';

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' });
const apiClient = createAPIClient<typeof router>(axiosInstance);

// Type-safe API calls
const user = await apiClient.users[':id'].get({
  params: { id: '123' },
  // expecting "decs" or "asc" you will get a type error!
  query: { limit: "aasc" }
}); // user is fully typed!
```

## Type Generation

For large APIs, we recommend:
1. Exporting router types for client-side consumption
2. Generating `.d.ts` files for improved IDE performance
3. Creating separate typed clients for different sections of your API

## Example Application

This repository includes a reference implementation demonstrating:
- Typed Router integration
- PostgreSQL with PGlite for development
- Drizzle ORM for type-safe database access
- Best practices for structuring a modern Express/TypeScript monorepo

## Caveats

While the library aims to provide comprehensive type safety, there are some limitations due to working within Express's type system. These are documented in detail in our [Caveats](./docs/caveats.md) section.

## When to Use This

- You have a legacy Express application and want to add type safety incrementally
- You need to maintain Express compatibility while improving the developer experience
- You're looking for a stepping stone toward more modern frameworks like Hono

For new projects, we recommend considering modern alternatives like Hono or Fastify that provide better TypeScript support out of the box.

## License

MIT