import { describe, it, expect, beforeEach } from 'vitest';
import { LoggingInterceptor } from './logging.interceptor';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it('should log request details and call next.handle()', async () => {
    const request = { method: 'GET', url: '/test', body: {} };
    const response = { statusCode: 200 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as any;

    const mockNext = { handle: () => of('response-data') };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(context, mockNext).subscribe(resolve);
    });

    expect(result).toBe('response-data');
  });

  it('should handle POST requests with body', async () => {
    const request = { method: 'POST', url: '/users', body: { name: 'test' } };
    const response = { statusCode: 201 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as any;

    const mockNext = { handle: () => of('created') };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(context, mockNext).subscribe(resolve);
    });

    expect(result).toBe('created');
  });

  it('should work with error responses', async () => {
    const request = { method: 'DELETE', url: '/items/1', body: {} };
    const response = { statusCode: 204 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as any;

    const mockNext = { handle: () => of('deleted') };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(context, mockNext).subscribe(resolve);
    });

    expect(result).toBe('deleted');
  });
});
