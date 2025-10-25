import { describe, it, expect, beforeEach } from 'vitest';
import { storage, tokenStorage, StorageKey } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null when key does not exist', () => {
      const result = storage.get(StorageKey.ACCESS_TOKEN);
      expect(result).toBeNull();
    });

    it('should get string value from localStorage', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'test-token');
      const result = storage.get(StorageKey.ACCESS_TOKEN);
      expect(result).toBe('test-token');
    });
  });

  describe('set', () => {
    it('should set value in localStorage', () => {
      storage.set(StorageKey.ACCESS_TOKEN, 'new-token');
      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBe('new-token');
    });
  });

  describe('remove', () => {
    it('should remove value from localStorage', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'token');
      storage.remove(StorageKey.ACCESS_TOKEN);
      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'token1');
      localStorage.setItem(StorageKey.REFRESH_TOKEN, 'token2');

      storage.clear();

      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(StorageKey.REFRESH_TOKEN)).toBeNull();
    });
  });
});

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('access token', () => {
    it('should get access token', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'access-token');
      expect(tokenStorage.getAccessToken()).toBe('access-token');
    });

    it('should set access token', () => {
      tokenStorage.setAccessToken('new-access-token');
      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBe('new-access-token');
    });

    it('should remove access token', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'token');
      tokenStorage.removeAccessToken();
      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('refresh token', () => {
    it('should get refresh token', () => {
      localStorage.setItem(StorageKey.REFRESH_TOKEN, 'refresh-token');
      expect(tokenStorage.getRefreshToken()).toBe('refresh-token');
    });

    it('should set refresh token', () => {
      tokenStorage.setRefreshToken('new-refresh-token');
      expect(localStorage.getItem(StorageKey.REFRESH_TOKEN)).toBe('new-refresh-token');
    });

    it('should remove refresh token', () => {
      localStorage.setItem(StorageKey.REFRESH_TOKEN, 'token');
      tokenStorage.removeRefreshToken();
      expect(localStorage.getItem(StorageKey.REFRESH_TOKEN)).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should clear both tokens', () => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, 'access');
      localStorage.setItem(StorageKey.REFRESH_TOKEN, 'refresh');

      tokenStorage.clearTokens();

      expect(localStorage.getItem(StorageKey.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(StorageKey.REFRESH_TOKEN)).toBeNull();
    });
  });
});
