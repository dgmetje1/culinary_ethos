import { describe, it, expect, beforeEach } from "vitest";
import { TransformInterceptor } from "./transform.interceptor";
import { of } from "rxjs";

describe("TransformInterceptor", () => {
  let interceptor: TransformInterceptor<any>;
  let mockContext: any;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ url: "/test" }),
      }),
    } as any;
  });

  it("should wrap response in data object with timestamp", async () => {
    const mockNext = { handle: () => of({ id: "123", name: "test" }) };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(mockContext, mockNext).subscribe(resolve);
    });

    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("timestamp");
    expect(result.data).toEqual({ id: "123", name: "test" });
    expect(typeof result.timestamp).toBe("string");
  });

  it("should wrap array response", async () => {
    const mockData = [{ id: "1" }, { id: "2" }];
    const mockNext = { handle: () => of(mockData) };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(mockContext, mockNext).subscribe(resolve);
    });

    expect(result.data).toEqual(mockData);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("should wrap primitive response", async () => {
    const mockNext = { handle: () => of("plain string") };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(mockContext, mockNext).subscribe(resolve);
    });

    expect(result.data).toBe("plain string");
  });

  it("should wrap null response", async () => {
    const mockNext = { handle: () => of(null) };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(mockContext, mockNext).subscribe(resolve);
    });

    expect(result.data).toBeNull();
  });

  it("should generate valid ISO timestamp", async () => {
    const mockNext = { handle: () => of({}) };

    const result = await new Promise<any>((resolve) => {
      interceptor.intercept(mockContext, mockNext).subscribe(resolve);
    });

    const parsed = new Date(result.timestamp);
    expect(parsed.toISOString()).toBe(result.timestamp);
  });
});
