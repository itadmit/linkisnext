/**
 * Validation utilities for user input
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates URL format and security
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check length
  if (url.length > 2048) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Block javascript: and data: URLs
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
      return false;
    }
    
    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Sanitizes URL by ensuring it has a protocol
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  const trimmed = url.trim();
  
  // If it already has a protocol, return as is (after validation)
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  // Add https:// if no protocol
  return `https://${trimmed}`;
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
  }
  
  if (password.length > 128) {
    errors.push('הסיסמה ארוכה מדי (מקסימום 128 תווים)');
  }
  
  if (!/[a-z]/.test(password) && !/[א-ת]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות אחת קטנה');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות אחת גדולה');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('הסיסמה חלשה מדי');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Validates slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 30;
}

/**
 * Gets reserved slugs that cannot be used
 */
export function getReservedSlugs(): string[] {
  return [
    'admin',
    'api',
    'dashboard',
    'login',
    'register',
    'settings',
    'analytics',
    'auth',
    'static',
    'public',
    'uploads',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
  ];
}

