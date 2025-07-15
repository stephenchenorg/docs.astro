# 客製頁面

通常大部分頁面都是只會在前端頁面寫好標題等資料，但有時候會有一些頁面需要讓後台能夠修改頁面標題、區塊內容等，這時候就需要客製頁面了。

## 頁面 Metadata

比如現在在後台的客製頁面新增了一個首頁，這時即可在前端的首頁 GraphQL Query 新增一個 `page` 欄位，它有一個 `key` 參數，用來指定頁面的 key，記得新增之前需要先跟後端確認頁面 key，還有記得要引入 `DataPage` 型別。

然後插入 `...PageFields` 就能取得頁面的 SEO Metadata 資料，以及客製欄位資料。不過 `pageFields` 有依賴 `imageFields`，所以這裡也要一併引入。

```astro
---
import type { DataPage } from '@stephenchenorg/astro/page'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { imageFields } from '@stephenchenorg/astro/image'
import { pageFields } from '@stephenchenorg/astro/page'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'

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
  <!-- 在客製頁面中需要使用後端的頁面標題 -->
  <h1>{data.page.title}</h1>
</Layout>
```

## 頁面動態欄位

客製頁面中的關鍵點在於，每個頁面都會有不同數量、不同類型的欄位，無法事先定義好欄位資訊。因此這邊提供了一個動態欄位的方式來解決，只要在後台中新增好欄位，前端就可以動態的取得欄位資料。

而動態欄位對應的 interface 是 `PageField`：

```ts
interface PageField {
  key: string
  type: 'text' | 'textarea' | 'html' | 'image'
  content: string | null
  image: {
    desktop: string | null
    desktop_blur: string | null
    mobile: string | null
    mobile_blur: string | null
  }
}
```

`PageField` 有兩個通用的參數，`key` 是不可重複的欄位名稱，`type` 是欄位的類型，以下是欄位的可用類型：

| 型別 | 欄位名稱 | 說明 |
| --- | --- | --- |
| `text` | 單行文字 | 純文字，不會轉換 HTML 特殊字元 |
| `textarea` | 多行文字 | 只能使用 `<br>` 斷行，其他 HTML 都會轉換，前端會以 HTML 方式處理 |
| `html` | HTML 程式碼 | 由所見及所得編輯器產生 |
| `image` | 圖片 | 包含電腦版/手機版圖片路徑 |

而另外的兩個參數 `content` 和 `image` 是根據欄位類型而有所不同，`content` 是文字類型的欄位內容，`image` 是圖片類型的欄位內容。

了解了動態欄位的定義後，現在就可以渲染客製頁面的欄位了，這邊可以使用 `<PageFieldRender>` 元件，只要傳入 `fields` 和 `key` 就會自動渲染欄位內容，如果是圖片欄位，還可以傳入 `attributes` 來設定圖片的屬性，`attributes` 的屬性會直接套用到 `<img>` 標籤上。

如果是要傳入到 HTML 標籤的屬性中，比如連結網址，也可以使用 `pageTextField` 來取得文字欄位的內容。

```astro
---
import { pageTextField } from '@stephenchenorg/astro/page'
import PageFieldRender from '@stephenchenorg/astro/page/components/PageFieldRender.astro'
---

<Layout meta={data.page} companySetting={data.companySetting}>
  <!-- 區塊標題 -->
  <PageFieldRender fields={data.page.fields} key="section_1_title" />

  <!-- 區塊描述 -->
  <PageFieldRender fields={data.page.fields} key="section_1_description" />

  <!-- 圖片 -->
  <PageFieldRender
    fields={data.page.fields}
    key="section_1_image"
    attributes={{ loading: 'lazy', width: 800, height: 800 }}
  />

  <!-- 連結網址 -->
  <a href={pageTextField(data.page.fields, 'section_1_footer_cta_link')}>
    <PageFieldRender fields={data.page.fields} key="section_1_footer_cta_title" />
  </a>
</Layout>
```
