import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

interface ValidationError {
  target?: object;
  property: string;
  children?: ValidationError[];
  constraints?: Record<string, string>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = "Internal server error";
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      this.logger.error(
        `HTTP Exception: ${status} - ${JSON.stringify(exceptionResponse)}`,
        exception.stack,
      );

      if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        if (Array.isArray(responseObj.message)) {
          message = "Validation failed";
          errors = this.flattenValidationErrors(responseObj.message as ValidationError[]);
        } else {
          message = responseObj.message || "Internal server error";
        }
      } else if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      }
    }

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    this.logger.error(
      `${status} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : "",
    );

    response.status(status).json(errorResponse);
  }

  private flattenValidationErrors(validationErrors: ValidationError[]): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const error of validationErrors) {
      if (error.constraints) {
        errors[error.property] = Object.values(error.constraints);
      }
      if (error.children?.length) {
        const childErrors = this.flattenValidationErrors(error.children);
        Object.assign(errors, childErrors);
      }
    }

    return errors;
  }
}
