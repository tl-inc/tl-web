import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { DialogueAsset } from '../DialogueAsset';

describe('DialogueAsset', () => {
  const mockDialogueAsset = {
    scenario: { content: 'At a coffee shop', translation: '在咖啡店' },
    dialogue: {
      speakers: [
        {
          name: { content: 'John', translation: '約翰' },
          role: { content: 'Customer', translation: '顧客' },
        },
        {
          name: { content: 'Mary', translation: '瑪麗' },
          role: { content: 'Barista', translation: '咖啡師' },
        },
      ],
      turns: [
        {
          speaker_index: 0,
          text: { content: 'Hi, can I get a latte?', translation: '嗨,我可以來杯拿鐵嗎?' },
        },
        {
          speaker_index: 1,
          text: { content: 'Sure! What size?', translation: '當然!要什麼尺寸?' },
        },
        {
          speaker_index: 0,
          message: { content: 'Medium, please.', translation: '中杯,謝謝。' },
        },
      ],
    },
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<DialogueAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when asset.dialogue is undefined', () => {
    const { container } = render(<DialogueAsset asset={{}} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render scenario when available', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getByText('💬 Scenario')).toBeInTheDocument();
    expect(screen.getByText('At a coffee shop')).toBeInTheDocument();
  });

  it('should not show scenario translation when mode is not completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.queryByText('在咖啡店')).not.toBeInTheDocument();
  });

  it('should show scenario translation when mode is completed', () => {
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
    expect(screen.getAllByText('John')).toHaveLength(2); // appears twice (2 turns by John)
    expect(screen.getByText('Mary')).toBeInTheDocument();
  });

  it('should render speaker roles', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.getAllByText(/Customer/)).toHaveLength(2);
    expect(screen.getByText(/Barista/)).toBeInTheDocument();
  });

  it('should not show translations when mode is not completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="pending" />);
    expect(screen.queryByText('(約翰)')).not.toBeInTheDocument();
    expect(screen.queryByText('嗨,我可以來杯拿鐵嗎?')).not.toBeInTheDocument();
  });

  it('should show speaker and text translations when mode is completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="completed" />);
    expect(screen.getAllByText(/約翰/)).toHaveLength(2);
    expect(screen.getByText(/瑪麗/)).toBeInTheDocument();
    expect(screen.getByText('嗨,我可以來杯拿鐵嗎?')).toBeInTheDocument();
    expect(screen.getByText('當然!要什麼尺寸?')).toBeInTheDocument();
    expect(screen.getByText('中杯,謝謝。')).toBeInTheDocument();
  });

  it('should show role translations when mode is completed', () => {
    render(<DialogueAsset asset={mockDialogueAsset} mode="completed" />);
    expect(screen.getAllByText(/顧客/)).toHaveLength(2);
    expect(screen.getByText(/咖啡師/)).toBeInTheDocument();
  });

  it('should handle dialogue without scenario', () => {
    const assetWithoutScenario = {
      dialogue: {
        speakers: [{ name: 'Alice' }],
        turns: [{ speaker_index: 0, text: 'Hello' }],
      },
    };
    render(<DialogueAsset asset={assetWithoutScenario} mode="pending" />);
    expect(screen.queryByText('💬 Scenario')).not.toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle simple string values for speaker name', () => {
    const simpleAsset = {
      dialogue: {
        speakers: [{ name: 'Bob' }],
        turns: [{ speaker_index: 0, text: 'Hi there' }],
      },
    };
    render(<DialogueAsset asset={simpleAsset} mode="pending" />);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should handle message field instead of text', () => {
    const asset = {
      dialogue: {
        speakers: [{ name: 'Charlie' }],
        turns: [{ speaker_index: 0, message: 'Using message field' }],
      },
    };
    render(<DialogueAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Using message field')).toBeInTheDocument();
  });

  it('should fallback to speaker index when name is not available', () => {
    const asset = {
      dialogue: {
        speakers: [{}],
        turns: [{ speaker_index: 0, text: 'No name given' }],
      },
    };
    render(<DialogueAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Speaker 1')).toBeInTheDocument();
  });

  it('should handle empty dialogue', () => {
    const emptyAsset = {
      dialogue: {},
    };
    const { container } = render(<DialogueAsset asset={emptyAsset} mode="pending" />);
    // Should render the container but with no turns
    expect(container.querySelector('.space-y-3')).toBeInTheDocument();
  });
});
