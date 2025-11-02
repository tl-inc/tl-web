'use client';

/**
 * 診斷用測試頁面：測試移動端滾動
 *
 * 訪問 /papers/scroll-test 來測試滾動是否正常工作
 */
export default function ScrollTestPage() {
  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      {/* 固定 Header */}
      <div className="flex-shrink-0 bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">滾動測試頁面</h1>
        <p className="text-sm">這個 header 應該是固定的</p>
      </div>

      {/* 可滾動內容區 */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 space-y-4">
          <p className="text-gray-700">如果你看到這個頁面並且可以滾動，表示基本的滾動結構是正常的。</p>

          {/* 產生大量內容來測試滾動 */}
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded">
              <h2 className="font-bold">測試區塊 {i + 1}</h2>
              <p className="text-sm text-gray-600">這是測試內容...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
