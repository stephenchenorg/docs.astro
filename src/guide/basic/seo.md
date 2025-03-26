# SEO Metadata

介紹分別如何使用靜態設定，或根據頁面 Model 資料注入 SEO Metadata。在 `<Layout>` 元件中將會插入對應的 Metadata。

## 靜態設定 SEO Metadata

可以為頁面設定 `title`、`description`、`image` 等 Metadata，`seoMeta()` 函式將會建立包含 Open Graph 的標籤設定：

```astro {3,10-14}
---
import Layout from '@/layouts/Layout.astro'
import { seoMeta } from '@stephenchenorg/astro/page'
import { createCompanySetting } from '@stephenchenorg/astro/company-setting'

const companySetting = createCompanySetting({
  // ...
})

const meta = seoMeta({
  title: 'Astro',
  description: 'Astro is a new kind of static site builder that delivers lightning-fast performance.',
  image: 'https://astro.build/og/astro.jpg',
})
---

<Layout meta={meta} companySetting={companySetting}>
  <h1>Astro</h1>
</Layout>
```

## 從頁面 Model 資料注入 SEO Metadata

假設當前頁面是一個文章頁面，可以透過 GraphQL 取得文章的 Metadata，並注入到 `<Layout>` 元件中。

在這個範例的文章對應的 Model 是 `post` 欄位，既有 `title`、`description`、`image` 等預設的文章資料，也會有 `seo_description`、`og_image` 等 SEO Metadata 資料。

可以透過 `${seoMetaFields('Post')}` 來產生 `post` 對應的 Fragment，然後就可以用 `...PostSeoMetaFields` 來帶入文章的 SEO Metadata 欄位，型別的部分需要增加 `PageMeta` 介面。

::: details seoMetaFields Fragment 定義
seoMetaFields Fragment 定義在 `@stephenchenorg/astro` 套件的 `src/page/seo-meta/fragments.ts`：

```ts
import { gql } from 'graphql-tag'

export const seoMetaFields = (dummyClass: string) => gql(`
  fragment DummyClassSeoMetaFields on DummyClass {
    seo_title
    seo_description
    seo_keyword
    seo_json_ld
    seo_head
    seo_body
    og_title
    og_description
    og_image
  }
`.replace(/DummyClass/g, dummyClass))
```
:::

但後台不見得會設定 SEO Metadata 資料，因此我們需要使用 `seoMeta()` 函式來建立 Metadata：

* 第一個參數是靜態設定的 Metadata，可以設定 `title`、`description`、`image` 等 `post` 的資料。
* 第二個參數是 `post` 的 SEO Metadata 欄位，如果後台有設定的話，就會優先使用後台的資料。

下面是完整的範例：

```astro {6-7,12,27,34,38-42,45}
---
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { imageFields } from '@stephenchenorg/astro/image'
import type { ImageSource } from '@stephenchenorg/astro/image'
import { seoMeta } from '@stephenchenorg/astro/page'
import type { PageMeta } from '@stephenchenorg/astro/page'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

interface Data extends DataCompanySetting {
  post: PageMeta & {
    title: string
    description: string
    image: ImageSource
  }
}

const data = await graphQLAPI<Data>(gql`
  query {
    post {
      title
      description
      image {
        ...ImageFields
      }
      ...PostSeoMetaFields
    }
    companySetting {
      ...CompanySettingFields
    }
  }
  ${imageFields}
  ${seoMetaFields('Post')}
  ${companySettingFields}
`)

const meta = seoMeta({
  title: data.post.title,
  description: data.post.description,
  image: data.post.cover.desktop,
}, data.post)
---

<Layout meta={meta} companySetting={data.companySetting}>
  <h1>Astro</h1>
</Layout>
```
