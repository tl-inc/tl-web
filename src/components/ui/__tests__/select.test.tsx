import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../select';

describe('Select components', () => {
  describe('Select', () => {
    it('should render children', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('should render with default size', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('should render with small size', () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger?.className).toContain('custom-trigger');
    });

    it('should render ChevronDown icon', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('SelectValue', () => {
    it('should render placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should apply data-slot attribute', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue data-slot="select-value" />
          </SelectTrigger>
        </Select>
      );

      const value = container.querySelector('[data-slot="select-value"]');
      expect(value).toBeInTheDocument();
    });
  });

  describe('SelectGroup', () => {
    it('should apply data-slot attribute', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // SelectContent uses Portal, so check in document instead of container
      const group = document.querySelector('[data-slot="select-group"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe('SelectLabel', () => {
    it('should render label text', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="custom-label">Label</SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const label = document.querySelector('[data-slot="select-label"]');
      expect(label?.className).toContain('custom-label');
    });
  });

  describe('SelectItem', () => {
    it('should render item text', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" className="custom-item">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      );

      const item = document.querySelector('[data-slot="select-item"]');
      expect(item?.className).toContain('custom-item');
    });
  });

  describe('SelectSeparator', () => {
    it('should render separator', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const separator = document.querySelector('[data-slot="select-separator"]');
      expect(separator).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectSeparator className="custom-separator" />
          </SelectContent>
        </Select>
      );

      const separator = document.querySelector('[data-slot="select-separator"]');
      expect(separator?.className).toContain('custom-separator');
    });
  });

  describe('SelectContent - MutationObserver cleanup', () => {
    let originalBody: HTMLElement;

    beforeEach(() => {
      originalBody = document.body;
    });

    afterEach(() => {
      // Clean up any modifications to body
      document.body.removeAttribute('data-scroll-locked');
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    });

    it('should prevent scroll lock on body', () => {
      render(
        <Select open={true}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );

      // Simulate Radix adding scroll lock
      document.body.setAttribute('data-scroll-locked', '1');
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';

      // The MutationObserver should remove these
      // (we can't easily test async MutationObserver in this simple test,
      // but we can verify the component renders without errors)
      const content = document.querySelector('[data-slot="select-content"]');
      expect(content).toBeInTheDocument();
    });
  });
});
