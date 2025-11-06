# 部署指南

本指南涵蓋 TL-Web 前端的完整部署流程，包括 Vercel 部署和 Google OAuth 設定。

---

## 目錄

- [前置需求](#前置需求)
- [Google OAuth 設定](#google-oauth-設定)
- [Vercel 部署](#vercel-部署)
- [環境變數設定](#環境變數設定)
- [自訂網域設定](#自訂網域設定)
- [驗證部署](#驗證部署)
- [疑難排解](#疑難排解)

---

## 前置需求

- ✅ GitHub repository: `tl-web`
- ✅ Vercel 帳號（使用 GitHub 登入）
- ✅ Google Cloud Console 專案
- ✅ 後端 API 已部署到 Cloud Run

---

## Google OAuth 設定

### 步驟 1: 建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇或建立專案

### 步驟 2: 啟用 Google+ API

1. 在左側選單中選擇「API 和服務」>「程式庫」
2. 搜尋「Google+ API」
3. 點擊啟用

### 步驟 3: 設定 OAuth 同意畫面

首次建立 OAuth 憑證時需要設定：

1. 前往「API 和服務」>「OAuth 同意畫面」
2. 選擇「外部」（如果是測試環境）
3. 填寫應用程式名稱：「Test Learn」
4. 填寫支援電子郵件
5. 填寫開發人員聯絡資訊
6. 點擊「儲存並繼續」
7. 在「範圍」頁面，點擊「儲存並繼續」
8. 在「測試使用者」頁面（如果需要），新增測試使用者的 email
9. 點擊「儲存並繼續」

### 步驟 4: 建立 OAuth 2.0 憑證

1. 前往「API 和服務」>「憑證」
2. 點擊「建立憑證」>「OAuth 用戶端 ID」
3. 選擇應用程式類型：「網頁應用程式」
4. 名稱：「Test Learn Web」
5. 已授權的 JavaScript 來源：
   ```
   http://localhost:3000
   https://your-vercel-app.vercel.app
   https://your-domain.com
   ```
6. 已授權的重新導向 URI：
   ```
   http://localhost:3000
   https://your-vercel-app.vercel.app
   https://your-domain.com
   ```
7. 點擊「建立」

### 步驟 5: 複製 Client ID

建立完成後：
1. 複製「用戶端 ID」（Client ID）
2. 稍後在 Vercel 環境變數中使用

---

## Vercel 部署

### 步驟 1: 匯入專案

1. 前往 https://vercel.com/dashboard
2. 點擊 **Add New...** → **Project**
3. 選擇從 GitHub 匯入
4. 找到並選擇 `tl-web` repository
5. 點擊 **Import**

### 步驟 2: 專案設定

Vercel 會自動偵測 Next.js 專案，使用預設設定：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**不需要修改任何設定**，直接進行下一步。

### 步驟 3: 設定環境變數

在部署前，點擊 **Environment Variables** 區塊，新增以下變數：

| Name | Value | 環境 |
|------|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://your-api-url.run.app/api/v1` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | Production, Preview, Development |

**注意事項：**
- 將 `NEXT_PUBLIC_API_URL` 替換為你的實際 Cloud Run URL
- 將 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 替換為上面取得的 Google OAuth Client ID
- 環境變數必須以 `NEXT_PUBLIC_` 開頭才能在前端使用

### 步驟 4: 開始部署

1. 點擊 **Deploy** 按鈕
2. 等待約 2-3 分鐘完成建置
3. 部署成功後會顯示預覽畫面和 URL

---

## 環境變數設定

### 本地開發環境

建立 `.env.local` 檔案：

```env
# API 端點
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Production 環境

在 Vercel Dashboard → Settings → Environment Variables 設定：

```env
NEXT_PUBLIC_API_URL=https://your-production-api.run.app/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**重要**: 修改環境變數後需要重新部署才會生效。

---

## 自訂網域設定

### 步驟 1: 在 Vercel 新增網域

1. 進入專案設定頁面
2. 點擊 **Domains** 分頁
3. 點擊 **Add**
4. 輸入 `your-domain.com` 和 `www.your-domain.com`
5. Vercel 會提供 DNS 設定指示

### 步驟 2: 設定 DNS（以 GoDaddy 為例）

前往 DNS 管理頁面，新增以下記錄：

#### A Record（apex domain）
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds
```

#### CNAME Record（www subdomain）
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

**等待 DNS 傳播**（通常 5-30 分鐘，最多 48 小時）

### 步驟 3: 驗證網域

1. 回到 Vercel Domains 設定頁面
2. 等待網域旁邊顯示 ✅ **Valid Configuration**
3. Vercel 會自動設定 HTTPS 憑證

### 步驟 4: 更新 Google OAuth 設定

前往 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)，編輯 OAuth Client ID：

#### Authorized JavaScript origins
```
https://your-vercel-app.vercel.app
https://your-domain.com
https://www.your-domain.com
```

#### Authorized redirect URIs
```
https://your-vercel-app.vercel.app/login
https://your-domain.com/login
https://www.your-domain.com/login
```

點擊 **Save**。

---

## 驗證部署

### 測試前端

```bash
# 測試 Production URL
curl https://your-vercel-app.vercel.app

# 測試自訂網域（DNS 設定完成後）
curl https://your-domain.com
```

### 測試功能

1. 打開瀏覽器前往部署的 URL
2. 檢查首頁是否正常顯示（不應該出現「連線失敗」）
3. 測試 Google 登入功能
4. 測試 API 連線（試卷、分析等功能）

### 查看部署記錄

#### 在 Vercel Dashboard
1. 前往 https://vercel.com/dashboard
2. 選擇專案
3. 點擊 **Deployments** 分頁查看所有部署記錄

#### 在 GitHub
每次 commit 會顯示 Vercel 的部署狀態：
- ✓ **Deployed** - 成功部署
- ✗ **Failed** - 部署失敗
- 🔄 **Building** - 建置中

---

## 自動部署

部署完成後，Vercel 會自動設定：

### ✅ 自動觸發條件

- **Push to `main` branch** → 自動部署到 Production
- **Push to other branches** → 自動建立 Preview deployment
- **Pull Request** → 自動建立 Preview deployment 並在 PR 中留言

### ✅ 部署通知

- GitHub commit 會顯示部署狀態
- Pull Request 會自動顯示預覽連結
- Email 通知部署成功或失敗

---

## 後端 CORS 設定

部署完成後，記得更新後端的 CORS 設定以允許新的前端網域。

### 更新 GitHub Secrets

前往後端 repository 的 Settings → Secrets and variables → Actions

更新 `CORS_ORIGINS` 的值為：
```
http://localhost:3000,https://your-vercel-app.vercel.app,https://your-domain.com,https://www.your-domain.com
```

然後觸發重新部署（push 任何變更到 main branch）。

---

## 疑難排解

### 問題 1: Build 失敗

檢查 build logs：
1. 前往 Vercel Dashboard → Deployments
2. 點擊失敗的部署
3. 查看詳細錯誤訊息

常見原因：
- TypeScript 類型錯誤
- ESLint 錯誤
- 缺少環境變數

**解決方式**：
```bash
# 本地測試 build
npm run build

# 修正錯誤後再推送
```

### 問題 2: 「連線失敗」錯誤

可能原因：
- ✗ `NEXT_PUBLIC_API_URL` 設定錯誤
- ✗ 後端 CORS 未允許前端網域
- ✗ 後端 API 服務未運行

解決方式：
1. 檢查環境變數是否正確
2. 更新後端 CORS_ORIGINS
3. 確認後端 API health endpoint 可訪問

### 問題 3: Google 登入失敗

可能原因：
- ✗ Google OAuth 未設定正式網域
- ✗ `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 錯誤

解決方式：
1. 在 Google Cloud Console 新增 Authorized JavaScript origins
2. 確認環境變數設定正確
3. 確認 OAuth 同意畫面設定完整

### 問題 4: DNS 未生效

如果網域無法訪問：
1. 確認 DNS 設定正確
2. 使用 DNS 檢查工具：https://dnschecker.org
3. 等待 DNS 傳播（可能需要 24-48 小時）
4. 清除瀏覽器快取

### 問題 5: 環境變數未生效

解決方式：

**方式 1：透過 Git**
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

**方式 2：透過 Vercel Dashboard**
1. 前往 Deployments
2. 找到最新的部署
3. 點擊 **︙** → **Redeploy**

---

## 回滾部署

如果新版本有問題，可以快速回滾：

1. 前往 Vercel Dashboard → Deployments
2. 找到上一個穩定版本
3. 點擊 **︙** → **Promote to Production**
4. 確認回滾

---

## Preview Deployments

每個 branch 和 PR 都會自動建立預覽環境：

### 預覽 URL 格式
```
https://tl-web-{branch-name}-{team-name}.vercel.app
https://tl-web-git-{branch-name}-{team-name}.vercel.app
https://tl-web-{hash}.vercel.app
```

### 用途
- ✅ 測試新功能而不影響 production
- ✅ 與團隊成員分享預覽
- ✅ 在 PR 中直接查看變更效果

---

## 效能監控

Vercel 提供內建的效能監控：

1. 前往 **Analytics** 分頁
2. 查看：
   - Real Experience Score (RES)
   - Web Vitals (LCP, FID, CLS)
   - 訪客數量和流量

---

## 成本

- **Hobby Plan (免費)**：
  - ✅ 無限部署
  - ✅ 100 GB 頻寬/月
  - ✅ 自訂網域
  - ✅ 自動 HTTPS
  - ✅ Preview deployments

- **Pro Plan ($20/月)**：
  - 更多頻寬
  - 更多團隊成員
  - 進階分析功能

對於初期開發，Hobby Plan 完全足夠。

---

## 下一步

部署完成後：

1. ✅ 測試所有功能（註冊、登入、Google OAuth）
2. ✅ 確認 API 連線正常
3. ✅ 設定自訂網域
4. ✅ 更新 Google OAuth 設定
5. ✅ 通知團隊成員新的 Production URL

---

**最後更新**: 2025-11-06
