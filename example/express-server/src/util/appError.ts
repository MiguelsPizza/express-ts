import { HttpStatusCode } from 'axios';
import type {Document} from 'mongoose';

type ErrorInErrors = Record<string, { message: string; duplicate?: Document } | any>;
export class AppError extends Error {
  readonly statusCode: HttpStatusCode;
  readonly status: 'fail' | 'error';
  readonly isOperational: boolean;
  readonly errors?: ErrorInErrors;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatusCode.InternalServerError, errors?: ErrorInErrors) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: ErrorInErrors): AppError {
    return new AppError(message, HttpStatusCode.BadRequest, errors);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, HttpStatusCode.Unauthorized);
  }

  static forbidden(message: string): AppError {
    return new AppError(message, HttpStatusCode.Forbidden);
  }

  static notFound(message: string): AppError {
    return new AppError(message, HttpStatusCode.NotFound);
  }

  static internalServerError(message: string): AppError {
    return new AppError(message, HttpStatusCode.InternalServerError);
  }

  static conflict(message: string): AppError {
    return new AppError(message, HttpStatusCode.Conflict);
  }

  toJSON(): Record<string, unknown> {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      error: this.message, //this is to maintain current tests
      stack: process.env.ENV === 'dev' ? this.stack : undefined,
    };
  }
}
