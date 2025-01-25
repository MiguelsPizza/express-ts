#  TypeScript Monorepo

This [Turborepo](https://turbo.build/repo/docs) monorepo contains all TypeScript applications and shared packages for the  platform. We use [PNPM](https://pnpm.io/) as our package manager and [Turbo](https://turbo.build/repo/docs) for build orchestration to make code maintenance across our TypeScript apps easier to track and maintain.

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22.12
- [PNPM](https://pnpm.io/) ^10.0.0-rc.0
- [Turbo](https://turbo.build/repo/docs)

---

## Setup

1. Install global dependencies:
   ```bash
   npm install -g pnpm turbo
   ```
2. Install project dependencies:
   ```bash
   pnpm install
   # Or use the bulk install script for all workspaces
   pnpm bulk-install
   ```
3. Sync environment variables:
   ```bash
   pnpm sync
   ```
   - This will pull the latest environment variables from Pulumi and create local .env files where needed.

---

## Using Turbo

All commands should be run using Turbo when possible. Turbo will automatically handle building dependencies before running scripts:

```bash
turbo run dev
turbo run build
turbo run lint
```

---

## Project Structure

```
typed-router/
├── apps/                    # Application packages
│   ├── interface/           # React PWA (app..com)
│   ├── server/              # Main backend services (rest API and basically all backend services)
│   └── particle-ingestion/  # Cloudflare worker & queue based ingestion service for particle events
├── packages/                # Shared internal packages
│   ├── auth/                # Authentication library
│   ├── common-lib/          # Core business logic
│   ├── models/              # Our database schemas as mongoose models
│   ├── types/               # Shared TypeScript types
│   ├── validators/          # Yup validators and types to validate our environment vars (use same validators in infrastructure and the app)
│   └── ui/                  # Shared UI components (to be created)
├── tooling/                 # Development tooling configs
├── infrastructure/          # Pulumi infrastructure code
└── e2e-tests/               # End-to-end tests
```

### /tooling
All development configs should inherit from this directory for consistency across the monorepo. Keep build/test/lint config and other shared tooling here.

### /packages
Contains code shared across the monorepo. This code should be thoroughly tested. Changes require executive approval (Jeff, Ryan, and/or Matt):
- **Auth**: User access level code
- **Common-lib**: Core  business logic

### /apps
- **interface**: React-Vite-PWA (app..com)
- **server**: Houses multiple services:
  - REST API
  - Cron jobs
  - Email service
  - HR sync service
  - Data ingestion service
  - (Plan to split services that need individual scaling)
- **particle-ingestion-service**: A Cloudflare worker queue stack for particle events DB ingestion (avoid changes unless absolutely necessary)

### /infrastructure
- All apps should be configured and managed via Pulumi
- Maintains consistency across dev/demo/production environments
- Eliminates the need for manual Heroku or Cloudflare UI configuration
- Use validators for new infrastructure to ensure environment configuration matches Pulumi and code expectations

### /e2e-tests
- End-to-end tests for the entire  platform
- High priority for testing coverage
- Prefer adding E2E tests over unit or API tests

---

## Development Workflow

### Starting the Development Environment

```bash
# Start both frontend and backend
pnpm dev

# Start frontend only
pnpm start:interface

# Start backend only
pnpm start:server

# Windows-specific start command
pnpm start:win
```

### Environment Variables

- Always use Pulumi for managing environment variables.
- When you run:
  ```bash
  pnpm sync
  ```
  it will pull the dev environment settings from Pulumi and place them into local .env files corresponding to each app.
- Only use local .env files if you have a temporary change that shouldn’t affect other developers.
- For new apps or services, update `./infrastructure/src/sync-config.ts` to include the new repo.
- For consistency across developer environments, prefer adding config vars to Pulumi.

---

## Creating New Packages

```bash
pnpm turbo gen
```

1. When starting a new app, ensure you set up its environment in Pulumi.
2. Update `./infrastructure/src/sync-config.ts` to include the new repo.
3. Run `pnpm sync` to pull down the environment variables.

---

## Available Scripts (run with turbo prefix)

| Script            | Description                                                          |
|-------------------|----------------------------------------------------------------------|
| `pnpm dev`        | Starts development servers                                          |
| `pnpm build`      | Builds all packages except e2e tests                                |
| `pnpm lint`       | Runs linting                                                        |
| `pnpm format`     | Formats code                                                        |
| `pnpm test`       | Runs unit tests                                                     |
| `pnpm e2e`        | Runs end-to-end tests                                              |
| `pnpm sync`       | Syncs environment variables from Pulumi                             |
| `pnpm prep`       | Runs pre-commit hooks                                              |
| `pnpm start`      | Starts server and interface with test configuration                 |
| `pnpm start:win`  | Windows-specific start command                                      |
| `pnpm bulk-install` | Installs dependencies across all workspaces                      |

---

## Testing Strategy

1. **E2E Tests (Priority)**
   ```bash
   pnpm e2e
   # Windows
   pnpm e2e:win
   ```
2. **Type Checking**
   ```bash
   pnpm typecheck
   ```
3. **Unit Tests**
   ```bash
   pnpm test
   ```

---

## Best Practices

1. **Environment Management**
   - Always use Pulumi for environment variables.
   - When adding a new service, add validators for environment checks.
   - Only use local env files for short-term testing.

2. **Testing Priority**
   - Prefer E2E tests over unit tests or API tests when possible.
   - Keep high coverage in shared packages.

3. **Code Changes**
   - Shared packages (e.g., Auth, Common-lib) require executive approval.
   - Document all API changes in code and any relevant docs.

4. **Infrastructure**
   - Use Pulumi for all environment and infrastructure changes.
   - Maintain environment parity across dev, demo, and production.
   - Validate new infrastructure changes to ensure consistency.

---

## Cloud Services & Access

We utilize various cloud services across our infrastructure. Contact [Ryan](mailto:ryan@.com) for access setup:

### Development & Database
- [**MongoDB Atlas**](https://www.mongodb.com/atlas): Primary database service
- [**Heroku**](https://heroku.com): Hosts our Node.js server applications
- [**Cloudflare**](https://cloudflare.com):
  - [Pages](https://pages.cloudflare.com) for React app deployment
  - [Workers](https://workers.cloudflare.com) for serverless functions and edge computing

### Infrastructure & Monitoring
- [**Pulumi**](https://www.pulumi.com): Infrastructure as Code and environment management
- [**AWS**](https://aws.amazon.com):
  - [Textract](https://aws.amazon.com/textract) for document processing
  - [Bedrock](https://aws.amazon.com/bedrock) for AI/ML capabilities
- [**Datadog**](https://www.datadoghq.com):
  - [Real User Monitoring (RUM)](https://docs.datadoghq.com/real_user_monitoring)
  - Log aggregation and monitoring

### Business Tools
- [**HubSpot**](https://www.hubspot.com): Customer success and relationship management

New team members should request access to relevant services through [Ryan](mailto:ryan@.com), who will set up appropriate permissions based on role requirements. For device management and IoT devices, we use [Particle.io](https://particle.io).

## Additional Information
- (Placeholder: “Contributing Guidelines” - to be added later)
- (Placeholder: “Release Management Process” - to be added later)
- (Placeholder: “CI/CD Pipeline Details” - to be added later)
- (Placeholder: “Contact & Support” - to be added later)

Feel free to suggest changes or request additional information as needed!