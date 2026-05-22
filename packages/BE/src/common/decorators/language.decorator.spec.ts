import { describe, it, expect } from 'vitest';
import { Language } from './language.decorator';

describe('Language Decorator', () => {
  it('should be a function created by createParamDecorator', () => {
    expect(Language).toBeDefined();
    expect(typeof Language).toBe('function');
  });
});
