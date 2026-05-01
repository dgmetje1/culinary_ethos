import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidParameterError extends HttpException {
  constructor(
    message: string,
    public readonly entityType: string,
    public readonly params: Record<string, unknown>[] = [],
  ) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message,
        entityType,
        params,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}