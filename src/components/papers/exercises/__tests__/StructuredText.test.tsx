import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { StructuredText } from '../StructuredText';
import type { StructuredBreakdownUnit } from '@/types/paper';

describe('StructuredText', () => {
  const mockBreakdown: StructuredBreakdownUnit[] = [
    {
      content: 'Hello',
      translation: '你好',
      pos: '感嘆詞',
      explanation: 'A greeting word',
    },
    {
      content: ',',
      translation: '，',
      pos: '標點符號',
      explanation: '',
    },
    {
      content: 'world',
      translation: '世界',
      pos: '名詞',
      explanation: 'The earth and all its inhabitants',
    },
  ];

  it('should render all units with correct content', () => {
    render(<StructuredText breakdown={mockBreakdown} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText(',')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('should not render tooltips for punctuation', () => {
    const { container } = render(<StructuredText breakdown={mockBreakdown} />);

    // Punctuation should not have tooltip elements
    const punctuationSpans = container.querySelectorAll('.cursor-pointer');
    expect(punctuationSpans.length).toBe(2); // Only 'Hello' and 'world', not the comma
  });

  it('should show tooltip when clicking a word', () => {
    render(<StructuredText breakdown={mockBreakdown} />);

    const helloWord = screen.getByText('Hello');
    fireEvent.click(helloWord);

    // Tooltip should be visible
    expect(screen.getByText('你好')).toBeVisible();
    expect(screen.getByText('感嘆詞')).toBeVisible();
    expect(screen.getByText('A greeting word')).toBeVisible();
  });

  it('should close tooltip when clicking the same word again', () => {
    const { container } = render(<StructuredText breakdown={mockBreakdown} />);

    const helloWord = screen.getByText('Hello');

    // Open tooltip
    fireEvent.click(helloWord);
    let visibleTooltips = container.querySelectorAll('.visible.opacity-100');
    expect(visibleTooltips.length).toBe(1);

    // Close tooltip
    fireEvent.click(helloWord);
    visibleTooltips = container.querySelectorAll('.visible.opacity-100');
    expect(visibleTooltips.length).toBe(0);
  });

  it('should switch tooltip when clicking different words', () => {
    render(<StructuredText breakdown={mockBreakdown} />);

    const helloWord = screen.getByText('Hello');
    const worldWord = screen.getByText('world');

    // Click first word
    fireEvent.click(helloWord);
    expect(screen.getByText('你好')).toBeInTheDocument();
    expect(screen.getByText('感嘆詞')).toBeInTheDocument();

    // Click second word - should show different tooltip
    fireEvent.click(worldWord);
    expect(screen.getByText('世界')).toBeInTheDocument();
    expect(screen.getByText('名詞')).toBeInTheDocument();
  });

  it('should close tooltip when clicking outside', () => {
    const { container } = render(
      <div>
        <StructuredText breakdown={mockBreakdown} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const helloWord = screen.getByText('Hello');
    const outside = screen.getByTestId('outside');

    // Open tooltip
    fireEvent.click(helloWord);
    let visibleTooltips = container.querySelectorAll('.visible.opacity-100');
    expect(visibleTooltips.length).toBe(1);

    // Click outside
    fireEvent.mouseDown(outside);
    visibleTooltips = container.querySelectorAll('.visible.opacity-100');
    expect(visibleTooltips.length).toBe(0);
  });

  it('should render without explanation if not provided', () => {
    const breakdownWithoutExplanation: StructuredBreakdownUnit[] = [
      {
        content: 'test',
        translation: '測試',
        pos: '名詞',
        explanation: '',
      },
    ];

    render(<StructuredText breakdown={breakdownWithoutExplanation} />);

    const testWord = screen.getByText('test');
    fireEvent.click(testWord);

    expect(screen.getByText('測試')).toBeVisible();
    expect(screen.getByText('名詞')).toBeVisible();
    // No explanation should be rendered
    const tooltip = testWord.parentElement?.querySelector('.border-t');
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should add active styling when tooltip is open', () => {
    render(<StructuredText breakdown={mockBreakdown} />);

    const helloWord = screen.getByText('Hello');
    const contentSpan = helloWord;

    // Before click - no active styling
    expect(contentSpan.className).not.toContain('bg-blue-200');

    // After click - should have active styling
    fireEvent.click(helloWord);
    expect(contentSpan.className).toContain('bg-blue-200');
  });
});
