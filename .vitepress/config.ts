import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Stephenchenorg Astro',
  description: '前端通用套件',
  srcDir: 'src',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '快速開始', link: '/getting-started' },
      { text: '模組', link: '/modules/image' },
    ],

    sidebar: [
      {
        text: '簡介',
        items: [
          { text: '快速開始', link: '/getting-started' },
        ],
      },
      {
        text: '模組',
        items: [
          { text: '圖片 (image)', link: '/modules/image' },
          { text: '公司設定 (company-setting)', link: '/modules/company-setting' },
          { text: '頁面 (page)', link: '/modules/page' },
          { text: '分頁 (pagination)', link: '/modules/pagination' },
          { text: '網址參數 (query-params)', link: '/modules/query-params' },
        ],
      },
      {
        text: '進階功能教學',
        items: [
          { text: '多語系', link: '/advanced/i18n' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/stephenchenorg/astro' },
    ],
  },
})
