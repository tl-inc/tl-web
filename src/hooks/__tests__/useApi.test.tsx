import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useHealth,
  useItems,
  useItemSets,
  useRangePacks,
  useItemDifficultyBundles,
  useItemSetDifficultyBundles,
} from '../useApi';
import apiClient from '@/lib/api';

// Mock apiClient
vi.mock('@/lib/api');

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

describe('useApi hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useHealth', () => {
    it('should fetch health data', async () => {
      const mockHealthData = { status: 'ok', version: '1.0.0' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockHealthData });

      const { result } = renderHook(() => useHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockHealthData);
      expect(apiClient.get).toHaveBeenCalledWith('/health');
    });

    it('should handle health check errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useItems', () => {
    it('should fetch items with default pagination', async () => {
      const mockItems = { items: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockItems });

      const { result } = renderHook(() => useItems(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockItems);
      expect(apiClient.get).toHaveBeenCalledWith('/items', {
        params: { page: 1, page_size: 20 },
      });
    });

    it('should fetch items with custom pagination and filters', async () => {
      const mockItems = { items: [], total: 0, page: 2, page_size: 50 };
      const filters = { subject_id: 1, difficulty: 'easy' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockItems });

      const { result } = renderHook(() => useItems(2, 50, filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.get).toHaveBeenCalledWith('/items', {
        params: { page: 2, page_size: 50, ...filters },
      });
    });
  });

  describe('useItemSets', () => {
    it('should fetch item sets', async () => {
      const mockItemSets = { item_sets: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockItemSets });

      const { result } = renderHook(() => useItemSets(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockItemSets);
      expect(apiClient.get).toHaveBeenCalledWith('/item-sets', {
        params: { page: 1, page_size: 20 },
      });
    });

    it('should apply filters to item sets', async () => {
      const filters = { type: 'reading' };
      const mockItemSets = { item_sets: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockItemSets });

      const { result } = renderHook(() => useItemSets(1, 20, filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiClient.get).toHaveBeenCalledWith('/item-sets', {
        params: { page: 1, page_size: 20, ...filters },
      });
    });
  });

  describe('useRangePacks', () => {
    it('should fetch range packs', async () => {
      const mockRangePacks = { range_packs: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRangePacks });

      const { result } = renderHook(() => useRangePacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRangePacks);
      expect(apiClient.get).toHaveBeenCalledWith('/range-packs', {
        params: { page: 1, page_size: 20 },
      });
    });
  });

  describe('useItemDifficultyBundles', () => {
    it('should fetch item difficulty bundles', async () => {
      const mockBundles = { bundles: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockBundles });

      const { result } = renderHook(() => useItemDifficultyBundles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBundles);
      expect(apiClient.get).toHaveBeenCalledWith('/item-difficulty-bundles', {
        params: { page: 1, page_size: 20 },
      });
    });
  });

  describe('useItemSetDifficultyBundles', () => {
    it('should fetch item set difficulty bundles', async () => {
      const mockBundles = { bundles: [], total: 0, page: 1, page_size: 20 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockBundles });

      const { result } = renderHook(() => useItemSetDifficultyBundles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBundles);
      expect(apiClient.get).toHaveBeenCalledWith('/item-set-difficulty-bundles', {
        params: { page: 1, page_size: 20 },
      });
    });

    it('should handle errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useItemSetDifficultyBundles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });
});
