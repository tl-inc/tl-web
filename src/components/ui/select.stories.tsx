import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本下拉選單
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="選擇科目" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="math">數學</SelectItem>
          <SelectItem value="english">英文</SelectItem>
          <SelectItem value="science">自然</SelectItem>
          <SelectItem value="history">歷史</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * 分組下拉選單
 */
export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="選擇課程" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>國中課程</SelectLabel>
            <SelectItem value="junior-math">國中數學</SelectItem>
            <SelectItem value="junior-english">國中英文</SelectItem>
            <SelectItem value="junior-science">國中自然</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>高中課程</SelectLabel>
            <SelectItem value="senior-math">高中數學</SelectItem>
            <SelectItem value="senior-english">高中英文</SelectItem>
            <SelectItem value="senior-physics">高中物理</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * 英文下拉選單
 */
export const EnglishSelect: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
          <SelectItem value="mango">Mango</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * 預設選中值
 */
export const WithDefaultValue: Story = {
  render: () => {
    const [value, setValue] = useState('math');

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="math">數學</SelectItem>
          <SelectItem value="english">英文</SelectItem>
          <SelectItem value="science">自然</SelectItem>
          <SelectItem value="history">歷史</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/**
 * 禁用狀態
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="已禁用" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">選項 1</SelectItem>
        <SelectItem value="2">選項 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * 難度選擇
 */
export const DifficultySelect: Story = {
  render: () => {
    const [value, setValue] = useState('medium');

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">選擇難度</label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">🟢 簡單</SelectItem>
            <SelectItem value="medium">🟡 中等</SelectItem>
            <SelectItem value="hard">🔴 困難</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

/**
 * 多個下拉選單
 */
export const MultipleSelects: Story = {
  render: () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [difficulty, setDifficulty] = useState('');

    return (
      <div className="space-y-4 min-w-[300px]">
        <div className="space-y-2">
          <label className="text-sm font-medium">科目</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="選擇科目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">數學</SelectItem>
              <SelectItem value="english">英文</SelectItem>
              <SelectItem value="science">自然</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">年級</label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger>
              <SelectValue placeholder="選擇年級" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">七年級</SelectItem>
              <SelectItem value="8">八年級</SelectItem>
              <SelectItem value="9">九年級</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">難度</label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="選擇難度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">簡單</SelectItem>
              <SelectItem value="medium">中等</SelectItem>
              <SelectItem value="hard">困難</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};
