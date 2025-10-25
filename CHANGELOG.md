# Changelog

所有重要的變更都會記錄在此文件中。

## [Unreleased]

### 型別安全與程式碼品質改進 (2025-10-26)

#### Upgraded
- 升級 Storybook 從 9.1.13 → 9.1.15 (patch 更新)
- 升級 React 和 React DOM 從 19.1.0 → 19.2.0 (minor 更新)
- 所有測試通過驗證 (355/355 tests passing)
- Storybook 正常運作確認

#### Fixed
- 修正 RangeSelector 類型匯出錯誤：`GradeOption` → `GradeSemesterOption` (index.ts:13)
- 補全 `RangePack` 介面缺少的欄位：`semester`, `display_order`, `description`, `created_at`, `updated_at` (rangePack.ts)
- 修正測試檔案類型錯誤：`NavigationPanel.test.tsx` mode 參數從 `string` 改為 `PageMode` (NavigationPanel.test.tsx:62)
- 升級圖片元件：將 `<img>` 替換為 Next.js `<Image />` 以提升效能 (ItemSetExercise.tsx:76-86)

#### Removed
- 清理 7 個檔案的未使用 imports：`within`, `fireEvent`, `vi`, `usePaperActions`, `PaperData`, `usePaperDataStore`
- 移除 Storybook 檔案中的 11 個 `console.log` 語句 (ClozeExercise.stories.tsx)
- 清理未使用變數：`originalBody` (select.test.tsx), `answers` (usePaperActions.ts)

#### Improved
- ESLint 警告從 23 → 0 (100% 改進)
- TypeScript 編譯錯誤從 3 → 0
- 生產構建現在可正常完成
- 新增缺少的類型匯出：`PublisherEditionOption`, `PublisherEditionsResponse`

#### Dependency Upgrade Evaluation
完成主要版本升級評估（使用 MCP Context7 + WebSearch）：

**Vitest 3.2.4 → 4.0.3**
- ❌ **暫不升級** - 主要版本跳躍風險高，breaking changes 影響範圍不明確
- 破壞性變更：Coverage 配置重構、Pool options 改名、Test/Describe 參數順序變更、Mock API 變更
- 預估工作量：3.5-5.5 小時（需掃描所有 355 個測試）
- 建議時機：等待 v4.2+ 穩定版本（2026 Q2）
- 當前狀態：355/355 tests passing，測試狀態良好

**Next.js 15.5.4 → 16.0.0**
- ❌ **強烈不建議升級** - 破壞性極大，影響範圍極廣
- 重大變更：Async Request APIs（cookies/headers/params 全部需要 await）、Node.js 20.9.0+ 要求、Middleware → Proxy 改名
- 預估工作量：13-25 小時（幾乎所有 Server Components 需要改動）
- 建議時機：等待 v16.3+ 和社群最佳實踐成熟（2026 Q2-Q3）
- 當前狀態：Next.js 15.5.4 穩定且成熟，React 19.2.0 完全相容

**綜合建議**：保持依賴項穩定，專注功能開發，僅執行 minor/patch 安全更新

### 刷題模式 (Exercise Session) 功能改進

#### Added
- 新增觸覺回饋：點擊答案選項時觸發 10ms 短震動 (page.tsx:74-76)
- 新增連勝徽章：2 連勝以上顯示華麗的漸層火焰徽章 🔥 (page.tsx:191-197)
- 新增自動捲動：換題時自動捲動到頁面頂部，確保統計資訊可見 (page.tsx:66)
- 支援文法題 (type 3)：文法題現在使用 MCQ 格式正確顯示 (ExerciseRenderer.tsx:41, 88)

#### Changed
- 改進統計資訊顯示 (page.tsx:167-198)：
  - 「正確率」改為「已完成：」+ 總題數
  - 新增「Ｏ：」顯示答對數（綠色）
  - 新增「Ｘ：」顯示答錯數（紅色）
  - 連勝資訊只在 2 連勝以上時顯示
- 修正 NaN 顯示問題：確保所有統計數值都有預設值 0 (page.tsx:188)

#### Fixed
- 修正文法題不顯示的問題：type 3 (文法) 現在正確使用 MCQ 格式而非 Cloze 格式
- 修正換題時捲動失效問題：移動 scrollTo 到 useEffect 中，在新題目載入後執行
- 修正統計數值顯示：使用正確的欄位名稱 `total_questions` 而非 `total_answered`

#### Backend Changes
- 新增 skill.metadata 欄位到 Pydantic schema (exercise_session.py:55)
- 修正 SQLAlchemy 屬性名稱：使用 `skill.skill_metadata` 和 `item.item_metadata` (exercise_session_manager.py:223, 569)
- 題目內容包含 metadata 欄位，支援翻譯和詞性資訊

#### Frontend Changes
- POS 值中文化：auxiliary → 助動詞, noun → 名詞等 (page.tsx:183-196)
- 移除 skill level 星級顯示
- 移除 skill name 後的 (lexicon) 類型標籤
- 移除「刷題練習」主標題，改為簡潔的頂部導航列
- 優化手機顯示：responsive padding, sticky navigation
- 新增向左滑動換題手勢（僅在顯示答案後可用）

#### Tests
- 新增 ExerciseRenderer 測試：涵蓋 type 1, 2, 3 的 MCQ 格式支援
- 新增刷題頁面測試：
  - 統計資訊正確顯示
  - 連勝徽章顯示邏輯
  - 觸覺回饋功能
  - 自動捲動行為
  - 滑動手勢偵測

## Previous Changes

(待補充先前的版本記錄)
