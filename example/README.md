# Types Are Technical Debt

> **Key Insight**: Not a single type describing data was written manually in this codebase. All types are either inferred or derived from schemas and validators.

## Benefits

- **Reduced Maintenance Burden**: By deriving types from schemas and validators, we eliminate the need to manually maintain type definitions
- **Type Safety**: Full TypeScript benefits without writing explicit type definitions
- **Single Source of Truth**: Types automatically stay in sync with runtime validation logic
- **DRY Code**: No duplication between type definitions and runtime schemas
