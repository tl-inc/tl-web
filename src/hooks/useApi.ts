/**
 * Custom hooks for API calls using React Query
 */
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type {
  HealthResponse,
  ItemListResponse,
  ItemSetListResponse,
  RangePackListResponse,
  ItemDifficultyBundleListResponse,
  ItemSetDifficultyBundleListResponse,
} from '@/types/api';

// Health check
export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get<HealthResponse>('/health');
      return data;
    },
  });
};

// Items
export const useItems = (page = 1, pageSize = 20, filters?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['items', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemListResponse>('/items', {
        params: { page, page_size: pageSize, ...filters },
      });
      return data;
    },
  });
};

// Item Sets
export const useItemSets = (page = 1, pageSize = 20, filters?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['item-sets', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemSetListResponse>('/item-sets', {
        params: { page, page_size: pageSize, ...filters },
      });
      return data;
    },
  });
};

// Range Packs
export const useRangePacks = (page = 1, pageSize = 20, filters?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['range-packs', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<RangePackListResponse>('/range-packs', {
        params: { page, page_size: pageSize, ...filters },
      });
      return data;
    },
  });
};

// Item Difficulty Bundles
export const useItemDifficultyBundles = (page = 1, pageSize = 20, filters?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['item-difficulty-bundles', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemDifficultyBundleListResponse>('/item-difficulty-bundles', {
        params: { page, page_size: pageSize, ...filters },
      });
      return data;
    },
  });
};

// Item Set Difficulty Bundles
export const useItemSetDifficultyBundles = (page = 1, pageSize = 20, filters?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['item-set-difficulty-bundles', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemSetDifficultyBundleListResponse>('/item-set-difficulty-bundles', {
        params: { page, page_size: pageSize, ...filters },
      });
      return data;
    },
  });
};
