import { describe, it, expect } from 'vitest';
import { generateRandomEmail } from '../helpers/test-utils';

describe('Test Utilities', () => {
  describe('generateRandomEmail', () => {
    it('should generate a valid email format', () => {
      const email = generateRandomEmail();
      expect(email).toMatch(/^test\.user\.\d+@example\.com$/);
    });

    it('should generate unique emails', () => {
      const email1 = generateRandomEmail();
      const email2 = generateRandomEmail();
      expect(email1).not.toBe(email2);
    });

    it('should include timestamp in email', () => {
      const email = generateRandomEmail();
      const timestamp = email.match(/test\.user\.(\d+)@example\.com/)?.[1];
      expect(timestamp).toBeDefined();
      expect(Number(timestamp)).toBeGreaterThan(0);
    });

    it('should use example.com domain', () => {
      const email = generateRandomEmail();
      expect(email).toContain('@example.com');
    });
  });
});
