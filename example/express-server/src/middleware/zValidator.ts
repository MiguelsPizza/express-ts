import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodError, ZodObject, ZodSchema } from 'zod';
import { AppError } from '../util/appError';

// feel free to drop this in your project and use with your own Error class or preferred validation library

/**
 * Express-oriented version of the "Hook" type:
 * Receives the parse result (success or failure) plus
 * the (req, res, next) parameters for any custom handling.
 */
type Hook<
  ParsedData,
  Target extends keyof ExpressValidationTargets
> = (
  result:
    | { success: true; data: ParsedData; target: Target }
    | { success: false; error: ZodError; data: unknown; target: Target },
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Defines the potential validation targets in an Express request.
 * Add or remove keys as needed for your use-case.
 */
interface ExpressValidationTargets {
  body: any;
  query: any;
  params: any;
  header: any;
}

/**
 * zValidator function for Express:
 * - target: which part of the request to validate (body, query, params, header)
 * - schema: the Zod validation schema
 * - hook (optional): a function that will be called right after parsing;
 *                    can be used to handle (or short-circuit) in case of errors or do custom logic.
 */
export function zValidator<
  T extends ZodSchema<any, any, any>,
  Target extends keyof ExpressValidationTargets
>(
  target: Target,
  schema: T,
  hook?: Hook<z.infer<T>, Target>
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Grab the relevant data from req
      let validatorValue = req[target];

      // Special handling to make header keys case-insensitive if using a ZodObject
      // so that "content-type" and "Content-Type" remain consistent.
      if (target === 'header' && schema instanceof ZodObject) {
        const schemaKeys = Object.keys(schema.shape);
        const caseInsensitiveKeyMap: Record<string, string> = Object.fromEntries(
          schemaKeys.map((key) => [key.toLowerCase(), key])
        );

        validatorValue = Object.fromEntries(
          Object.entries(req.headers).map(([k, v]) => {
            const mappedKey = caseInsensitiveKeyMap[k.toLowerCase()] || k;
            return [mappedKey, v];
          })
        );
      }

      // Validate data against the Zod schema
      const result = await schema.safeParseAsync(validatorValue);

      // If a custom hook is provided, call it, letting it optionally manipulate the request/response.
      if (hook) {
        await hook(
          result.success
            ? { success: true, data: result.data, target }
            : { success: false, error: result.error, data: validatorValue, target },
          req,
          res,
          next
        );
      }

      // Handle errors (if validation fails, respond with a 400 by default):
      if (!result.success) {
        throw new AppError("Zod Error: Validation failed", 400, Object.groupBy(result.error.errors, (error) => error.code));
      }

      return next();
    } catch (err) {
      // Pass unexpected errors to the next error handler
      return next(err);
    }
  };
}


