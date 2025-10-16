import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreCard } from '../ScoreCard';

describe('ScoreCard', () => {
  describe('渲染', () => {
    it('應該顯示總分', () => {
      render(<ScoreCard score={85} correctCount={17} totalCount={20} />);

      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('分')).toBeInTheDocument();
    });

    it('應該顯示答對數', () => {
      render(<ScoreCard score={85} correctCount={17} totalCount={20} />);

      expect(screen.getByText('17')).toBeInTheDocument();
      expect(screen.getByText('答對')).toBeInTheDocument();
    });

    it('應該顯示答錯數', () => {
      render(<ScoreCard score={85} correctCount={17} totalCount={20} />);

      // 20 - 17 = 3
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('答錯')).toBeInTheDocument();
    });

    it('應該顯示總題數', () => {
      render(<ScoreCard score={85} correctCount={17} totalCount={20} />);

      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('總題數')).toBeInTheDocument();
    });
  });

  describe('等級文字', () => {
    it('應該顯示「優異」當分數 >= 90', () => {
      render(<ScoreCard score={95} correctCount={19} totalCount={20} />);
      expect(screen.getByText('優異')).toBeInTheDocument();
    });

    it('應該顯示「良好」當分數 >= 70 且 < 90', () => {
      render(<ScoreCard score={75} correctCount={15} totalCount={20} />);
      expect(screen.getByText('良好')).toBeInTheDocument();
    });

    it('應該顯示「及格」當分數 >= 60 且 < 70', () => {
      render(<ScoreCard score={65} correctCount={13} totalCount={20} />);
      expect(screen.getByText('及格')).toBeInTheDocument();
    });

    it('應該顯示「待加強」當分數 < 60', () => {
      render(<ScoreCard score={50} correctCount={10} totalCount={20} />);
      expect(screen.getByText('待加強')).toBeInTheDocument();
    });
  });

  describe('邊界情況', () => {
    it('應該正確處理滿分', () => {
      render(<ScoreCard score={100} correctCount={20} totalCount={20} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('優異')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // 答錯數
    });

    it('應該正確處理零分', () => {
      render(<ScoreCard score={0} correctCount={0} totalCount={20} />);

      // 使用 getAllByText 因為會有多個 "0" (分數和答對數)
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThan(0);
      expect(screen.getByText('待加強')).toBeInTheDocument();
      // 使用 getAllByText 因為會有多個 "20" (答錯數和總題數都是 20)
      const twenties = screen.getAllByText('20');
      expect(twenties.length).toBe(2); // 答錯數 = 總題數 = 20
    });

    it('應該正確處理只有一題', () => {
      render(<ScoreCard score={100} correctCount={1} totalCount={1} />);

      // 使用 getAllByText 因為會有多個 "1" (答對數和總題數)
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThan(0);
      expect(screen.getByText('答對')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // 答錯數
    });
  });

  describe('樣式主題', () => {
    it('應該使用綠色主題當分數 >= 90', () => {
      const { container } = render(<ScoreCard score={95} correctCount={19} totalCount={20} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-green-50');
    });

    it('應該使用藍色主題當分數 >= 70 且 < 90', () => {
      const { container } = render(<ScoreCard score={75} correctCount={15} totalCount={20} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-blue-50');
    });

    it('應該使用黃色主題當分數 >= 60 且 < 70', () => {
      const { container } = render(<ScoreCard score={65} correctCount={13} totalCount={20} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-yellow-50');
    });

    it('應該使用紅色主題當分數 < 60', () => {
      const { container } = render(<ScoreCard score={50} correctCount={10} totalCount={20} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-red-50');
    });
  });
});
