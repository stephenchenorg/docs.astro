import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Stephenchenorg Astro',
  description: '前端開發指南',
  srcDir: 'src',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '指南', link: '/guide/page' },
      { text: '模組', link: '/modules/image' },
    ],

    sidebar: [
      {
        text: '簡介',
        items: [
          { text: '快速開始', link: '/guide/getting-started' },
          { text: '部署', link: '/guide/deploy' },
        ],
      },
      {
        text: '指南',
        items: [
          { text: '頁面', link: '/guide/page' },
          { text: 'GraphQL API', link: '/guide/graphql-api' },
          { text: '連結', link: '/guide/link' },
          { text: 'CSS & JS', link: '/guide/css-js' },
          { text: '圖片', link: '/guide/image' },
          { text: '分頁列表', link: '/guide/list-page' },
          { text: '內頁', link: '/guide/inner-page' },
          { text: '多語系', link: '/guide/i18n' },
          { text: '過濾器', link: '/guide/filter' },
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
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/stephenchenorg/package.astro' },
    ],
  },
})
