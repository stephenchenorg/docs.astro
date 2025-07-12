import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Stephenchenorg Astro',
  description: '前端開發指南',
  srcDir: 'src',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: '指南',
        link: '/guide/getting-started',
        activeMatch: '/guide/',
      },
      {
        text: '參考',
        link: '/reference/',
        activeMatch: '/reference/',
      },
    ],

    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: '簡介',
            collapsed: false,
            items: [
              { text: '快速開始', link: 'getting-started' },
              { text: '編輯器', link: 'editor' },
              { text: '部署', link: 'deploy' },
            ],
          },
          {
            text: '基本',
            collapsed: false,
            items: [
              { text: '資料夾結構', link: 'basic/structure' },
              { text: '網址', link: 'basic/url' },
              { text: '頁面', link: 'basic/page' },
              { text: 'GraphQL', link: 'basic/graphql' },
              { text: 'Layout', link: 'basic/layout' },
              { text: 'CSS & JS', link: 'basic/css-js' },
              { text: '圖片', link: 'basic/image' },
              { text: 'SEO Metadata', link: 'basic/seo' },
              { text: '下載資產', link: 'basic/download-assets' },
            ],
          },
          {
            text: '進階',
            collapsed: false,
            items: [
              { text: '分頁列表', link: 'advanced/list-page' },
              { text: '內頁', link: 'advanced/inner-page' },
              { text: '客製頁面', link: 'advanced/custom-page' },
              { text: '表單驗證', link: 'advanced/form-validation' },
              { text: '表單請求', link: 'advanced/form-request' },
              { text: 'GraphQL 全局設定', link: 'advanced/graphql-global-options' },
              { text: '過濾器', link: 'advanced/filter' },
              { text: '多語系', link: 'advanced/i18n' },
            ],
          },
        ],
      },
      '/reference/': {
        base: '/reference/',
        items: [
          {
            text: 'GraphQL 查詢',
            items: [
              { text: 'productCategories', link: 'graphql/product-categories' },
              { text: 'productCategory', link: 'graphql/product-category' },
            ],
          },
        ],
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/stephenchenorg/package.astro' },
    ],

    editLink: {
      pattern: 'https://github.com/stephenchenorg/docs.astro/edit/main/src/:path',
      text: '在 GitHub 上編輯此頁',
    },

    lastUpdated: {
      text: '最後更新於',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Lucas Yang',
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
  },
})
