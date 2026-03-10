import { loginSchema, registerSchema, contactFormSchema } from '../validators/auth';
import { createListingSchema } from '../validators/listing';

describe('Validators', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test@1234',
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Test@1234',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        agreeToTerms: true,
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@1234',
        confirmPassword: 'Different@1234',
        agreeToTerms: true,
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weakpassword',
        confirmPassword: 'weakpassword',
        agreeToTerms: true,
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createListingSchema', () => {
    it('should validate correct listing data', () => {
      const validData = {
        title: 'Test Listing',
        description: 'This is a test listing description that is long enough to pass validation',
        category: 'restaurant',
        price: 50,
        priceType: 'hourly',
        location: {
          address: '123 Main St',
          city: 'Los Angeles',
          state: 'California',
          zip: '90001',
          lat: 34.0522,
          lng: -118.2437,
        },
        amenities: ['WiFi', 'Parking'],
      };
      
      const result = createListingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid price', () => {
      const invalidData = {
        title: 'Test Listing',
        description: 'This is a test listing description',
        category: 'restaurant',
        price: -10,
        priceType: 'hourly',
      };
      
      const result = createListingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

