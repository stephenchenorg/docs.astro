# 內頁

介紹如何取得內頁資料，包含取得單筆資料、取得上下篇資料、取得最新相關資料等。

## 取得內頁資料

這裡還是以取得單筆文章資料為例，取得文章需要傳入 `slug` 參數，同時還需要傳入 `sort_by` 和 `sort_column` 參數，用於控制顯示上/下頁文章連結的排序。

而通常文章還會有一些類似最新文章的區塊，這裡我們可以使用 `articles` 來取得最新文章列表，不過可以為其取個別名 `recentlyArticles`。

現在新增一個 `src/pages/artists/[slug].astro` 來取得內頁資料：

```ts
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { imageFields, coverFields, backgroundFields, ResponsiveImage } from '@stephenchenorg/astro/image'
import type { ImageSource } from '@stephenchenorg/astro/image'
import { seoMeta, seoMetaFields } from '@stephenchenorg/astro/page'
import type { PageMeta } from '@stephenchenorg/astro/page'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'
import type { Paginator } from '@stephenchenorg/astro/pagination'
import { formatDate } from '@/utils/date'

interface Data extends DataCompanySetting {
  article: PageMeta & {
    title: string
    cover: ImageSource
    content: string
    created_at: string
    prev: {
      slug: string
      title: string
    } | null
    next: {
      slug: string
      title: string
    } | null
  }
  recentlyArticles: Paginator<{
    slug: string
    title: string
    cover: ImageSource
    created_at: string
  }>
}

const { slug } = Astro.params
if (!slug) throw new Error('Slug is required')

const data = await graphQLAPI<Data>(gql`
  query ($slug: String!) {
    article(
      slug: $slug
      sort_by: "desc"
      sort_column: "id"
    ) {
      title
      cover {
        ...CoverFields
      }
      content
      created_at
      prev {
        slug
        title
      }
      next {
        slug
        title
      }
      ...ArticleSeoMetaFields
    }
    recentlyArticles: articles(
      page: 1
      per_page: 5
      sort_by: "desc"
      sort_column: "id"
    ) {
      data {
        slug
        title
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
  ${seoMetaFields('Article')}
  ${companySettingFields}
`, { variables: { slug } })

const meta = seoMeta({
  title: data.article.title,
  description: data.article.description,
  image: data.article.cover.desktop,
}, data.article)
```

接著加上前端的部分，後端傳來的文章內容是使用所見及所得編輯器產生的 HTML，這裡使用 `set:html` 來渲染 HTML 內容：

```astro
<Layout meta={meta} companySetting={data.companySetting}>
  <article>
    <h1>{data.article.title}</h1>
    <div>
      <Fragment set:html={data.article.content} />
    </div>
    {data.article.prev && (
      <a href={`/articles/${data.article.prev.slug}/`}>
        &larr; {data.article.prev.title}
      </a>
    )}
    {data.article.next && (
      <a href={`/articles/${data.article.next.slug}/`}>
        {data.article.next.title} &rarr;
      </a>
    )}
  </article>

  <h5>Recent Articles</h5>>
  <ul>
    {data.recentlyArticles.data.map(article => (
      <li>
        <a href={`/articles/${article.slug}/`} title={article.title}>
          <ResponsiveImage {...article.cover} alt={article.title} title={article.title} />
        </a>
        <div>
          <p>{formatDate(article.created_at)}</p>
          <a href={`/articles/${article.slug}/`}>{article.title}</a>
        </div>
      </li>
    ))}
  </ul>
</Layout>
```
