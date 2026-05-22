import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AllExceptionsFilter } from './http-exception.filter';
import { HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from '../exceptions/entity-not-found.error';
import { InvalidParameterError } from '../exceptions/invalid-parameter.error';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockJson: any;
  let mockStatus: any;
  let mockResponse: any;
  let mockHost: any;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
    };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    };
    filter = new AllExceptionsFilter();
  });

  describe('catch', () => {
    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Custom error',
        }),
      );
    });

    it('should handle EntityNotFoundError', () => {
      const exception = new EntityNotFoundError('Recipe not found', 'Recipe', [{ id: '123' }]);
      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recipe not found',
        }),
      );
    });

    it('should handle InvalidParameterError', () => {
      const exception = new InvalidParameterError('Invalid parameter', 'Recipe', [{ field: 'name' }]);
      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid parameter',
        }),
      );
    });

    it('should handle generic Error as 500', () => {
      const exception = new Error('Unexpected error');
      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        }),
      );
    });

    it('should include timestamp in response', () => {
      const exception = new HttpException('test', HttpStatus.OK);
      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        }),
      );
    });

    it('should handle unknown exception type', () => {
      const exception = { unexpected: true };
      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });

    it('should flatten validation errors from BadRequestException', () => {
      const validationMessages = [
        {
          property: 'email',
          constraints: { isEmail: 'email must be a valid email' },
        },
        {
          property: 'name',
          constraints: { isNotEmpty: 'name should not be empty' },
        },
      ];
      const exception = new BadRequestException(validationMessages);
      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          errors: {
            email: ['email must be a valid email'],
            name: ['name should not be empty'],
          },
        }),
      );
    });

    it('should handle nested validation errors (children)', () => {
      const validationMessages = [
        {
          property: 'items',
          children: [
            {
              property: 'name',
              constraints: { isNotEmpty: 'name should not be empty' },
            },
          ],
        },
      ];
      const exception = new BadRequestException(validationMessages);
      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: {
            name: ['name should not be empty'],
          },
        }),
      );
    });
  });
});
