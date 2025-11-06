# TL-Web 🎓

**TL (True Learning)** 的現代化前端應用程式 - 一個智能化的試卷練習平台

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Test Coverage](https://img.shields.io/badge/coverage-26.55%25-yellow)

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

更多設定請參考 [部署指南](./docs/DEPLOYMENT.md)

### 開發

```bash
# 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 檢視應用程式

### 測試

```bash
# 執行測試
npm run test:run

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
│   ├── components/             # React 元件
│   ├── contexts/              # React Context
│   ├── hooks/                 # Custom React Hooks
│   ├── stores/                # Zustand 狀態管理
│   ├── lib/                   # 工具函式庫
│   ├── types/                 # TypeScript 型別定義
│   └── stories/               # Storybook stories
├── docs/                      # 專案文件
├── .storybook/                # Storybook 配置
├── vitest.config.ts           # Vitest 測試配置
└── next.config.ts             # Next.js 配置
```

## 🏗️ 核心技術

- **框架**: Next.js 15 (App Router) + React 19
- **語言**: TypeScript 5.x
- **樣式**: Tailwind CSS 4.x
- **狀態管理**: Zustand + React Query
- **測試**: Vitest + Testing Library
- **元件開發**: Storybook 9.x

詳細技術架構請參考 [架構文檔](./docs/ARCHITECTURE.md)

## 📚 相關文檔

- [架構文檔](./docs/ARCHITECTURE.md) - 詳細技術架構和設計決策
- [貢獻指南](./docs/CONTRIBUTING.md) - 如何貢獻程式碼
- [部署指南](./docs/DEPLOYMENT.md) - Vercel 部署和 OAuth 設定

## 🚢 部署

### Vercel (推薦)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tl-inc/tl-web)

詳細部署步驟請參考 [部署指南](./docs/DEPLOYMENT.md)

## 🤝 貢獻

歡迎貢獻! 請閱讀 [貢獻指南](./docs/CONTRIBUTING.md) 了解貢獻流程。

## 📝 License

MIT

## 👥 團隊

由 TL 團隊開發和維護

---

**專案狀態**: 🟢 Active Development

**最後更新**: 2025-11-06
