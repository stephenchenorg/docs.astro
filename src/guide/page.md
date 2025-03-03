# 頁面

Astro 的頁面是以 `.astro` 為副檔名的檔案，檔名對應到網址路徑。上方 `---` 之間的區塊是頁面的後端 Node.js 程式碼，下方是前端 JSX 程式碼。

## 無 API 的頁面

*TODO*

```astro
---
import Layout from '@/layouts/Layout.astro'
// import { gql, graphQLAPI } from '@/api'
import { seoMeta } from '@stephenchenorg/astro/page'
// import { companySettingFields } from '@stephenchenorg/astro/company-setting'
// import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

// interface Data extends DataCompanySetting {
//   //
// }

// const data = await graphQLAPI<Data>(gql`
//   query {
//     companySetting {
//       ...CompanySettingFields
//     }
//   }
//   ${companySettingFields}
// `)

const companySetting = {
  lang: 'zh_TW',
  name: 'Astro',
  description: '',
  logo: '',
  address_1: '',
  address_2: '',
  email_1: '',
  email_2: '',
  fb_link: '',
  ig_link: '',
  line_link: '',
  phone_1: '',
  phone_2: '',
  twitter_link: '',
  threads_link: '',
}

const meta = seoMeta({
  title: 'Astro',
})
---

<Layout meta={meta} companySetting={companySetting}>
  <h1>Astro</h1>
</Layout>
```

## 串接 API 的頁面

如果可以串接 API 了，就對頁面進行以下修改：

* 取消上方的註解
* 刪除 `const meta = seoMeta({` 這行
* Layout 的參數改成 `<Layout meta={data.page} companySetting={data.companySetting}>`

```astro
---
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { seoMeta } from '@stephenchenorg/astro/page'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

interface Data extends DataCompanySetting {
  //
}

const data = await graphQLAPI<Data>(gql`
  query {
    companySetting {
      ...CompanySettingFields
    }
  }
  ${companySettingFields}
`)
---

<Layout meta={data.page} companySetting={data.companySetting}>
  <h1>Astro</h1>
</Layout>
```
