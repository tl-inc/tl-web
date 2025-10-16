/**
 * Analytics API tests
 */
import { describe, it, expect } from 'vitest';
import { analyticsService } from '../analytics';

describe('analyticsService', () => {
  it('should be defined', () => {
    expect(analyticsService).toBeDefined();
  });
});
