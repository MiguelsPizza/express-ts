import type { NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

import { AppError } from "../util/appError";
import logger from "../util/logger";

const errorHandler = (err: Error | AppError | MongooseError, req, res, next: NextFunction) => {
  let appError: AppError;
  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof MongooseError) {
    appError = handleMongooseError(err);
  } else {
    appError = AppError.internalServerError(err.message || "An unexpected error occurred");
  }
  logger.error({ status: appError.statusCode, body: appError.toJSON() });

  res.status(appError.statusCode).json(appError.toJSON());
};

const handleMongooseError = (error: MongooseError): AppError => {
  switch (error.name) {
    case "CastError":
      const castError = error as any;
      const message = `Invalid ${castError.path}: ${castError.value}.`;
      return AppError.badRequest(message);

    case "ValidationError":
      const validationError = error as any;
      const errors = Object.values(validationError.errors).map((el: any) => el.message);
      const validationMessage = `Invalid input data. ${errors.join(". ")}`;
      return AppError.badRequest(validationMessage, validationError.errors);

    case "DivergentArrayError":
      return AppError.badRequest("Array was modified in an unsafe way after loading.");

    case "DocumentNotFoundError":
      return AppError.notFound("The requested document was not found.");

    case "MissingSchemaError":
      return AppError.internalServerError("Schema is missing for this operation.");

    case "MongooseServerSelectionError":
      return AppError.internalServerError("Unable to connect to MongoDB server.");

    case "OverwriteModelError":
      return AppError.internalServerError("Attempt to overwrite an existing model.");

    case "ParallelSaveError":
      return AppError.conflict("Multiple save operations were performed in parallel on the same document.");

    case "StrictModeError":
      return AppError.badRequest("Attempted to set a path that is not in the schema with strict mode enabled.");

    case "StrictPopulateError":
      return AppError.badRequest("Attempted to populate a path that does not exist.");

    case "VersionError":
      return AppError.conflict("A version conflict occurred while saving the document.");

    default:
      if ((error as any).code === 11000) {
        const value = (error as any).message.match(/(["'])(\\?.)*?\1/)?.[0] || "unknown";
        const duplicateMessage = `Duplicate field value: ${value}. Please use another value.`;
        return AppError.badRequest(duplicateMessage);
      }
      return AppError.internalServerError("An unexpected error occurred");
  }
};

export default errorHandler;
