/**
 * Centralized storage service for handling localStorage operations
 * Provides type-safe access to stored data with error handling
 */

// Storage keys enum for type safety
export enum StorageKey {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

interface StorageService {
  get<T = string>(key: StorageKey): T | null;
  set(key: StorageKey, value: string): void;
  remove(key: StorageKey): void;
  clear(): void;
}

class LocalStorageService implements StorageService {
  /**
   * Safely check if localStorage is available
   */
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      // Test if we can actually use localStorage
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param key - Storage key
   * @returns Stored value or null if not found
   */
  get<T = string>(key: StorageKey): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return null;
      }

      // Try to parse JSON if applicable
      try {
        return JSON.parse(item) as T;
      } catch {
        // Return as string if not JSON
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param key - Storage key
   * @param value - Value to store (will be stringified if object)
   */
  set(key: StorageKey, value: string): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  remove(key: StorageKey): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Export singleton instance
export const storage = new LocalStorageService();

// Export convenience functions for token management
export const tokenStorage = {
  getAccessToken: () => storage.get(StorageKey.ACCESS_TOKEN),
  setAccessToken: (token: string) => storage.set(StorageKey.ACCESS_TOKEN, token),
  removeAccessToken: () => storage.remove(StorageKey.ACCESS_TOKEN),

  getRefreshToken: () => storage.get(StorageKey.REFRESH_TOKEN),
  setRefreshToken: (token: string) => storage.set(StorageKey.REFRESH_TOKEN, token),
  removeRefreshToken: () => storage.remove(StorageKey.REFRESH_TOKEN),

  clearTokens: () => {
    storage.remove(StorageKey.ACCESS_TOKEN);
    storage.remove(StorageKey.REFRESH_TOKEN);
  },
};
