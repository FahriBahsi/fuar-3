import {
  formatPrice,
  formatDate,
  truncateText,
  generateSlug,
  calculateReadingTime,
} from '../utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(1000)).toBe('$1,000');
      expect(formatPrice(100.5)).toBe('$101');
      expect(formatPrice(0)).toBe('$0');
    });

    it('should handle different currencies', () => {
      expect(formatPrice(1000, 'EUR')).toContain('1,000');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('This is a Test!')).toBe('this-is-a-test');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Test@#$%^&*()')).toBe('test');
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const shortText = 'This is a short text.';
      expect(calculateReadingTime(shortText)).toBe(1);

      const longText = new Array(250).fill('word').join(' ');
      expect(calculateReadingTime(longText)).toBeGreaterThan(1);
    });
  });
});

