import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Stephenchenorg Astro',
  description: '前端開發指南',
  srcDir: 'src',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '快速開始', link: '/instruction/getting-started' },
      { text: '基本', link: '/basic/structure' },
      { text: '進階', link: '/advanced/dynamic-field' },
    ],

    sidebar: [
      {
        text: '簡介',
        items: [
          { text: '快速開始', link: '/instruction/getting-started' },
          { text: '編輯器', link: '/instruction/editor' },
          { text: '部署', link: '/instruction/deploy' },
        ],
      },
      {
        text: '基本',
        items: [
          { text: '資料夾結構', link: '/basic/structure' },
          { text: '網址', link: '/basic/url' },
          { text: '頁面', link: '/basic/page' },
          { text: 'GraphQL', link: '/basic/graphql' },
          { text: 'Layout', link: '/basic/layout' },
          { text: 'CSS & JS', link: '/basic/css-js' },
          { text: '圖片', link: '/basic/image' },
          { text: 'SEO Metadata', link: '/basic/seo' },
          { text: '下載資產', link: '/basic/download-assets' },
        ],
      },
      {
        text: '進階',
        items: [
          { text: '分頁列表', link: '/advanced/list-page' },
          { text: '內頁', link: '/advanced/inner-page' },
          { text: '客製頁面', link: '/advanced/custom-page' },
          { text: '表單請求', link: '/advanced/form-request' },
          { text: '過濾器', link: '/advanced/filter' },
          { text: '多語系', link: '/advanced/i18n' },
        ],
      },
    ],

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

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
  },
})
