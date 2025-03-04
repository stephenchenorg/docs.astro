# GraphQL

Stephenchenorg 使用 GraphQL 來串接 API，接下來將會介紹具體的使用方式。

## 基本設定

Stephenchenorg 後端預設的 GraphQL 路徑都是使用預設值，因此收到 API 的時候，就可以將對應的 GraphQL 路徑填入 `.env` 的 `API_BASE_URL` 中，以及可以在 GraphQL Playground 中測試 API。

比如後端 API 的網址是 `https://123.example.com`，那麼 GraphQL API 的完整網址就是：

* GraphQL API Endpoint：https://123.example.com/graphql
* GraphQL Playground：https://123.example.com/graphiql

## 發送請求

在 Astro 頁面中呼叫 `graphQLAPI()` 來發送 GraphQL 請求，比如現在頁面需要顯示公司名稱：

```astro
---
import { gql, graphQLAPI } from '@/api'

interface Data {
  companySetting: {
    name: string
  }
}

const data = await graphQLAPI<Data>(gql`
  query {
    companySetting {
      name
    }
  }
`)
---

<h1>公司名稱：{data.companySetting.name}</h1>
```

上面的這段可以分幾個部分來看：

* `Data` 介面是用來定義請求成功回傳物件的型別。
* `graphQLAPI()` 是一個用來發送 GraphQL 請求的異步函式，可以將 `Data` 傳入，這樣在回傳後的 `data` 就會是 `Data` 型別。
* `gql` 是用來建立 GraphQL Query 的 Tagged templates，讓編輯器可以顯示語法突顯。

因此我們就可以知道說，`query` 內是具體的請求內容，在確定頁面需料之後，就可以去 GraphQL Playground 中測試，然後將請求內容複製進來，並更新對應的型別定義在 `Data` 中。

## Fragment 重複利用 Query

基於 GraphQL 要在一次請求就要取得所有資料的限制，因此可以使用 Fragment 來重複利用 Query，比如公司設定再每個頁面都需要取得，因此已經先定義好對應的 Fragment 和型別了。

公司設定的 Fragment 是 `companySettingFields`，型別是 `DataCompanySetting`，因此可以在頁面中這樣使用：

```ts
import { gql, graphQLAPI } from '@/api'

// 1. 引入公司設定的 Fragment 和型別
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

interface Data extends DataCompanySetting {
  //
}

// 2. 定義 Fragment
//    因為同樣都是字串，因此可以使用 Template literals 來將 Fragment
//    插入到 Query 中，${companySettingFields} 會將事先定義好的
//    Fragment 插入到 Query 中，但需要注意，Fragment 必須定義在
//    `query {}` 的**外面**。
//
// 3. 使用 Fragment
//    ${companySettingFields} 中定義的 Fragment 會將 `companySetting`
//    的所有欄位插入到 Query 中，只需使用 `...CompanySettingFields`
//    就可以取得 companySetting 的所有欄位了。
const data = await graphQLAPI<Data>(gql`
  query {
    companySetting {
      ...CompanySettingFields
    }
  }
  ${companySettingFields}
`)
```

這裡需要注意命名規則上有所不同，`${companySettingFields}` 是一個 JavaScript 變數，開頭使用小寫，而 `...CompanySettingFields` 是一個 GraphQL Fragment，開頭使用大寫。

::: details CompanySettingFields Fragment 定義
CompanySettingFields Fragment 是定義在 `@stephenchenorg/astro` 套件的 `src/company-setting/fragments.ts`：

```ts
import { gql } from 'graphql-tag'

export const companySettingFields = gql`
  fragment CompanySettingFields on CompanySetting {
    lang
    name
    description
    logo
    address_1
    address_2
    email_1
    email_2
    fb_link
    ig_link
    line_link
    phone_1
    phone_2
    twitter_link
    threads_link
  }
`
```
:::

## 單頁串接 GraphQL 基本範例

了解完上面的語法後，我們現在就可以看在 Astro 頁面中串接 GraphQL 的基本範例：

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

const meta = seoMeta({
  title: 'Astro',
})
---

<Layout meta={meta} companySetting={data.companySetting}>
  <h1>Astro</h1>
</Layout>
```
