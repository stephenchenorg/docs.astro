# 過濾器

在商品列表之類的列表頁面中，通常會有一些過濾器，例如：價格區間、分類、標籤、搜尋等，因此接下來將介紹如何建立過濾器。

## 設定 UrlConfig

過濾器的核心是將查詢參數儲存在 URL 中，因此首先需要建立 `UrlConfig` 物件，並將其傳入 `<ProvideUrlConfig>` 元件中，`<ProvideUrlConfig>` 元件會將 `UrlConfig` 物件全域儲存在用戶端，

以下開始都是使用位於專案的 `src/pages/products/index.astro` 為例：

```astro
---
import { createUrlConfig, ProvideUrlConfig } from '@stephenchenorg/astro/query-params'

const urlConfig = createUrlConfig({
  baseUrl: Astro.url.pathname,
  params,
  defaultParams,
})
---

<Layout meta={meta} companySetting={companySetting}>
  <Fragment slot="head">
    <ProvideUrlConfig config={urlConfig} />
  </Fragment>

  <!-- ... -->
</Layout>
```

## 解析查詢參數

解析查詢參數的部分，這邊使用 [zod](https://github.com/colinhacks/zod) 來驗證查詢參數，最後解析後的 `params` 物件就會是我們需要的過濾器狀態值。

以下是一個查詢參數範例：

```ts
import { z } from 'zod'
import { parseQueryParams } from '@stephenchenorg/astro/query-params'

const defaultParams = {
  page: 1,
  priceFrom: 0,
  priceTo: 5000,
  sort: 'latest' as 'latest' | 'oldest',
}
const PRICE_MIN = 0
const PRICE_MAX = 5000

const querySchema = z.object({
  page: z.coerce.number().positive().default(1).catch(1),
  type: z.enum(['product', 'service']).nullish().default(null).catch(null),
  search: z.coerce.string().nullish().default(null).catch(null),
  category: z.coerce.number().nullish().default(null).catch(null),
  priceFrom: z.coerce.number().min(PRICE_MIN).max(PRICE_MAX).default(defaultParams.priceFrom).catch(defaultParams.priceFrom),
  priceTo: z.coerce.number().min(PRICE_MIN).max(PRICE_MAX).default(defaultParams.priceTo).catch(defaultParams.priceTo),
  tags: z.preprocess(val => [val || []].flat().map(Number).filter(Boolean), z.array(z.number())).catch([]),
  sort: z.enum(['latest', 'oldest']).default(defaultParams.sort).catch(defaultParams.sort),
})

const params = querySchema.parse(parseQueryParams(Astro.url.search))
```

以下是 zod 常見驗證查詢參數的範例：

```ts
// string 類型
z.coerce.string().nullish().default(null).catch(null)

// enum 類型
// 預設值為 null
z.enum(['product', 'service']).nullish().default(null).catch(null)
// 預設值不為 null
z.enum(['latest', 'oldest']).default('latest').catch('latest')

// number 類型
// 預設值為 null
z.coerce.number().nullish().default(null).catch(null)
// 預設值不為 null
z.coerce.number().default(0).catch(0)
// 限制範圍
z.coerce.number().min(0).max(100).default(1).catch(1)

// page 分頁頁數
z.coerce.number().positive().default(1).catch(1)

// array 類型
// 例如 tags 是 number[] 類型
z.preprocess(val => [val || []].flat().map(Number).filter(Boolean), z.array(z.number())).catch([])
```

這邊列出幾個上面範例中使用到的 zod 方法：

- `coerce`：將值轉換為指定的類型。
- `enum`：限制值必須是列舉中的其中一個。
- `min`：限制值必須大於等於指定的最小值。
- `max`：限制值必須小於等於指定的最大值。
- `positive`：限制值必須大於 0。
- `default`：設定預設值。
- `nullish`：允許值為 null 或 undefined。
- `catch`：當值無法通過驗證時，使用預設值。
- `preprocess`：對值進行預處理。

使用 zod 來驗證查詢參數的關鍵是 `coerce`、`default` 和 `catch` 這三個方法，`coerce` 用來將值轉換為指定的類型，比如解析數字時非常關鍵；而 `default` 和 `catch` 的組合可以無論是沒有輸入、或是錯誤的輸入，都可以套用預設值，不會因為錯誤的輸入而導致程式出錯。

這邊需要注意，GraphQL 空值的部分需要使用 `null`，因此在查詢參數的預設值和驗證時，都需要使用 `null` 來表示空值，而不是空字串、空陣列或 `undefined`。

更多驗證方式和說明請參考 [zod](https://github.com/colinhacks/zod) 說明文件。

## 將查詢參數傳入 API

以下是一個將查詢參數傳入 GraphQL 範例：

```ts
const isDefaultPrice = params.priceFrom === defaultParams.priceFrom && params.priceTo === defaultParams.priceTo

const data = await graphQLAPI<Data>(gql`
  query (
    $page: Int!
    $type: String
    $search: String
    $category: Int
    $priceFrom: Int
    $priceTo: Int
    $tags: [Int!]
    $sortBy: String
    $sortColumn: String
  ) {
    products(
      page: $page
      per_page: 12
      type: $type
      search: $search
      category_id: $category
      price_from: $priceFrom
      price_to: $priceTo
      union_tags: $tags
      sort_by: $sortBy
      sort_column: $sortColumn
    ) {
      total
      per_page
      data {
        id
        title
        image {
          ...ImageFields
        }
        price
      }
    }
    companySetting {
      ...CompanySettingFields
    }
  }
  ${imageFields}
  ${companySettingFields}
`, {
  page: params.page,
  type: params.type,
  search: params.search,
  category: params.category,
  priceFrom: isDefaultPrice ? null : params.priceFrom,
  priceTo: isDefaultPrice ? null : params.priceTo,
  tags: params.tags.length ? params.tags : null,
  sortBy: {
    latest: 'desc',
    oldest: 'asc',
  }[params.sort],
  sortColumn: {
    latest: 'id',
    oldest: 'id',
  }[params.sort],
})
```

首先是 GraphQL 參數型別定義，目前只需使用 `Int` 和 `String` 這兩個型別即可，後面加 `!` 表示必填，比如 `Int!`，而 `[]` 表示 List 型別 (對應 JavaScript 陣列)，比如 `[Int]`，而通常 `[Int]` 型別的查詢參數，會期望裡面全部都是 `Int` 型別，因此可以使用 `[Int!]`。

而對應輸入的 JavaScript 變數也需要注意，如果查詢參數是選填，一定要傳入 `null`，否則會導致 GraphQL 查詢失敗。因此上面範例中會根據 `tags` 陣列的長度來判斷，如果是空陣列就傳入 `null`。

## 連結型過濾器

然後現在到了前端畫面的部分，首先是連結型過濾器，例如分類、標籤等：

```astro
<!-- 分類 -->
<FilterCategory
  value={params.category}
  options={data.categories.data}
  urlConfig={urlConfig}
/>

<!-- 標籤 -->
<FilterTags
  value={params.tags}
  options={data.tags.data}
  urlConfig={urlConfig}
/>
```

連結型過濾器的元件需要有 `value`、`options` 和 `urlConfig` 這兩個參數，`value` 是當前選擇的值，`options` 是選項列表，而 `urlConfig` 是 `UrlConfig` 物件，這樣就可以透過 `queryParamsUrl` 函式來產生新的 URL。

### 分類過濾器範例

::: details `<FilterCategory>` 元件範例程式碼
`<FilterCategory>` 元件位於專案的 `src/components/filters/FilterCategory.astro`：

```astro
---
import { queryParamsUrl } from '@stephenchenorg/astro/query-params'
import type { UrlConfig } from '@stephenchenorg/astro/query-params'

interface Props {
  value: string | null
  options: {
    label: string
    value: string | null
  }[]
  urlConfig: UrlConfig
}

const { value, options, urlConfig } = Astro.props
---

<div>
  <h2>分類</h2>
  <ul>
    {options.map(option => (
      <li>
        <a
          href={queryParamsUrl({ tag: option.value }, urlConfig)}
          class:list={[
            (option.value === value || (!option.value && !value)) && 'active',
          ]}
          rel="nofollow"
        >
          {option.label}
        </a>
      </li>
    ))}
  </ul>
</div>
```
:::

### 樹狀分類過濾器範例

::: details 樹狀分類過濾器相關的型別定義
型別定義位於專案的 `src/types.ts`：

```ts
export interface ProductCategoryTreeItem {
  id: number
  title: string
  children?: ProductCategoryTreeItem[]
}

export interface ProductCategoryTreeItemNullable {
  id: number | null
  title: string
  children?: ProductCategoryTreeItem[]
}
```
:::

::: details `<FilterCategoryTree>` 元件範例程式碼
`<FilterCategoryTree>` 元件位於專案的 `src/components/filters/FilterCategoryTree.astro`：

```astro
---
import FilterCategoryTreeItem from './FilterCategoryTreeItem.astro'
import type { UrlConfig } from '@stephenchenorg/astro/query-params'
import type { ProductCategoryTreeItem } from '@/types'

interface Props {
  value: ProductCategoryTreeItem['id'] | null
  options: ProductCategoryTreeItem
  urlConfig: UrlConfig
}

const { value, options, urlConfig } = Astro.props
---

<div>
  <h2>分類</h2>
  <ul id="category-list" class="category-tree" data-category={value}>
    <FilterCategoryTreeItem
      value={value}
      category={{
        id: null,
        title: '全部',
      }}
      urlConfig={urlConfig}
    />
    {options.children?.map(category => (
      <FilterCategoryTreeItem
        value={value}
        category={category}
        urlConfig={urlConfig}
      />
    ))}
  </ul>
</div>

<script>
const list = document.getElementById('category-list') as HTMLUListElement
const value = list.dataset.categoryValue

Array.from(list.children).forEach(li => {
  visitCategory(li)
})

function visitCategory(li: Element): boolean {
  const a = li.querySelector('a') as HTMLAnchorElement
  const ul = li.querySelector('ul') as HTMLUListElement | null
  let show = false

  if (ul) {
    a.href = '#'
    a.addEventListener('click', function (e) {
      e.preventDefault()
      li.classList.toggle('open')
    })

    Array.from(ul.children).forEach(childLi => {
      if (visitCategory(childLi)) {
        show = true
      }
    })
  }

  const categoryId = a.dataset.categoryId
  if (categoryId === value) {
    show = true
  }

  if (show) {
    li.classList.add('open')
  }

  return show
}
</script>
```
:::

::: details `<FilterCategoryTreeItem>` 元件範例程式碼
`<FilterCategoryTreeItem>` 元件位於專案的 `src/components/filters/FilterCategoryTreeItem.astro`：

```astro
---
import { queryParamsUrl } from '@stephenchenorg/astro/query-params'
import type { UrlConfig } from '@stephenchenorg/astro/query-params'
import type { ProductCategoryTreeItemNullable } from '@/types'

interface Props {
  value: ProductCategoryTreeItemNullable['id']
  category: ProductCategoryTreeItemNullable
  urlConfig: UrlConfig
}

const { value, category, urlConfig } = Astro.props
---

<li class:list={[category.children?.length && 'category-tree-has-children']}>
  <a
    href={queryParamsUrl({ category: category.id }, urlConfig)}
    class:list={[(category.id === value || (!category.id && !value)) && 'active']}
    data-category-id={category.id}
    rel="nofollow"
  >
    {category.title}
  </a>
  {category.children && category.children.length > 0 && (
    <ul>
      {category.children.map(category => (
        <Astro.self
          value={value}
          category={category}
          urlConfig={urlConfig}
        />
      ))}
    </ul>
  )}
</li>
```
:::

### 標籤過濾器範例

::: details `<FilterTag>` 元件範例程式碼
`<FilterTag>` 元件位於專案的 `src/components/filters/FilterTag.astro`：

```astro
---
import { queryParamsUrl } from '@stephenchenorg/astro/query-params'
import type { UrlConfig } from '@stephenchenorg/astro/query-params'

interface Props {
  value: number[]
  options: {
    id: number
    title: string
  }[]
  urlConfig: UrlConfig
}

const { value, options, urlConfig } = Astro.props

const tagLinks = options.map(({ id }) => {
  return queryParamsUrl({ tags: [id] }, urlConfig, {
    transformParams(params) {
      // 如果標籤已經選中，則移除該標籤連結中的標籤值
      if (value.includes(id)) {
        const tagIndex = params.tags.indexOf(id)
        params.tags.splice(tagIndex, 1)
      }

      return params
    },
  })
})
---

<div id="tags-block" class="has-read-more">
  <h2>標籤</h2>
  <ul>
    {options.map((tag, index) => (
      <li>
        <a
          href={tagLinks[index]}
          class:list={[value.includes(tag.id) && 'active']}
          rel="nofollow"
        >
          {tag.title}
        </a>
      </li>
    ))}
  </ul>
  <div class="read-more-gradient"></div>
  <div class="read-more">
    <button class="btn-more">更多標籤</button>
  </div>
</div>

<script>
const btnMore = document.querySelector('#tags-block button.btn-more') as HTMLButtonElement
btnMore.addEventListener('click', function () {
  const tagsBlock = document.querySelector('#tags-block') as HTMLElement
  tagsBlock.classList.remove('has-read-more')
})
</script>
```
:::

## 表單型過濾器

表單型過濾器通常是價格區間、搜尋等，特徵是需要透過送出表單來更新過濾器狀態值，例如搜尋、價格區間等。

```astro
<!-- 搜尋 -->
<FilterSearch value={params.search || ''} />

<!-- 價格區間 -->
<FilterPriceRange
  from={params.priceFrom}
  to={params.priceTo}
  min={PRICE_MIN}
  max={PRICE_MAX}
/>
```

表單型過濾器的元件只需要有 `value` 參數，或著可以定義當前狀態的參數都行，不用傳入 `urlConfig`，因為在前端會自動從 `<ProvideUrlConfig>` 元件中取得 `UrlConfig` 物件。

### 搜尋框範例

::: details `<FilterSearch>` 元件範例程式碼
`<FilterSearch>` 元件位於專案的 `src/components/filters/FilterSearch.astro`：

```astro
---
interface Props {
  value: string
}

const { value } = Astro.props
---

<form id="searchbox">
  <input type="text" name="search" value={value} placeholder="搜尋...">
  <button type="submit">
    <i class="search-icon"></i>
  </button>
</form>

<script>
import { queryParamsUrl } from '@stephenchenorg/astro/query-params'

const searchbox = document.getElementById('searchbox') as HTMLFormElement
searchbox.addEventListener('submit', function (e) {
  e.preventDefault()
  const search = (this.querySelector('input[name="search"]') as HTMLInputElement).value
  location.href = queryParamsUrl({ search })
})
</script>
```
:::

### 價格區間過濾器範例

::: details `<FilterPriceRange>` 元件範例程式碼
`<FilterPriceRange>` 元件位於專案的 `src/components/filters/FilterPriceRange.astro`，這裡使用一個 jQuery 套件 [Ion.RangeSlider](https://github.com/IonDen/ion.rangeSlider) 來示範：

```astro
---
interface Props {
  from: number
  to: number
  min: number
  max: number
}

const { from, to, min, max } = Astro.props
---

<div>
  <h2>價格區間</h2>
  <div id="price-range">
    <input
      type="text"
      class="range-slider"
      value=""
      data-type="double"
      data-min={min}
      data-from={from}
      data-to={to}
      data-max={max}
      data-grid="false"
    />
    <button type="button">
      套用
    </button>
  </div>
</div>

<script>
import { queryParamsUrl } from '@stephenchenorg/astro/query-params'

$('#price-range button').on('click', function () {
  const priceFrom = $('#price-range input').data('from')
  const priceTo = $('#price-range input').data('to')
  location.href = queryParamsUrl({ priceFrom, priceTo })
})
</script>
```
:::
