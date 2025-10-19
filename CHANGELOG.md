# Changelog

所有重要的變更都會記錄在此文件中。

## [Unreleased]

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
