# 貢獻指南 🤝

感謝您對 TL-Web 的興趣!這份文檔將幫助您了解如何為專案做出貢獻。

---

## 📋 目錄

- [開始之前](#開始之前)
- [開發環境設定](#開發環境設定)
- [開發流程](#開發流程)
- [編碼規範](#編碼規範)
- [測試規範](#測試規範)
- [提交規範](#提交規範)
- [Pull Request 流程](#pull-request-流程)
- [Code Review 準則](#code-review-準則)
- [常見問題](#常見問題)

---

## 開始之前

### 行為準則

- 🤝 尊重所有貢獻者
- 💬 保持建設性的討論
- 🎯 專注於問題解決
- 📚 樂於分享知識

### 貢獻方式

- 🐛 回報 Bug
- 💡 提出新功能建議
- 📝 改進文檔
- 🔧 修復 Bug
- ✨ 實作新功能
- 🧪 撰寫測試

---

## 開發環境設定

### 必要工具

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **Git**: 2.x 或更高版本

### Fork 和 Clone

```bash
# 1. Fork 專案到您的 GitHub 帳號

# 2. Clone 您的 Fork
git clone https://github.com/YOUR_USERNAME/tl-web.git
cd tl-web

# 3. 新增上游遠端倉庫
git remote add upstream https://github.com/TL_TEAM/tl-web.git

# 4. 安裝依賴
npm install

# 5. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入必要的設定
```

### 啟動開發伺服器

```bash
# 啟動 Next.js 開發伺服器
npm run dev

# 開啟另一個終端,啟動測試 watch 模式
npm test -- --watch

# (可選) 啟動 Storybook
npm run storybook
```

### 驗證環境

```bash
# 執行所有測試
npm test

# 檢查程式碼風格
npm run lint

# 建置專案
npm run build
```

---

## 開發流程

### 1. 選擇或建立 Issue

- 從 [Issues](https://github.com/TL_TEAM/tl-web/issues) 找尋想解決的問題
- 或建立新 Issue 說明您想做的事
- 在 Issue 中留言表示您要處理

### 2. 建立 Feature Branch

```bash
# 從最新的 main 分支建立新分支
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name

# 分支命名規則:
# - feature/xxx    新功能
# - fix/xxx        Bug 修復
# - refactor/xxx   重構
# - docs/xxx       文檔更新
# - test/xxx       測試相關
```

### 3. 開發

遵循我們的[編碼規範](#編碼規範)進行開發。

### 4. 撰寫測試

**所有新功能和 Bug 修復都必須包含測試!**

```bash
# 執行測試
npm test

# 檢查測試覆蓋率
npm run test:coverage
```

### 5. 提交變更

```bash
# Stage 變更
git add .

# 提交 (會自動執行 pre-commit hooks)
git commit -m "feat: add new feature description"

# Pre-commit hooks 會自動執行:
# - ESLint 檢查並修復
# - 相關測試
```

### 6. 推送到您的 Fork

```bash
git push origin feature/your-feature-name
```

### 7. 建立 Pull Request

在 GitHub 上建立 Pull Request,詳見 [PR 流程](#pull-request-流程)。

---

## 編碼規範

### TypeScript 規範

#### 1. 型別安全

```typescript
// ❌ 禁止使用 any
function badFunction(data: any) {
  return data.value;
}

// ✅ 使用明確型別
function goodFunction(data: { value: string }): string {
  return data.value;
}

// ✅ 不確定型別時使用 unknown + type guard
function handleData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

#### 2. Interface vs Type

```typescript
// ✅ 優先使用 interface (可擴展)
interface User {
  id: number;
  name: string;
}

// ✅ 複雜型別使用 type
type Status = 'pending' | 'active' | 'inactive';
type AsyncData<T> = Promise<Result<T, Error>>;
```

#### 3. 型別導入

```typescript
// ✅ 使用 type imports
import type { User } from '@/types/user';
import { fetchUser } from '@/lib/api/user';
```

### React 規範

#### 1. 元件定義

```typescript
// ✅ 使用 function 定義元件
export function MyComponent({ title, onClose }: MyComponentProps) {
  return <div>{title}</div>;
}

// ✅ Props 型別定義
interface MyComponentProps {
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
}
```

#### 2. Hooks 順序

```typescript
export function MyComponent() {
  // 1. State hooks
  const [count, setCount] = useState(0);

  // 2. Context hooks
  const { user } = useAuth();

  // 3. Custom hooks
  const { data } = useApi();

  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 5. Event handlers
  const handleClick = () => {
    setCount(count + 1);
  };

  // 6. Render
  return <div onClick={handleClick}>{count}</div>;
}
```

#### 3. 效能優化

```typescript
// ✅ 使用 memo 避免不必要重渲染
export const ExpensiveComponent = memo(({ data }: Props) => {
  return <div>{/* Complex rendering */}</div>;
});

// ✅ 使用 useMemo 快取計算
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
);

// ✅ 使用 useCallback 快取回調
const handleSubmit = useCallback(
  (values) => {
    onSubmit(values);
  },
  [onSubmit]
);
```

### 檔案組織

#### 元件檔案結構

```
MyComponent/
├── MyComponent.tsx       # 主元件
├── MyComponent.test.tsx  # 測試
├── MyComponent.stories.tsx # Storybook story (如果是 UI 元件)
├── types.ts              # 元件專用型別
└── index.ts              # 匯出
```

#### 命名規範

```typescript
// 元件: PascalCase
export function UserProfile() {}

// Hooks: camelCase with 'use' prefix
export function useUserData() {}

// 常數: UPPER_SNAKE_CASE
export const MAX_RETRIES = 3;

// 型別/介面: PascalCase
export interface UserData {}

// 檔案名稱:
// - 元件: PascalCase (UserProfile.tsx)
// - Hooks: camelCase (useUserData.ts)
// - Utils: camelCase (formatDate.ts)
```

### CSS/Tailwind 規範

```tsx
// ✅ 使用 Tailwind 類別
<div className="flex items-center gap-4 p-4 bg-white rounded-lg">

// ✅ 使用 cn() 合併條件類別
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>

// ❌ 避免內嵌樣式 (除非必要)
<div style={{ color: 'red' }}>
```

### API 呼叫規範

```typescript
// ❌ 不要直接在元件中使用 fetch
async function MyComponent() {
  const response = await fetch('/api/users');
  const data = await response.json();
}

// ✅ 使用 Service 層
import { userService } from '@/lib/api/user';

function MyComponent() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });
}
```

### Storage 規範

```typescript
// ❌ 不要直接使用 localStorage
localStorage.setItem('token', token);

// ✅ 使用封裝的 storage
import { tokenStorage } from '@/lib/storage';
tokenStorage.setAccessToken(token);
```

---

## 測試規範

### 測試原則

1. **測試行為,不測試實作**
2. **每個功能都要有測試**
3. **測試應該獨立且可重複**
4. **測試名稱應該清楚描述測試內容**

### 測試結構

```typescript
describe('ComponentName', () => {
  // 分組相關測試
  describe('rendering', () => {
    it('should render with default props', () => {
      // Test
    });

    it('should render loading state', () => {
      // Test
    });
  });

  describe('interactions', () => {
    it('should call onSubmit when form is submitted', () => {
      // Test
    });
  });

  describe('edge cases', () => {
    it('should handle empty data', () => {
      // Test
    });
  });
});
```

### 單元測試範例

```typescript
// Component Test
import { render, screen } from '@/__tests__/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Service/Hook 測試範例

```typescript
// Service Test
import { paperService } from '@/lib/api/paper';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api');

describe('paperService', () => {
  it('should fetch user paper', async () => {
    const mockPaper = { id: 1, title: 'Test Paper' };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockPaper });

    const result = await paperService.getUserPaper(1);

    expect(apiClient.get).toHaveBeenCalledWith('/user-papers/1');
    expect(result).toEqual(mockPaper);
  });
});

// Hook Test
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from '@/hooks/useUserData';

describe('useUserData', () => {
  it('should fetch user data', async () => {
    const { result } = renderHook(() => useUserData(1));

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### 測試覆蓋率要求

- **新功能**: 至少 80% 覆蓋率
- **Bug 修復**: 必須包含回歸測試
- **重構**: 保持原有覆蓋率

```bash
# 檢查覆蓋率
npm run test:coverage

# 目標:
# - Statements: > 80%
# - Branches: > 75%
# - Functions: > 80%
# - Lines: > 80%
```

---

## 提交規範

### Commit Message 格式

我們使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

- **feat**: 新功能
- **fix**: Bug 修復
- **docs**: 文檔變更
- **style**: 程式碼格式 (不影響功能)
- **refactor**: 重構 (不是新功能也不是修復)
- **perf**: 效能優化
- **test**: 新增或修改測試
- **chore**: 建置或輔助工具變更

### Scope 範圍 (可選)

- `auth`: 認證相關
- `papers`: 試卷相關
- `ui`: UI 元件
- `api`: API 層
- `tests`: 測試

### 範例

```bash
# 新功能
git commit -m "feat(papers): add cloze exercise type support"

# Bug 修復
git commit -m "fix(auth): resolve token refresh race condition"

# 文檔
git commit -m "docs: update API documentation for paper service"

# 重構
git commit -m "refactor(ui): extract Button variants to separate file"

# 測試
git commit -m "test(papers): add tests for MCQExercise component"

# 效能
git commit -m "perf(analytics): optimize chart rendering with useMemo"
```

### Commit Message 詳細說明

```
feat(papers): add support for multi-part cloze exercises

- Add ItemSetExercise component
- Update paper store to handle item sets
- Add comprehensive tests

Closes #123
```

### Breaking Changes

如果有破壞性變更,在 footer 加上 `BREAKING CHANGE:`:

```
feat(api)!: change paper API response format

BREAKING CHANGE: paper.exercises is now paper.exercise_list
Migration guide: Update all paper.exercises to paper.exercise_list
```

---

## Pull Request 流程

### 建立 PR 前檢查清單

- [ ] 程式碼遵循專案規範
- [ ] 新增/更新相關測試
- [ ] 所有測試通過 (`npm test`)
- [ ] ESLint 無錯誤 (`npm run lint`)
- [ ] Build 成功 (`npm run build`)
- [ ] 已更新相關文檔
- [ ] Commit messages 符合規範

### PR 標題格式

使用與 Commit Message 相同的格式:

```
feat(papers): add support for multi-part exercises
fix(auth): resolve token refresh issue
docs: update contributing guide
```

### PR 描述模板

```markdown
## 變更類型
- [ ] 新功能
- [ ] Bug 修復
- [ ] 重構
- [ ] 文檔更新
- [ ] 測試

## 變更內容
簡述這個 PR 做了什麼

## 相關 Issue
Closes #123

## 測試
- [ ] 已新增單元測試
- [ ] 已新增整合測試
- [ ] 已手動測試

## 截圖 (如適用)
放置相關截圖

## 檢查清單
- [ ] 程式碼遵循專案規範
- [ ] 已更新文檔
- [ ] 已新增測試
- [ ] 所有測試通過
- [ ] ESLint 通過
```

### PR 大小

- **Small** (< 200 行): 理想大小,容易 review
- **Medium** (200-500 行): 可接受,但考慮拆分
- **Large** (> 500 行): 應該拆分成多個 PR

**提示**: 大型功能應該拆分成多個小 PR,每個 PR 獨立且可工作。

---

## Code Review 準則

### 作為 PR 作者

1. **自我檢查**: 在請求 review 前自己先 review 一次
2. **提供上下文**: 在 PR 描述中說明為什麼這樣改
3. **回應評論**: 積極回應 reviewer 的評論
4. **保持 PR 更新**: 及時處理衝突

### 作為 Reviewer

1. **及時 Review**: 盡量在 24 小時內回應
2. **建設性回饋**: 提供具體的改進建議
3. **詢問而非命令**: "可以考慮..." 而非 "必須..."
4. **稱讚好的程式碼**: 不只指出問題,也肯定好的實作

### Review 重點

- ✅ 程式碼邏輯正確性
- ✅ 測試覆蓋率
- ✅ 效能影響
- ✅ 安全性問題
- ✅ 可維護性
- ✅ 文檔完整性

### Review 評論範例

```markdown
# ❌ 不好的評論
這個不對

# ✅ 好的評論
這裡可以考慮使用 `useMemo` 來避免不必要的重新計算。
例如:
\`\`\`typescript
const sortedData = useMemo(() => data.sort(...), [data]);
\`\`\`
這樣可以在 data 沒變化時重用之前的結果。
```

---

## 常見問題

### Q: 我應該從哪裡開始?

**A**: 建議從以下開始:
1. 標記為 `good first issue` 的 Issues
2. 撰寫測試 (提升覆蓋率)
3. 改進文檔
4. 修復小 Bug

### Q: 我的 PR 多久會被 review?

**A**: 通常在 1-3 個工作天內。如果超過 3 天沒回應,可以在 PR 中留言提醒。

### Q: 測試一直失敗怎麼辦?

**A**:
1. 確認本地測試通過: `npm test`
2. 檢查 CI 錯誤訊息
3. 確認環境變數設定正確
4. 如果還是無法解決,在 PR 中說明問題

### Q: 如何更新我的 Fork?

```bash
# 拉取上游更新
git fetch upstream
git checkout main
git merge upstream/main

# 更新您的 feature branch
git checkout feature/your-feature
git rebase main
```

### Q: Commit 寫錯了怎麼辦?

```bash
# 修改最後一次 commit
git commit --amend -m "correct message"

# 如果已經 push,需要 force push (小心使用!)
git push -f origin feature/your-feature
```

### Q: 如何執行單一測試檔案?

```bash
# 執行特定檔案
npm test -- src/components/Button.test.tsx

# 執行特定測試
npm test -- -t "should render button"
```

### Q: Pre-commit hook 一直失敗?

```bash
# 手動執行 lint 修復
npm run lint:fix

# 手動執行測試
npm test

# 如果是 husky 問題
npm run prepare
```

### Q: 我可以跳過 pre-commit hook 嗎?

**A**: 不建議,但緊急情況可以:

```bash
git commit --no-verify -m "emergency fix"
```

**注意**: PR 的 CI 檢查還是會執行,最終還是要修正問題。

---

## 獲得幫助

### 聯繫方式

- **GitHub Issues**: 技術問題和 Bug 回報
- **GitHub Discussions**: 一般討論和問題
- **Email**: team@tl.com (重要事項)

### 有用的資源

- [架構文檔](./ARCHITECTURE.md)
- [API 文檔](./API.md)
- [重構歷程](./TL_WEB_REFACTOR.md)
- [Next.js 文檔](https://nextjs.org/docs)
- [React 文檔](https://react.dev)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)

---

## 感謝

感謝所有為 TL-Web 做出貢獻的開發者!

你的貢獻讓這個專案變得更好 🎉

---

**最後更新**: 2025-10-16
