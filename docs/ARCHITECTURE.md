# TL-Web 架構文檔 🏗️

**版本**: 1.0
**最後更新**: 2025-10-18
**維護者**: TL Team

本文檔詳細說明 TL-Web 的技術架構、設計決策和最佳實踐。

---

## 📋 目錄

- [整體架構](#整體架構)
- [技術棧](#技術棧)
- [目錄結構](#目錄結構)
- [核心模組](#核心模組)
- [資料流](#資料流)
- [狀態管理](#狀態管理)
- [API 層架構](#api-層架構)
- [元件設計](#元件設計)
- [型別系統](#型別系統)
- [測試策略](#測試策略)
- [效能優化](#效能優化)
- [安全性](#安全性)
- [設計決策](#設計決策)

---

## 整體架構

TL-Web 採用 **Next.js App Router** 架構,結合 **服務端渲染 (SSR)** 和 **客戶端渲染 (CSR)** 的優勢。

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js App Router (React)               │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              UI Components                       │  │  │
│  │  │  (pages/, components/, stories/)                │  │  │
│  │  └─────────────┬───────────────────────────────────┘  │  │
│  │                │                                        │  │
│  │  ┌─────────────▼───────────────────────────────────┐  │  │
│  │  │         State Management Layer                  │  │  │
│  │  │  (Zustand, Context, React Query)               │  │  │
│  │  └─────────────┬───────────────────────────────────┘  │  │
│  │                │                                        │  │
│  │  ┌─────────────▼───────────────────────────────────┐  │  │
│  │  │            Service Layer                        │  │  │
│  │  │  (lib/api/, hooks/)                            │  │  │
│  │  └─────────────┬───────────────────────────────────┘  │  │
│  │                │                                        │  │
│  │  ┌─────────────▼───────────────────────────────────┐  │  │
│  │  │         HTTP Client (Axios)                     │  │  │
│  │  │  (lib/api.ts - 統一 API Client)                │  │  │
│  │  └─────────────┬───────────────────────────────────┘  │  │
│  └────────────────┼────────────────────────────────────┘  │
└───────────────────┼────────────────────────────────────────┘
                    │ HTTPS
                    │
┌───────────────────▼────────────────────────────────────────┐
│                     Backend API                             │
│            (tl-public-api - FastAPI)                        │
└─────────────────────────────────────────────────────────────┘
```

### 分層架構

1. **Presentation Layer (UI)**
   - Next.js Pages (App Router)
   - React Components
   - Storybook Stories

2. **State Management Layer**
   - Zustand (全域狀態)
   - React Context (跨元件狀態)
   - React Query (伺服器狀態)

3. **Service Layer**
   - API Services (`lib/api/*`)
   - Custom Hooks (`hooks/*`)
   - Utility Functions (`lib/utils.ts`)

4. **Infrastructure Layer**
   - Axios HTTP Client
   - localStorage Wrapper
   - Error Boundaries

---

## 技術棧

### 核心框架

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.5.4 | React 框架,SSR/SSG 支援 |
| **React** | 19.2.0 | UI 框架 |
| **TypeScript** | 5.x | 型別安全 |
| **Tailwind CSS** | 4.x | 樣式框架 |

### 狀態管理

| 技術 | 版本 | 用途 |
|------|------|------|
| **Zustand** | 5.0.8 | 輕量級全域狀態管理 |
| **React Query** | 5.90.2 | 伺服器狀態管理、快取 |
| **React Context** | - | 跨元件狀態共享 |

### UI 元件

| 技術 | 版本 | 用途 |
|------|------|------|
| **Radix UI** | - | Headless UI 元件 |
| **Lucide React** | 0.545.0 | Icon 圖示庫 |
| **React Hook Form** | 7.64.0 | 表單處理 |
| **Zod** | 4.1.12 | Schema 驗證 |
| **Recharts** | 3.2.1 | 圖表庫 |

### 開發工具

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vitest** | 3.2.4 | 測試框架 |
| **Testing Library** | 16.3.0 | React 測試工具 |
| **Storybook** | 9.1.15 | 元件開發環境 |
| **ESLint** | 9.x | 程式碼檢查 |
| **Husky** | 9.1.7 | Git Hooks |

---

## 目錄結構

```
tl-web/
├── src/
│   ├── app/                      # Next.js App Router 頁面
│   │   ├── layout.tsx            # 根 Layout (ErrorBoundary, Providers)
│   │   ├── page.tsx              # 首頁
│   │   ├── login/                # 登入頁面
│   │   ├── signup/               # 註冊頁面
│   │   ├── dashboard/            # 儀表板
│   │   ├── analytics/            # 學習分析
│   │   ├── papers/               # 試卷練習
│   │   │   └── [paper_id]/       # 動態路由 - 試卷詳情
│   │   ├── chart/                # 圖表頁面
│   │   ├── paper-configuration/  # 試卷設定
│   │   └── paper-history/        # 歷史記錄
│   │
│   ├── components/               # React 元件
│   │   ├── auth/                 # 認證相關
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── layout/               # Layout 元件
│   │   │   ├── Sidebar.tsx
│   │   │   └── SidebarLayout.tsx
│   │   │
│   │   ├── analytics/            # 分析相關元件
│   │   │   └── ExerciseTypeRadarChart.tsx
│   │   │
│   │   ├── papers/               # 試卷相關元件
│   │   │   ├── CardView/         # 卡片視圖元件
│   │   │   │   ├── CardViewContainer.tsx
│   │   │   │   ├── ExerciseCard.tsx
│   │   │   │   ├── NavigationControls.tsx
│   │   │   │   ├── NavigationPanel.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   └── ViewModeToggle.tsx
│   │   │   │
│   │   │   ├── exercises/        # 題型元件
│   │   │   │   ├── ClozeExercise.tsx     # 克漏字
│   │   │   │   ├── MCQExercise.tsx       # 選擇題
│   │   │   │   └── ItemSetExercise.tsx   # 題組
│   │   │   │
│   │   │   └── assets/           # 資訊型元件
│   │   │       ├── MenuAsset.tsx
│   │   │       ├── NoticeAsset.tsx
│   │   │       ├── DialogueAsset.tsx
│   │   │       ├── TimetableAsset.tsx
│   │   │       └── AdvertisementAsset.tsx
│   │   │
│   │   ├── ui/                   # 基礎 UI 元件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   └── collapsible.tsx
│   │   │
│   │   ├── Header.tsx            # 頁面 Header
│   │   ├── ErrorBoundary.tsx     # 全域錯誤邊界
│   │   └── ScrollToTop.tsx       # 返回頂部按鈕
│   │
│   ├── contexts/                 # React Context
│   │   ├── AuthContext.tsx       # 認證狀態
│   │   └── SidebarContext.tsx    # 側邊欄狀態
│   │
│   ├── hooks/                    # Custom Hooks
│   │   └── papers/               # 試卷相關 hooks (空目錄，保留供未來使用)
│   │
│   ├── stores/                   # Zustand Stores
│   │   └── usePaperStore.ts      # 試卷狀態 store
│   │
│   ├── lib/                      # 工具函式庫
│   │   ├── api/                  # API 服務層
│   │   │   ├── auth.ts           # 認證 API
│   │   │   ├── paper.ts          # 試卷 API
│   │   │   ├── analytics.ts      # 分析 API
│   │   │   └── rangePack.ts      # 範圍包 API
│   │   │
│   │   ├── api.ts                # Axios Client
│   │   ├── storage.ts            # localStorage 封裝
│   │   ├── providers.tsx         # React Query Provider
│   │   └── utils.ts              # 通用工具
│   │
│   ├── types/                    # TypeScript 型別
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── analytics.ts          # 分析相關型別
│   │   └── paper.ts              # 試卷型別 (V3 Schema)
│   │
│   └── stories/                  # Storybook Stories
│       ├── Introduction.mdx
│       ├── CardViewContainer.stories.tsx
│       ├── ClozeExercise.stories.tsx
│       ├── ExerciseTypeRadarChart.stories.tsx
│       ├── NavigationPanel.stories.tsx
│       ├── ScoreCard.stories.tsx
│       └── ViewModeToggle.stories.tsx
│
├── .storybook/                   # Storybook 配置
│   ├── main.ts
│   └── preview.ts
│
├── vitest.config.ts              # Vitest 配置
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── eslint.config.mjs             # ESLint 配置
└── package.json
```

---

## 核心模組

### 1. 認證模組 (Authentication)

**位置**: `src/contexts/AuthContext.tsx`, `src/lib/api/auth.ts`

**職責**:
- 使用者登入/登出
- JWT Token 管理 (Access + Refresh)
- Google OAuth 整合
- 認證狀態持久化

**關鍵功能**:
```typescript
// AuthContext 提供全域認證狀態
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: SignupData) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Token 刷新機制**:
- Access Token 過期時自動呼叫 Refresh Token API
- 使用 Axios interceptors 攔截 401 錯誤
- 失敗時自動登出並導向登入頁

### 2. 試卷模組 (Paper)

**位置**: `src/stores/usePaperStore.ts`, `src/components/papers/`

**職責**:
- 試卷資料管理
- 答題狀態追蹤
- 題目渲染
- 答案提交

**狀態管理**:
```typescript
interface PaperState {
  userPaper: UserPaper | null;
  currentExerciseIndex: number;
  answers: Record<string, AnswerData>;
  mode: 'practice' | 'review';

  // Actions
  setUserPaper: (paper: UserPaper) => void;
  updateAnswer: (exerciseId: number, answer: any) => void;
  submitAnswer: (exerciseId: number) => Promise<void>;
  completePaper: () => Promise<void>;
}
```

**元件架構**:
- **Exercise Components**: 各種題型的渲染元件
  - `ClozeExercise`: 克漏字題
  - `MCQExercise`: 選擇題
  - `ItemSetExercise`: 題組

- **Asset Components**: 資訊呈現元件
  - `MenuAsset`: 菜單
  - `NoticeAsset`: 公告
  - `DialogueAsset`: 對話
  - `TimetableAsset`: 時間表
  - `AdvertisementAsset`: 廣告

### 3. 分析模組 (Analytics)

**位置**: `src/app/analytics/`, `src/lib/api/analytics.ts`

**職責**:
- 學習數據統計
- 成績分析
- 圖表視覺化

**關鍵指標**:
- 總題數 / 正確率
- 各題型表現
- 技能點分析
- 歷史趨勢

---

## 資料流

### 1. 使用者登入流程

```
User Input
    │
    ▼
LoginForm Component
    │
    ▼
AuthContext.login()
    │
    ▼
authService.login()  (lib/api/auth.ts)
    │
    ▼
apiClient.post('/auth/login')  (lib/api.ts)
    │
    ▼
Backend API
    │
    ▼
Response (Access Token + Refresh Token)
    │
    ▼
tokenStorage.setTokens()  (lib/storage.ts)
    │
    ▼
AuthContext.setUser()
    │
    ▼
Redirect to Dashboard
```

### 2. 試卷練習流程

```
User starts paper
    │
    ▼
paper-configuration/page.tsx
    │
    ▼
paperService.startUserPaper()
    │
    ▼
API creates user_paper
    │
    ▼
Redirect to papers/[paper_id]
    │
    ▼
usePaperStore.setUserPaper()
    │
    ▼
Render Exercise Components
    │
    ▼
User answers → updateAnswer()
    │
    ▼
Submit → submitAnswer()
    │
    ▼
API checks answer
    │
    ▼
Update store with result
    │
    ▼
Move to next exercise or complete
```

### 3. API 請求流程

```
Component/Hook
    │
    ▼
Service Layer (lib/api/*)
    │
    ▼
apiClient (Axios instance)
    │
    ├─ Request Interceptor
    │  ├─ Add Authorization header
    │  └─ Add timestamp
    │
    ▼
Backend API
    │
    ▼
Response
    │
    ├─ Response Interceptor
    │  ├─ Check 401 (Unauthorized)
    │  ├─ Try refresh token
    │  └─ Retry original request
    │
    ▼
Handle in Component
```

---

## 狀態管理

### 1. Zustand (全域狀態)

**使用時機**: 跨多個頁面的複雜狀態

**範例**: `usePaperStore`
```typescript
const usePaperStore = create<PaperState>((set, get) => ({
  userPaper: null,
  answers: {},

  setUserPaper: (paper) => set({ userPaper: paper }),
  updateAnswer: (exerciseId, answer) =>
    set(state => ({
      answers: { ...state.answers, [exerciseId]: answer }
    })),
}));
```

**優勢**:
- 輕量級 (不到 1KB)
- 不需要 Provider
- DevTools 支援
- TypeScript 友善

### 2. React Context (跨元件狀態)

**使用時機**: 不常變動的全域狀態

**範例**:
- `AuthContext`: 認證狀態
- `SidebarContext`: 側邊欄開關狀態

**優勢**:
- React 原生支援
- 適合樹狀結構傳遞
- 不需額外依賴

### 3. React Query (伺服器狀態)

**使用時機**: 所有 API 資料請求

**功能**:
- 自動快取
- 背景重新驗證
- 樂觀更新
- Pagination/Infinite Query

**範例**:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user-paper', paperId],
  queryFn: () => paperService.getUserPaper(paperId),
  staleTime: 5 * 60 * 1000, // 5 分鐘
});
```

---

## API 層架構

### 統一 API Client (`lib/api.ts`)

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor: 自動加入 Token
apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor: 自動刷新 Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request
        return apiClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

### Service 層模式

每個業務模組有獨立的 Service 檔案:

```typescript
// lib/api/paper.ts
export const paperService = {
  async getUserPaper(paperId: number): Promise<UserPaper> {
    const response = await apiClient.get(`/user-papers/${paperId}`);
    return response.data;
  },

  async submitAnswer(paperId: number, data: AnswerData) {
    const response = await apiClient.post(
      `/user-papers/${paperId}/answer`,
      data
    );
    return response.data;
  },
};
```

**優勢**:
- 集中管理 API 端點
- 統一錯誤處理
- 容易測試 (可 mock)
- 型別安全

---

## 元件設計

### 設計原則

1. **單一職責**: 每個元件只做一件事
2. **可重用性**: 元件應該可在不同場景使用
3. **可測試性**: 邏輯與 UI 分離,方便測試
4. **型別安全**: 完整的 Props 型別定義

### 元件分類

#### 1. UI Components (`components/ui/`)

**特性**:
- 無業務邏輯
- 高度可重用
- 完整的 Storybook stories

**範例**: `Button`, `Card`, `Select`

#### 2. Feature Components (`components/papers/`, `components/auth/`)

**特性**:
- 包含業務邏輯
- 使用 Hooks 獲取資料
- 可能連接 Store

**範例**: `ClozeExercise`, `LoginForm`

#### 3. Layout Components (`components/layout/`)

**特性**:
- 頁面結構元件
- 通常包含其他元件
- 管理 Layout 狀態

**範例**: `Sidebar`, `Header`, `SidebarLayout`

### 效能優化

#### React.memo

用於防止不必要的重渲染:

```typescript
export const MCQExercise = memo(({ exercise, onAnswer }: Props) => {
  // Component logic
});
```

**已優化元件** (8 個):
- ClozeExercise
- MCQExercise
- ItemSetExercise
- MenuAsset
- NoticeAsset
- DialogueAsset
- TimetableAsset
- AdvertisementAsset

#### useMemo

用於快取計算結果:

```typescript
const sortedItems = useMemo(
  () => items.sort((a, b) => a.order - b.order),
  [items]
);
```

#### useCallback

用於快取事件處理器:

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

---

## 型別系統

### 型別定義結構

```
types/
├── api.ts          # API 通用型別
├── auth.ts         # 認證相關型別
├── exercise.ts     # 題目型別
├── paper.ts        # 試卷型別
└── range-pack.ts   # 範圍包型別
```

### 關鍵型別範例

#### Exercise Types

```typescript
export interface Exercise {
  id: number;
  type: 'cloze' | 'mcq' | 'item_set';
  question: string;
  options?: Option[];
  items?: ExerciseItem[];
  information_asset?: InformationAsset;
}

export interface ExerciseItem {
  id: number;
  question: string;
  options?: Option[];
  correct_answer: string;
}
```

#### Paper Types

```typescript
export interface UserPaper {
  id: number;
  paper_id: number;
  user_id: number;
  state: 'in_progress' | 'completed' | 'abandoned';
  exercises: Exercise[];
  score?: number;
  total_questions: number;
  started_at: string;
  completed_at?: string;
}
```

### 型別安全原則

1. ❌ **禁止使用 `any`** (當前: 0 處)
2. ✅ **使用明確型別或 `unknown`**
3. ✅ **API 回應必須有型別定義**
4. ✅ **使用 Type Guards 處理 unknown**

---

## 測試策略

### 測試金字塔

```
      ╱────────────╲
     ╱  E2E Tests   ╲  (未來實作)
    ╱────────────────╲
   ╱ Integration Tests╲
  ╱──────────────────────╲
 ╱    Unit Tests         ╲
╱────────────────────────────╲
```

### 當前覆蓋率: **26.55%**

⚠️ **重要**: 測試覆蓋率從 47.95% 下降到 26.55%，主要原因是新增了 Exercise Session 功能但尚未完成測試。優先改進項目已列在本文檔底部。

#### 100% 覆蓋模組
- ✅ AuthContext
- ✅ SidebarContext
- ✅ useApi hooks
- ✅ API 服務層 (auth, paper, analytics, rangePack)
- ✅ ProtectedRoute
- ✅ Header
- ✅ Sidebar
- ✅ SidebarLayout

#### 高覆蓋率模組
- ✅ Papers Exercises: 95.45%
- ✅ Papers Assets: 92.96%
- ✅ UI Components: 96.47%

### 測試工具

- **Vitest**: 測試執行器
- **Testing Library**: React 測試工具
- **jsdom**: DOM 模擬環境

### 測試範例

```typescript
// Component Test
describe('MCQExercise', () => {
  it('should render options', () => {
    render(<MCQExercise exercise={mockExercise} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });
});

// Hook Test
describe('useApi', () => {
  it('should fetch data', async () => {
    const { result } = renderHook(() => useApi());
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});

// Service Test
describe('paperService', () => {
  it('should submit answer', async () => {
    const result = await paperService.submitAnswer(1, mockData);
    expect(result.is_correct).toBe(true);
  });
});
```

---

## 效能優化

### 已實施優化

#### 1. Code Splitting (程式碼分割)

**Analytics Page**: 使用 Dynamic Imports

```typescript
const RadarChart = dynamic(
  () => import('recharts').then(mod => mod.RadarChart),
  { ssr: false }
);
```

**成果**: 91.5 kB → 2.86 kB (-97%)

#### 2. React.memo (8 個元件)

避免不必要的重渲染,特別是列表渲染場景。

#### 3. useMemo (4 處)

快取昂貴的計算結果:
- ClozeExercise: sortedItems, parts
- MCQExercise: displayQuestion
- ItemSetExercise: informationAsset
- Analytics: radarData

#### 4. useCallback (1 處)

快取事件處理器,避免子元件重渲染。

### Bundle Size

| Route | Size | Notes |
|-------|------|-------|
| `/` | ~120 kB | 首頁 |
| `/dashboard` | ~130 kB | 儀表板 |
| `/papers/[id]` | ~150 kB | 試卷頁面 |
| `/analytics` | **2.86 kB** | 分析頁面 (已優化) |

---

## 安全性

### 1. 認證安全

- ✅ JWT Token 儲存在 localStorage (未來可考慮 httpOnly cookie)
- ✅ Access Token 短期 (15 分鐘)
- ✅ Refresh Token 長期 (7 天)
- ✅ Token 自動刷新機制
- ✅ 過期自動登出

### 2. XSS 防護

- ✅ React 預設防 XSS (escaped)
- ✅ 使用 `dangerouslySetInnerHTML` 時小心處理
- ✅ 使用者輸入經過驗證 (Zod schema)

### 3. CSRF 防護

- ✅ 使用 JWT 而非 Cookie-based session
- ✅ SameSite Cookie 設定 (後端)

### 4. 資料驗證

- ✅ 前端驗證: React Hook Form + Zod
- ✅ 後端驗證: FastAPI Pydantic models

### 5. 環境變數

- ✅ 敏感資訊存放在 `.env.local`
- ✅ 不將 `.env.local` 提交到 Git
- ❌ API_URL 使用 HTTPS (生產環境)

---

## 設計決策

### 1. 為什麼選擇 Next.js App Router?

**理由**:
- ✅ 支援 Server Components (減少 Client Bundle)
- ✅ 內建 Route Handler (API Routes)
- ✅ 更好的 SEO 支援
- ✅ 自動 Code Splitting
- ✅ React 19 完整支援

### 2. 為什麼選擇 Zustand 而非 Redux?

**理由**:
- ✅ 輕量級 (1KB vs 15KB)
- ✅ 更簡單的 API
- ✅ 不需要 Provider
- ✅ TypeScript 友善
- ✅ DevTools 支援

**對比**:
```typescript
// Zustand (簡潔)
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}));

// Redux (繁瑣)
// 需要 actions, reducers, store, provider...
```

### 3. 為什麼選擇 Vitest 而非 Jest?

**理由**:
- ✅ 更快 (基於 Vite)
- ✅ 原生 ESM 支援
- ✅ 與 Vite 生態系統整合
- ✅ 相容 Jest API
- ✅ 更好的 TypeScript 支援

### 4. 為什麼統一使用 API Service 層?

**理由**:
- ✅ 集中管理 API 端點
- ✅ 統一錯誤處理
- ✅ 容易測試 (可 mock)
- ✅ 型別安全
- ✅ Token 自動管理

**改進前**:
```typescript
// ❌ 直接在元件中使用 fetch
const response = await fetch('/api/papers/1', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**改進後**:
```typescript
// ✅ 使用 Service 層
const paper = await paperService.getUserPaper(1);
```

### 5. 為什麼封裝 localStorage?

**理由**:
- ✅ SSR 安全 (Next.js)
- ✅ 統一錯誤處理
- ✅ 型別安全
- ✅ 容易切換儲存方式
- ✅ 容易測試

---

## 改進計劃

### 測試覆蓋率提升（優先）

**目標**: 從 26.55% 提升至 60%+

**優先補充測試的模組**:
1. `hooks/exerciseSession/` (目前 10.97%)
2. `stores/` (目前 29.49%)
3. `lib/api.ts` (目前 22.77%)
4. 新增的 Exercise Session 相關功能

**短期目標 (2-4 週)**:
- [ ] Exercise Session 功能測試達 60%+
- [ ] 整體覆蓋率提升至 40%

**中期目標 (2-3 個月)**:
- [ ] 整體覆蓋率達 60%+
- [ ] E2E 測試 (Playwright)

### 功能開發

**短期 (1-2 個月)**:
- [ ] Web Vitals 監控
- [ ] 錯誤追蹤 (Sentry)
- [ ] i18n 國際化

**中期 (3-6 個月)**:
- [ ] WebSocket 即時功能
- [ ] 離線支援
- [ ] PWA 支援

**長期 (6-12 個月)**:
- [ ] 元件設計系統
- [ ] Mobile App (React Native)

---

## 維護者

**TL Team**

有任何架構問題或建議,歡迎開 Issue 討論!

---

**最後更新**: 2025-11-06
**文檔版本**: 1.1
