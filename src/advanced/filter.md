# 過濾器

*TODO*

## 設定 UrlConfig

*TODO*

```astro
---
import { createUrlConfig, ProvideUrlConfig } from '@stephenchenorg/astro/query-params'

const urlConfig = createUrlConfig({
  baseUrl: Astro.url.pathname,
  params,
  defaultParams,
})
---

<Fragment slot="head">
  <ProvideUrlConfig config={urlConfig} />
</Fragment>
```

## 解析查詢參數

*TODO*

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

*TODO*

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

更多資訊請參考 [zod](https://github.com/colinhacks/zod) 套件說明文件。

## 將查詢參數傳入 API

*TODO*

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

## 連結型過濾器

*TODO*

```astro
<FilterTags value={params.category} options={data.productCategory} urlConfig={urlConfig} />
```

*TODO*

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
  <h2>標籤</h2>
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

*TODO*

## 表單型過濾器

```astro
<FilterSearch value={params.search || ''} />
<FilterPrice from={params.priceFrom} to={params.priceTo} min={PRICE_MIN} max={PRICE_MAX} />
```

*TODO*

新增元件 `src/components/filters/FilterSearch.astro`：

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
  const search = this.querySelector('input[name="search"]').value
  location.href = queryParamsUrl({ search })
})
</script>
```

*TODO*

新增元件 `src/components/filters/FilterPrice.astro`：

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
      class="tromic-range-slider"
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

```js
let input = document.querySelector('#price-range input') as HTMLInputElement
const defaultPriceFrom = Number(input.dataset.from)
const defaultPriceTo = Number(input.dataset.to)

document.querySelector('#price-range button').addEventListener('click', function () {
  input = document.querySelector('#price-range input') as HTMLInputElement
  const priceFrom = Number(input.dataset.from) || defaultPriceFrom
  const priceTo = Number(input.dataset.to) || defaultPriceTo
  location.href = queryParamsUrl({ priceFrom, priceTo })
})
```
</script>
```

*TODO*
