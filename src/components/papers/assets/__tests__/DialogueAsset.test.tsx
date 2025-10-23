import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { DialogueAsset } from '../DialogueAsset';

describe('DialogueAsset', () => {
  const mockDialogueAsset = {
    title: { content: 'Ordering Coffee', translation: '點咖啡' },
    setting: { content: 'At a coffee shop', translation: '在咖啡店' },
    turns: [
      {
        speaker: { content: 'John (Customer)', translation: '約翰 (顧客)' },
        text: { content: 'Hi, can I get a latte?', translation: '嗨,我可以來杯拿鐵嗎?' },
      },
      {
        speaker: { content: 'Mary (Barista)', translation: '瑪麗 (咖啡師)' },
        text: { content: 'Sure! What size?', translation: '當然!要什麼尺寸?' },
      },
      {
        speaker: { content: 'John (Customer)', translation: '約翰 (顧客)' },
        text: { content: 'Medium, please.', translation: '中杯,謝謝。' },
      },
    ],
  };

  it('should render setting when available', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getByText('💬 Setting')).toBeInTheDocument();
    expect(screen.getByText('At a coffee shop')).toBeInTheDocument();
  });

  it('should not show setting translation when mode is not completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.queryByText('在咖啡店')).not.toBeInTheDocument();
  });

  it('should show setting translation when mode is completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="completed" />);
    expect(screen.getByText('在咖啡店')).toBeInTheDocument();
  });

  it('should render all dialogue turns', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getByText('Hi, can I get a latte?')).toBeInTheDocument();
    expect(screen.getByText('Sure! What size?')).toBeInTheDocument();
    expect(screen.getByText('Medium, please.')).toBeInTheDocument();
  });

  it('should render speaker names', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getAllByText(/John \(Customer\)/)).toHaveLength(2); // appears twice (2 turns by John)
    expect(screen.getByText(/Mary \(Barista\)/)).toBeInTheDocument();
  });

  it('should render speaker roles', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getAllByText(/Customer/)).toHaveLength(2);
    expect(screen.getByText(/Barista/)).toBeInTheDocument();
  });

  it('should not show translations when mode is not completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.queryByText(/約翰 \(顧客\)/)).not.toBeInTheDocument();
    expect(screen.queryByText('嗨,我可以來杯拿鐵嗎?')).not.toBeInTheDocument();
  });

  it('should show speaker and text translations when mode is completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="completed" />);
    expect(screen.getAllByText(/約翰 \(顧客\)/)).toHaveLength(2);
    expect(screen.getByText(/瑪麗 \(咖啡師\)/)).toBeInTheDocument();
    expect(screen.getByText('嗨,我可以來杯拿鐵嗎?')).toBeInTheDocument();
    expect(screen.getByText('當然!要什麼尺寸?')).toBeInTheDocument();
    expect(screen.getByText('中杯,謝謝。')).toBeInTheDocument();
  });

  it('should show role translations when mode is completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="completed" />);
    expect(screen.getAllByText(/顧客/)).toHaveLength(2);
    expect(screen.getByText(/咖啡師/)).toBeInTheDocument();
  });

  it('should handle dialogue without setting', () => {
    const assetWithoutSetting = {
      turns: [
        {
          speaker: 'Alice',
          text: 'Hello',
        },
      ],
    };
    render(<DialogueAsset asset={assetWithoutSetting} mode="pending" />);
    expect(screen.queryByText('💬 Setting')).not.toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle simple string values for speaker name', () => {
    const simpleAsset = {
      turns: [
        {
          speaker: 'Bob',
          text: 'Hi there',
        },
      ],
    };
    render(<DialogueAsset asset={simpleAsset} mode="pending" />);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should handle empty turns', () => {
    const emptyAsset = {
      turns: [],
    };
    const { container } = render(<DialogueAsset asset={emptyAsset} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });
});
