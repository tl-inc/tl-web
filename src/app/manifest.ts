import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Test Learn - AI 驅動的自適應學習平台',
    short_name: 'Test Learn',
    description: '智慧出題、動態難度、個人化學習路徑，讓學習更有效率',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    categories: ['education', 'productivity'],
    lang: 'zh-TW',
    dir: 'ltr',
    orientation: 'portrait',
  }
}
