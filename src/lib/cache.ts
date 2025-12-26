/**
 * Simple in-memory cache utility
 * For production, consider using Redis
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Sets a value in cache
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }

  /**
   * Gets a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Deletes a value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
export const cache = new SimpleCache();

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  user: (slug: string) => `user:${slug}`,
  userLinks: (userId: string) => `user:links:${userId}`,
  analytics: (userId: string, days: number) => `analytics:${userId}:${days}`,
  landingPage: (slug: string) => `landing:${slug}`,
};

