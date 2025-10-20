import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Test Learn - AI 驅動的自適應學習平台",
    template: "%s | Test Learn"
  },
  description: "Test Learn 是一個 AI 驅動的自適應學習平台，提供智慧出題、動態難度調整、個人化學習路徑。支援英文字彙、文法、閱讀等多種題型，幫助學生有效提升學習成效。",
  keywords: ["學習平台", "自適應學習", "AI教育", "英文學習", "題庫系統", "Test Learn", "智慧出題", "個人化學習"],
  authors: [{ name: "Test Learn Team" }],
  creator: "Test Learn",
  publisher: "Test Learn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "Test Learn",
    title: "Test Learn - AI 驅動的自適應學習平台",
    description: "智慧出題、動態難度、個人化學習路徑，讓學習更有效率",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Test Learn - AI 驅動的自適應學習平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Learn - AI 驅動的自適應學習平台",
    description: "智慧出題、動態難度、個人化學習路徑，讓學習更有效率",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console 驗證碼（之後可以加入）
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16`}
      >
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
