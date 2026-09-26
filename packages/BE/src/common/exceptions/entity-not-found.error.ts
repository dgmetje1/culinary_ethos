import { HttpException, HttpStatus } from "@nestjs/common";

export class EntityNotFoundError extends HttpException {
  constructor(
    message: string,
    public readonly entityType: string,
    public readonly params: Record<string, unknown>[] = [],
  ) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: "Not Found",
        message,
        entityType,
        params,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
