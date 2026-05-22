import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LanguageInterceptor, LANGUAGE_HEADER } from './language.interceptor';

describe('LanguageInterceptor', () => {
  let interceptor: LanguageInterceptor;
  let mockCallHandler: any;

  beforeEach(() => {
    interceptor = new LanguageInterceptor();
    mockCallHandler = {
      handle: vi.fn().mockReturnValue({ pipe: vi.fn().mockReturnThis() }),
    };
  });

  it('should set language to "en" when no accept-language header', () => {
    const request = { headers: {} };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('en');
  });

  it('should set language from accept-language header', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'es' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('es');
  });

  it('should parse first language from comma-separated header', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'fr, en;q=0.9, es;q=0.8' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('fr');
  });

  it('should fall back to "en" for unsupported language', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'de' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('en');
  });

  it('should extract language from complex header with region code', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'en-US,en;q=0.9' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('en');
  });

  it('should handle Catalan (ca) as supported language', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'ca' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('ca');
  });

  it('should call next.handle()', () => {
    const request = { headers: {} };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalledOnce();
  });

  it('should not modify other properties of request', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'fr' }, otherProp: 'value' };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.otherProp).toBe('value');
    expect(request.language).toBe('fr');
  });

  it('should use lowercased ISO code', () => {
    const request = { headers: { [LANGUAGE_HEADER]: 'EN' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    interceptor.intercept(context, mockCallHandler);

    expect(request.language).toBe('en');
  });
});
