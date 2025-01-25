# Typed Router for Express

A TypeScript-first router for Express that provides Hono-style type inference. Get full type safety for request parameters, query strings, request bodies, and responses - all while keeping the Express ecosystem you know and love.

## Features

- 🎯 Full type inference for routes, similar to Hono
- 🔒 Type-safe request parameters, query strings, bodies, and responses
- 🔌 Drop-in replacement for Express Router
- 📦 Zero runtime overhead
- 🛠 Works with existing Express middleware

## Installation

```bash
npm install typed-router-express
```

## Quick Start

```typescript
import { TypedRouter } from "typed-router-express";

const router = new TypedRouter();

// Type-safe route definition
router.get<
  "/users/:id", // Path with params
  { fields?: string[] }, // Query params
  never, // No request body for GET
  { name: string; age: number } // Response shape
>("/users/:id", async (req, res) => {
  const { id } = req.params; // id is typed
  const { fields } = req.query; // fields is typed as string[] | undefined

  return res.json({
    name: "John",
    age: 30,
    // TypeScript error if response shape doesn't match
  });
});

// Attach to Express app
app.use(router.routes());
```

## Detailed Usage

### Route Type Parameters

Each route method (get, post, put, patch, delete) accepts four type parameters:

```typescript
router.post<
  Path, // Literal path string with params (e.g. '/users/:id')
  Query, // Query string parameters
  Body, // Request body shape
  Response // Response body shape
>;
```

### Example Controller

```typescript
const userRouter = new TypedRouter()
  // GET /users?role=admin
  .get<"/users", { role?: "admin" | "user" }, never, User[]>("/users", async (req, res) => {
    const { role } = req.query; // typed as 'admin' | 'user' | undefined
    const users = await User.findAll({ role });
    return res.json(users);
  })

  // POST /users
  .post<"/users", never, { name: string; email: string }, { id: string }>("/users", async (req, res) => {
    const { name, email } = req.body; // fully typed
    const user = await User.create({ name, email });
    return res.status(201).json({ id: user.id });
  });

export { userRouter };
```

### Attaching to Express App

```typescript
import express from "express";

import { userRouter } from "./controllers/user";

const app = express();

// Standard Express middleware
app.use(express.json());

// Attach typed router
app.use(userRouter.routes());
```

## Type Inference

The library provides full type inference for:

- URL Parameters (`:id`, etc.)
- Query String Parameters
- Request Body
- Response Body
- Error Responses

This enables excellent IDE support and catches type errors at compile time.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT Licensed. See [LICENSE](LICENSE) for details.

## Roadmap

- Add a ValidatedRouter export that uses our types and typia for runtime validation of params

  - If this works we should be able to generate an openAPI spec from a typed router

- add more overloads for omiting different type args

  - at the moment you have to pick between fully infering route type and fully decaring them. This leads to an akward case of wanting infered response types but wanting to type the query params and body

- add support for a validation middleware similar to zValidator for hono.

- This package is designed for proejcts that want the type saftey and dx of projects like trpc and hono but are too large or have too many express depended code to transition. For projects that are too large, it should be possible to write a codemond script that will migrate a type-router express project to hono. Hono is very similar to express in most ways so this should be doable
