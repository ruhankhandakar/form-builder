import { cn, validateEmail, validatePhoneNumber } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge className strings correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });
});

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePhoneNumber', () => {
  it('should validate correct phone numbers', () => {
    expect(validatePhoneNumber('+1234567890')).toBe(true);
    expect(validatePhoneNumber('123-456-7890')).toBe(true);
    expect(validatePhoneNumber('1234567890')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhoneNumber('123')).toBe(false);
    expect(validatePhoneNumber('abc-def-ghij')).toBe(false);
    expect(validatePhoneNumber('')).toBe(false);
  });
});
