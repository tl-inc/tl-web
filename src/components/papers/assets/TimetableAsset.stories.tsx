import type { Meta, StoryObj } from '@storybook/nextjs';
import { TimetableAsset } from './TimetableAsset';
import type { TimetableAssetData } from '@/types/paper';

const meta = {
  title: 'Papers/Assets/TimetableAsset',
  component: TimetableAsset,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimetableAsset>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 課程表 - 進行中模式
 */
export const WeeklySchedule: Story = {
  args: {
    asset: {
      title: { content: 'Weekly Class Schedule', translation: '每週課程表' },
      timetable: {
        headers: [
          { content: 'Time', translation: '時間' },
          { content: 'Monday', translation: '星期一' },
          { content: 'Tuesday', translation: '星期二' },
          { content: 'Wednesday', translation: '星期三' },
          { content: 'Thursday', translation: '星期四' },
          { content: 'Friday', translation: '星期五' },
        ],
        rows: [
          {
            time: '8:00 - 9:00',
            cells: [
              { content: 'Math', translation: '數學' },
              { content: 'English', translation: '英文' },
              { content: 'Math', translation: '數學' },
              { content: 'Science', translation: '科學' },
              { content: 'P.E.', translation: '體育' },
            ],
          },
          {
            time: '9:00 - 10:00',
            cells: [
              { content: 'English', translation: '英文' },
              { content: 'Math', translation: '數學' },
              { content: 'Science', translation: '科學' },
              { content: 'English', translation: '英文' },
              { content: 'Art', translation: '美術' },
            ],
          },
          {
            time: '10:00 - 11:00',
            cells: [
              { content: 'Science', translation: '科學' },
              { content: 'History', translation: '歷史' },
              { content: 'English', translation: '英文' },
              { content: 'Math', translation: '數學' },
              { content: 'Music', translation: '音樂' },
            ],
          },
        ],
      },
    } as TimetableAssetData,
    mode: 'in_progress',
  },
};

/**
 * 課程表 - 已完成模式 (顯示翻譯)
 */
export const WeeklyScheduleCompleted: Story = {
  args: {
    asset: {
      title: { content: 'Weekly Class Schedule', translation: '每週課程表' },
      timetable: {
        headers: [
          { content: 'Time', translation: '時間' },
          { content: 'Monday', translation: '星期一' },
          { content: 'Tuesday', translation: '星期二' },
          { content: 'Wednesday', translation: '星期三' },
        ],
        rows: [
          {
            time: '8:00 - 9:00',
            cells: [
              { content: 'Math', translation: '數學' },
              { content: 'English', translation: '英文' },
              { content: 'Math', translation: '數學' },
            ],
          },
          {
            time: '9:00 - 10:00',
            cells: [
              { content: 'English', translation: '英文' },
              { content: 'Math', translation: '數學' },
              { content: 'Science', translation: '科學' },
            ],
          },
        ],
      },
    } as TimetableAssetData,
    mode: 'completed',
  },
};

/**
 * 中文課表
 */
export const ChineseTimetable: Story = {
  args: {
    asset: {
      title: '國中課程表',
      timetable: {
        headers: ['時間', '星期一', '星期二', '星期三', '星期四', '星期五'],
        rows: [
          { time: '08:00 - 08:50', cells: ['國文', '數學', '英文', '自然', '社會'] },
          { time: '09:00 - 09:50', cells: ['數學', '英文', '國文', '數學', '體育'] },
          { time: '10:00 - 10:50', cells: ['英文', '自然', '數學', '英文', '美術'] },
          { time: '11:00 - 11:50', cells: ['自然', '社會', '體育', '國文', '音樂'] },
        ],
      },
    } as TimetableAssetData,
    mode: 'in_progress',
  },
};

/**
 * 巴士時刻表
 */
export const BusSchedule: Story = {
  args: {
    asset: {
      title: { content: 'Bus Route 42 Schedule', translation: '42號公車時刻表' },
      timetable: {
        headers: [
          { content: 'Station', translation: '站點' },
          { content: 'Departure', translation: '發車時間' },
        ],
        rows: [
          {
            time: '',
            cells: [
              { content: 'Main Station', translation: '總站' },
              { content: '7:00 AM', translation: '上午7:00' },
            ],
          },
          {
            time: '',
            cells: [
              { content: 'City Hall', translation: '市政廳' },
              { content: '7:15 AM', translation: '上午7:15' },
            ],
          },
          {
            time: '',
            cells: [
              { content: 'Library', translation: '圖書館' },
              { content: '7:30 AM', translation: '上午7:30' },
            ],
          },
          {
            time: '',
            cells: [
              { content: 'School', translation: '學校' },
              { content: '7:45 AM', translation: '上午7:45' },
            ],
          },
        ],
      },
    } as TimetableAssetData,
    mode: 'completed',
  },
};
