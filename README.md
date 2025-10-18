# TL-Web 🎓

**TL (True Learning)** 的現代化前端應用程式 - 一個智能化的試卷練習平台

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Test Coverage](https://img.shields.io/badge/coverage-47.95%25-brightgreen)
![Code Quality](https://img.shields.io/badge/quality-A%2B%20(95%2F100)-brightgreen)

## ✨ 特色功能

- 🎯 **智能試卷生成** - 根據學習範圍自動生成個人化試卷
- 📊 **學習分析** - 即時追蹤學習進度和成效
- 🎨 **豐富題型支援** - MCQ、克漏字、題組、資訊理解等多種題型
- 🌐 **雙語介面** - 支援繁體中文和英文
- 📱 **響應式設計** - 完美支援桌面和行動裝置
- 🔐 **OAuth 認證** - Google 登入整合
- 🎨 **元件庫** - Storybook 可視化元件開發環境

## 🚀 快速開始

### 環境需求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安裝

```bash
# 複製專案
git clone https://github.com/tl-inc/tl-web.git
cd tl-web

# 安裝依賴
npm install
```

### 環境變數設定

建立 `.env.local` 檔案:

```env
# API 端點
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google OAuth (可選)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

更多 OAuth 設定請參考 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

### 開發

```bash
# 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 檢視應用程式

### 測試

```bash
# 執行測試
npm test

# 測試 UI 介面
npm run test:ui

# 測試覆蓋率報告
npm run test:coverage
```

### Storybook

```bash
# 啟動 Storybook
npm run storybook
```

開啟 [http://localhost:6006](http://localhost:6006) 檢視元件庫

### 建置

```bash
# 建置正式環境版本
npm run build

# 啟動正式環境伺服器
npm start
```

## 📁 專案結構

```
tl-web/
├── src/
│   ├── app/                    # Next.js App Router 頁面
│   │   ├── analytics/          # 學習分析頁面
│   │   ├── dashboard/          # 儀表板
│   │   ├── papers/             # 試卷練習頁面
│   │   ├── paper-configuration/ # 試卷設定
│   │   ├── paper-history/      # 試卷歷史記錄
│   │   ├── login/              # 登入頁面
│   │   └── signup/             # 註冊頁面
│   │
│   ├── components/             # React 元件
│   │   ├── auth/              # 認證相關元件
│   │   ├── layout/            # 版面配置元件
│   │   ├── papers/            # 試卷相關元件
│   │   │   ├── assets/        # 資訊型元件 (Menu, Notice, Dialogue...)
│   │   │   └── exercises/     # 題型元件 (MCQ, Cloze, ItemSet...)
│   │   └── ui/                # UI 基礎元件 (Button, Card, Select...)
│   │
│   ├── contexts/              # React Context
│   │   ├── AuthContext.tsx    # 認證狀態管理
│   │   └── SidebarContext.tsx # 側邊欄狀態管理
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useApi.ts          # API 呼叫 hooks
│   │   └── papers/            # 試卷相關 hooks
│   │
│   ├── stores/                # Zustand 狀態管理
│   │   └── usePaperStore.ts   # 試卷狀態 store
│   │
│   ├── lib/                   # 工具函式庫
│   │   ├── api/               # API 服務層
│   │   │   ├── auth.ts        # 認證 API
│   │   │   ├── paper.ts       # 試卷 API
│   │   │   ├── analytics.ts   # 分析 API
│   │   │   └── rangePack.ts   # 範圍包 API
│   │   ├── api.ts             # API Client (Axios)
│   │   ├── storage.ts         # localStorage 封裝
│   │   ├── providers.tsx      # React Query Provider
│   │   └── utils.ts           # 通用工具函式
│   │
│   ├── types/                 # TypeScript 型別定義
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── exercise.ts
│   │   ├── paper.ts
│   │   └── range-pack.ts
│   │
│   └── stories/               # Storybook stories
│
├── .storybook/                # Storybook 配置
├── vitest.config.ts           # Vitest 測試配置
├── tailwind.config.ts         # Tailwind CSS 配置
└── next.config.ts             # Next.js 配置
```

## 🏗️ 技術架構

### 核心技術

- **框架**: Next.js 15.5.4 (App Router)
- **UI 框架**: React 19.1.0
- **語言**: TypeScript 5.x
- **樣式**: Tailwind CSS 4.x
- **狀態管理**: Zustand 5.x + React Context
- **資料請求**: TanStack Query (React Query) 5.x
- **表單處理**: React Hook Form + Zod
- **HTTP Client**: Axios

### UI 元件

- **基礎元件**: Radix UI
- **圖示**: Lucide React
- **通知**: React Hot Toast
- **圖表**: Recharts

### 開發工具

- **測試框架**: Vitest + Testing Library
- **元件開發**: Storybook 9.x
- **程式碼品質**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **型別檢查**: TypeScript

## 🧪 測試策略

目前測試覆蓋率: **47.95%**

### 測試重點

- ✅ **核心模組 100% 覆蓋**:
  - AuthContext
  - SidebarContext
  - useApi hooks
  - API 服務層
  - ProtectedRoute
  - Header 元件

- ✅ **UI 元件 96.47% 覆蓋**:
  - Button, Card, Select, Collapsible

- ✅ **Papers 模組高覆蓋率**:
  - Exercises: 95.45%
  - Assets: 92.96%
  - Layout: 100%

### 執行測試

```bash
# 執行所有測試
npm test

# Watch 模式
npm test -- --watch

# 產生覆蓋率報告
npm run test:coverage
```

## 🎨 Storybook 元件庫

我們使用 Storybook 來開發和文檔化 UI 元件。

### 已文檔化的元件 (12 個,100% 覆蓋)

**UI 元件** (4/4):
- Button - 10+ variants
- Card - 5 examples
- Select - 7 scenarios
- Collapsible - 5 scenarios

**Exercise 元件** (3/3):
- MCQExercise - 7 scenarios
- ClozeExercise - 4 scenarios
- ItemSetExercise - 7 scenarios

**Asset 元件** (5/5):
- MenuAsset - 5 examples
- NoticeAsset - 6 scenarios
- DialogueAsset - 6 scenarios
- TimetableAsset - 4 scenarios
- AdvertisementAsset - 5 scenarios

## 📊 程式碼品質

**整體評分: A+ (95/100)**

| 項目 | 分數 | 狀態 |
|------|------|------|
| 架構設計 | 20/20 | ✅ 完美 |
| 型別安全 | 15/15 | ✅ 完美 |
| 程式碼品質 | 15/15 | ✅ 完美 |
| 錯誤處理 | 13/15 | ✅ 優良 |
| 安全性 | 13/15 | ✅ 優良 |
| 可維護性 | 10/10 | ✅ 完美 |
| 效能 | 10/10 | ✅ 完美 |
| 文檔完整性 | 10/10 | ✅ 完美 |

### 關鍵指標

- ✅ **0 個 `any` 型別** - 完全型別安全
- ✅ **console.log 僅 4 處** - 僅保留關鍵錯誤處理
- ✅ **主頁面從 1,440 行減少到 319 行** - 減少 78%
- ✅ **ESLint 問題從 148 減少到 12** - 減少 92%
- ✅ **Analytics bundle size 減少 97%** (91.5 kB → 2.86 kB)

## 🔧 開發指南

### 編碼規範

1. **型別安全**: 禁止使用 `any`,使用明確型別或 `unknown`
2. **狀態管理**: 優先使用 Zustand,複雜跨元件狀態使用 Context
3. **API 呼叫**: 統一使用 `lib/api` 服務層,禁止直接使用 `fetch`
4. **Storage**: 使用 `lib/storage.ts`,禁止直接使用 `localStorage`
5. **測試**: 新功能必須包含測試
6. **元件**: 單一職責,檔案不超過 300 行

### Git Workflow

1. **Pre-commit hooks**: 自動執行 ESLint 和相關測試
2. **Commit message**: 遵循 Conventional Commits
   - `feat:` - 新功能
   - `fix:` - 修復 bug
   - `refactor:` - 重構
   - `test:` - 測試
   - `docs:` - 文檔
   - `perf:` - 效能優化

### 效能最佳化

- ✅ 使用 `React.memo` 避免不必要的重渲染 (8 個元件)
- ✅ 使用 `useMemo` 快取計算結果 (4 處)
- ✅ 使用 `useCallback` 快取事件處理器 (1 處)
- ✅ 使用 Dynamic imports 進行程式碼分割 (Recharts)

## 📚 相關文檔

- [架構文檔](./ARCHITECTURE.md) - 詳細架構說明
- [重構計劃](./TL_WEB_REFACTOR.md) - 重構歷程記錄
- [Google OAuth 設定](./GOOGLE_OAUTH_SETUP.md) - OAuth 配置指南
- [Vercel 部署](./VERCEL_DEPLOYMENT.md) - 部署指南
- [貢獻指南](./CONTRIBUTING.md) - 如何貢獻程式碼

## 🚢 部署

### Vercel (推薦)

此專案已針對 Vercel 優化,可一鍵部署:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tl-inc/tl-web)

詳細部署步驟請參考 [Vercel 部署指南](./docs/VERCEL_DEPLOYMENT.md)

### 自行部署

```bash
# 建置
npm run build

# 啟動
npm start
```

## 🤝 貢獻

歡迎貢獻! 請閱讀 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解貢獻流程。

## 📝 License

MIT

## 👥 團隊

由 TL 團隊開發和維護

---

**專案狀態**: 🟢 Active Development

**最後更新**: 2025-10-16
