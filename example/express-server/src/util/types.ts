/**
 * Converts a type to its JSON-serialized form:
 * - Dates become strings
 * - ObjectIds become strings
 * - Removes methods and internal fields
 * - Keeps only data properties
 * - Removes Mongoose internal fields
 */
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

// Mongoose internal fields that should be excluded from JSON serialization
type MongooseInternalFields =
  | "$isNew"
  | "$init"
  | "$locals"
  | "$op"
  | "$where"
  | "baseModelName"
  | "collection"
  | "db"
  | "errors"
  | "isNew"
  | "modelName"
  | "schema"
  | "__v"
  | "__t";

export type JSONSerializedDoc<T> = T extends (infer U)[]
  ? JSONSerializedDoc<U>[]
  : {
      [K in keyof T as T[K] extends Function ? never : K extends MongooseInternalFields ? never : K]: T[K] extends Date
        ? string
        : T[K] extends { _id: any; toString(): string }
          ? string // handles ObjectId
          : T[K] extends (infer U)[]
            ? JSONSerializedDoc<U>[]
            : T[K] extends object
              ? JSONSerializedDoc<T[K]>
              : T[K] extends JsonValue
                ? T[K]
                : never;
    } & { _id: string }; // ensures _id is always present as string
