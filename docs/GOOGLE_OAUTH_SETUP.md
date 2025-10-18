# Google OAuth 設定指南

本指南說明如何設定 Google OAuth 以啟用 Google 登入功能。

## 步驟 1: 前往 Google Cloud Console

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇或建立專案

## 步驟 2: 啟用 Google+ API

1. 在左側選單中選擇「API 和服務」>「程式庫」
2. 搜尋「Google+ API」
3. 點擊啟用

## 步驟 3: 建立 OAuth 2.0 憑證

1. 在左側選單中選擇「API 和服務」>「憑證」
2. 點擊「建立憑證」>「OAuth 用戶端 ID」
3. 如果是第一次建立，需要先設定「OAuth 同意畫面」：
   - 選擇「外部」（如果是測試環境）
   - 填寫應用程式名稱：「Test Learn」
   - 填寫支援電子郵件
   - 填寫開發人員聯絡資訊
   - 點擊「儲存並繼續」
   - 在「範圍」頁面，點擊「儲存並繼續」
   - 在「測試使用者」頁面（如果需要），新增測試使用者的 email
   - 點擊「儲存並繼續」

4. 返回「憑證」頁面，再次點擊「建立憑證」>「OAuth 用戶端 ID」
5. 選擇應用程式類型：「網頁應用程式」
6. 名稱：「Test Learn Web」
7. 已授權的 JavaScript 來源：
   - 開發環境：`http://localhost:3000`
   - 正式環境：`https://your-domain.com`
8. 已授權的重新導向 URI：
   - 開發環境：`http://localhost:3000`
   - 正式環境：`https://your-domain.com`
9. 點擊「建立」

## 步驟 4: 複製 Client ID

1. 建立完成後，會顯示「OAuth 用戶端已建立」對話框
2. 複製「用戶端 ID」（Client ID）
3. 將此 ID 貼到 `.env.local` 檔案中：

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

## 步驟 5: 後端設定

在 `tl-public-api` 的 `.env` 檔案中，也需要設定 Google Client ID（用於驗證前端傳來的 token）：

```bash
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

## 測試

1. 啟動後端 API：
```bash
cd /Users/ianchen/Codes/tl/tl-public-api
PYTHONPATH=/Users/ianchen/Codes/tl/tl-core python3.10 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. 啟動前端：
```bash
cd /Users/ianchen/Codes/tl/tl-web
npm run dev
```

3. 前往 http://localhost:3000/login
4. 點擊「使用 Google 登入」按鈕
5. 選擇 Google 帳號並授權

## 注意事項

- 在正式環境部署前，需要在 Google Cloud Console 中將應用程式的發布狀態從「測試」改為「正式」
- 記得在 `.gitignore` 中排除 `.env.local` 檔案，避免洩漏 Client ID
- 如果要支援多個網域，需要在「已授權的 JavaScript 來源」中新增所有網域
