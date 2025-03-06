# 客製頁面

*TODO*

## 頁面 Metadata

*TODO*

```astro
---
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { imageFields } from '@stephenchenorg/astro/image'
import { pageFields } from '@stephenchenorg/astro/page'
import type { DataPage } from '@stephenchenorg/astro/page'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

interface Data extends DataPage, DataCompanySetting {
  //
}

const data = await graphQLAPI<Data>(gql`
  query {
    page(key: "home") {
      ...PageFields
    }
    companySetting {
      ...CompanySettingFields
    }
  }
  ${imageFields}
  ${pageFields}
  ${companySettingFields}
`)
---

<Layout meta={data.page} companySetting={data.companySetting}>
  <h1>Astro</h1>
</Layout>
```

## 頁面動態欄位

*TODO*

| 型別 | 欄位名稱 | 說明 |
| --- | --- | --- |
| `text` | 單行文字 | 純文字，不會轉換 HTML 特殊字元 |
| `textarea` | 多行文字 | 只能使用 `<br>` 斷行，其他 HTML 都會轉換，前端會以 HTML 方式處理 |
| `html` | HTML 程式碼 | 由所見及所得編輯器產生 |
| `image` | 圖片 | 包含電腦版/手機版圖片路徑 |

*TODO*

```astro
---
import { PageFieldRender, pageTextField } from '@stephenchenorg/astro/page'
---

<Layout meta={data.page} companySetting={data.companySetting}>
  <PageFieldRender fields={data.page.fields} key="section_1_title" />

  <PageFieldRender fields={data.page.fields} key="section_1_description" />

  <PageFieldRender
    fields={data.page.fields}
    key="section_1_image"
    attributes={{ loading: 'lazy', width: 800, height: 800 }}
  />

  <a href={pageTextField(data.page.fields, 'section_1_footer_cta_link')}>
    <PageFieldRender fields={data.page.fields} key="section_1_footer_cta_title" />
  </a>
</Layout>
```
