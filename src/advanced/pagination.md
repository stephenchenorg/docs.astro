# 分頁

*TODO*

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
  canPrev,
  canNext,
  prevUrl,
  nextUrl,
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
    {canPrev && <a href={prevUrl}>&lt;</a>}
    {items.map(page =>
      page === currentPage
        ? <span>{page}</span>
        : <a href={getUrl(page)}>{page}</a>
    )}
    {canNext && <a href={nextUrl}>&gt;</a>}
  </div>
)}
```
