# Layout

Layout 是 Astro 元件，定義了每個頁面中的共用結構，包含完整的 HTML 結構、CSS 樣式、JavaScript 程式碼等。

## Layout 參數

在前面的範例中都會看到使用了 `<Layout>` 這個元件：

```astro
---
import Layout from '@/layouts/Layout.astro'
---

<Layout meta={meta} companySetting={companySetting}>
  <h1>Astro</h1>
</Layout>
```

`<Layout>` 元件位於 `src/layouts/Layout.astro` 檔案中，並且接收了兩個必填的參數：

* `meta`：當前頁面的 SEO 資訊，包含 `title`、`description`、Open Graph 標籤 (`og:image`...)、X (Twitter) Cards 等
* `companySetting`：公司資訊，後台系統中設定的公司名稱、描述、Logo 圖片、地址、電話、Email、社群網站連結等

這兩個資訊原本設想都是可以透過 API 來取得資料，但不一定每個頁面都會能從 API 取得這些資料，因此也有不需串接 API，直接定義靜態資料的方法。

## 串接 API

`meta` 串接 API 的方式可以參考 [SEO Metadata](../graphql/seo.md) 和 [客製頁面](../graphql/custom-page.md) 的說明。

`companySetting` 串接 API 的方式在 [GraphQL 基本](../graphql/basic.md) 中有說明。

## 靜態資料

靜態資料的定義方式，可以透過 `createCompanySetting()` 和 `seoMeta()` 這兩個函式來建立，只要是還沒有需要串接 API 的時候都可以使用：

```astro
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

## 插入 Head 內容

`<Layout>` 元件中有一個 `head` 的 `slot`，可以將頁面自定標籤內容插入到 `<head>` 中：

```astro
<Layout>
  <Fragment slot="head">
    <script is:inline src="/js/swiper.min.js"></script>
  </Fragment>

  <!-- ... -->
</Layout>
```

## 自訂 Layout

`<Layout>` 元件是可以自訂的，可以根據專案的需求來調整。比如現在部分頁面會有頂部大圖出現，會需要讓導覽列的文字變白色，就可以在 `src/layouts/Layout.astro` 新增 `topImage` 參數來控制開關：

```ts {7,13}
interface Props {
  // metadata
  meta: PageMeta
  companySetting: CompanySetting

  // layout props
  topImage?: boolean
}

const {
  meta,
  companySetting,
  topImage = false,
} = Astro.props
```

然後就可以在頁面中傳入 `topImage` 參數了：

```astro
<Layout topImage ...>
  <h1>Astro</h1>
</Layout>
```
