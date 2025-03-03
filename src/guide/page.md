# 頁面

Astro 的頁面是以 `.astro` 為副檔名的檔案，檔名對應到網址路徑。上方 `---` 之間的區塊是頁面的後端 Node.js 程式碼，下方是前端 JSX 程式碼。

## 無 API 的頁面

在建立一個 Stephenchenorg Astro 新專案後，開啟 `src/pages/index.astro` 是一個沒有串接 API 的範例頁面。

註解中的是串接 API 的程式碼，如果沒有串接 API 的話可以刪除。如果沒有串接 API，就可以直接使用 `companySetting` 這個物件，這個物件是用來設定公司資訊的。

::: code-group

```astro [index.astro (清除註解)]
---
import Layout from '@/layouts/Layout.astro'
import { seoMeta } from '@stephenchenorg/astro/page'
import { createCompanySetting } from '@stephenchenorg/astro/company-setting'

const companySetting = createCompanySetting({
  name: 'Astro',
  description: 'Astro is a modern web development platform.',
  logo: 'https//example.com/logo.png',
})

const meta = seoMeta({
  title: 'Astro',
})
---

<Layout meta={meta} companySetting={companySetting}>
  <h1>Astro</h1>
</Layout>
```

```astro [index.astro (原始)]
---
import Layout from '@/layouts/Layout.astro'
// import { gql, graphQLAPI } from '@/api'
import { seoMeta } from '@stephenchenorg/astro/page'
import { createCompanySetting } from '@stephenchenorg/astro/company-setting'
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

const companySetting = createCompanySetting({
  name: 'Astro',
  description: 'Astro is a modern web development platform.',
  logo: 'https//example.com/logo.png',
})

const meta = seoMeta({
  title: 'Astro',
})
---

<Layout meta={meta} companySetting={companySetting}>
  <h1>Astro</h1>
</Layout>
```

:::

## 串接 API 的頁面

如果可以串接 API 了，就對頁面進行以下修改：

* 取消上方的註解
* 刪除 `const meta = seoMeta({` 這行
* Layout 的參數改成 `<Layout meta={data.page} companySetting={data.companySetting}>`

```astro
---
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
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
