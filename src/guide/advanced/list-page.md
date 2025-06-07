# 分頁列表

介紹如何取得分頁列表資料，和客製分頁器元件。

## 分頁器

先看分頁器的部分，首先我們需要一個分頁器元件，用於切換列表頁數。確認專案中有沒有 `src/components/Pagination.astro` 元件，如果沒有就新增一個：

```astro
---
import { usePagination } from '@stephenchenorg/astro/pagination'

interface Props {
  total: number
  perPage?: number
  visiblePages?: number
  currentPage?: number
}

const {
  items,
  showPagination,
  currentPage,
  canFirst,
  canPrev,
  canNext,
  canLast,
  firstUrl,
  prevUrl,
  nextUrl,
  lastUrl,
  getUrl,
} = usePagination({
  total: Astro.props.total,
  perPage: Astro.props.perPage,
  visiblePages: Astro.props.visiblePages,
  currentPage: Astro.props.currentPage || Number(Astro.url.searchParams.get('page')) || 1,
  url: Astro.request.url,
})
---

{showPagination && (
  <div>
    {canFirst && <a href={firstUrl}>First</a>}
    {canPrev && <a href={prevUrl}>Previous</a>}
    {items.map(page =>
      page === currentPage
        ? <span>{page}</span>
        : <a href={getUrl(page)}>{page}</a>
    )}
    {canNext && <a href={nextUrl}>Next</a>}
    {canLast && <a href={lastUrl}>Last</a>}
  </div>
)}
```

接著在列表頁中引入分頁器元件，並傳入總筆數和每頁筆數：

```astro
<Pagination total={32} perPage={10} />
```

也可以設定顯示的頁數按鈕數量：

```astro
<Pagination total={32} perPage={10} visiblePages={7} />
```

## 取得分頁列表資料

分頁列表的欄位會有一個 `data` 欄位來放陣列資料，還有 `total` 和 `per_page` 欄位，分別代表總筆數和每頁筆數。

在這個範例的 `articles` 可以傳入參數，`page` 代表當前頁數，`per_page` 代表每頁筆數，`sort_by` 代表排序方式 (可以使用正序 `asc` 和倒序 `desc`)，`sort_column` 代表排序欄位。除了 `page` 是從 Astro URL 參數取得的 `currentPage`，其他參數都可以設定固定值。

::: tip
如果想要依照建立時間排序，通常會想要將 `sort_column` 設定為 `created_at`，不過其實設定為 `id` 也可以達到相同效果，目的是為了提升資料庫查詢的效能。
:::

型別的部分就可以使用 `Paginator` 來定義分頁列表資料類型了。

現在新增一個 `src/pages/artists/index.astro` 來取得分頁列表資料：

```ts
import Layout from '@/layouts/Layout.astro'
import Pagination from '@/components/Pagination.astro'
import { ResponsiveImage } from '@stephenchenorg/astro/image'
import type { ImageSource } from '@stephenchenorg/astro/image'
import type { Paginator } from '@stephenchenorg/astro/pagination'
import { formatDate } from '@/utils/date'

interface Data extends DataCompanySetting {
  articles: Paginator<{
    slug: string
    title: string
    description: string
    cover: ImageSource
    created_at: string
  }>
}

const currentPage = Number(Astro.url.searchParams.get('page')) || 1

const data = await graphQLAPI<Data>(gql`
  query ($page: Int!) {
    articles(
      page: $page
      per_page: 10
      sort_by: "desc"
      sort_column: "id"
    ) {
      total
      per_page
      data {
        slug
        title
        description
        cover {
          ...CoverFields
        }
        created_at
      }
    }
    companySetting {
      ...CompanySettingFields
    }
  }
  ${coverFields}
  ${companySettingFields}
`, { variables: { page: currentPage } })
```

然後前端就可以使用 `data.articles.data` 輸出列表，並使用分頁器元件來切換頁數了：

```astro
<Layout meta={meta} companySetting={data.companySetting}>
  <div class="list">
    {data.articles.data.map(article => (
      <div class="list-item">
        <a href={`/articles/${article.slug}`}>
          <ResponsiveImage class="list-image" {...article.cover} />
        </a>
        <h2>
          <a href={`/articles/${article.slug}`}>{article.title}<a>
        </h2>
        <ul>
          <li>{formatDate(article.created_at)}</li>
        </ul>
        <div set:html={article.description}></div>
        <a href={`/articles/${article.slug}`}>
          Read More
        </a>
      </div>
    ))}
  </div>

  <Pagination total={data.articles.total} perPage={data.articles.per_page} />
</Layout>
```
