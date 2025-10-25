import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../collapsible';

describe('Collapsible components', () => {
  describe('Collapsible', () => {
    it('should render children', () => {
      render(
        <Collapsible>
          <div>Test content</div>
        </Collapsible>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should apply data-slot attribute', () => {
      const { container } = render(
        <Collapsible>
          <div>Test</div>
        </Collapsible>
      );

      const root = container.querySelector('[data-slot="collapsible"]');
      expect(root).toBeInTheDocument();
    });

    it('should accept open prop', () => {
      const { container } = render(
        <Collapsible open={true}>
          <div>Test</div>
        </Collapsible>
      );

      const root = container.querySelector('[data-slot="collapsible"]');
      expect(root).toHaveAttribute('data-state', 'open');
    });

    it('should accept defaultOpen prop', () => {
      const { container } = render(
        <Collapsible defaultOpen={true}>
          <div>Test</div>
        </Collapsible>
      );

      const root = container.querySelector('[data-slot="collapsible"]');
      expect(root).toHaveAttribute('data-state', 'open');
    });
  });

  describe('CollapsibleTrigger', () => {
    it('should render trigger button', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('should apply cursor-pointer class', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger?.className).toContain('cursor-pointer');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger className="custom-class">Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger?.className).toContain('custom-class');
    });
  });

  describe('CollapsibleContent', () => {
    it('should render content when open', () => {
      render(
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content inside</div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Content inside')).toBeInTheDocument();
    });

    it('should apply data-slot attribute', () => {
      const { container } = render(
        <Collapsible defaultOpen={true}>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const content = container.querySelector('[data-slot="collapsible-content"]');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with controlled state', () => {
      render(
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
