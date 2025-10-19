# 分頁器

介紹如何客製分頁器元件。目前提供了兩種分頁器：

* Server 端和 Client 端。如果是從 Query String 取得分頁參數，則使用 Server 端分頁器
* 如果是使用 JS 動態切換分頁，不依靠 Query String 的參數的話，則使用 Client 端分頁器。

### Server 端分頁器

我們需要建立一個分頁器元件，用於在 Server 端切換列表頁數。確認專案中有沒有 `src/components/Pagination.vue` 元件，如果沒有就新增一個：

```vue
<template>
  <div v-if="showPagination" :class="props.class">
    <a v-if="canFirst" :href="firstUrl">First</a>
    <a v-if="canPrev" :href="prevUrl">Previous</a>
    <template v-for="page in items" :key="page">
      <span v-if="page === currentPage">{{ page }}</span>
      <a v-else :href="getUrl(page)">{{ page }}</a>
    </template>
    <a v-if="canNext" :href="nextUrl">Next</a>
    <a v-if="canLast" :href="lastUrl">Last</a>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { usePagination } from '@stephenchenorg/astro/pagination-vue-server-side'

const props = withDefaults(defineProps<{
  total: number
  perPage?: number
  visiblePages?: number
  currentPage?: number
  url: string
  class?: HTMLAttributes['class']
}>(), {
  currentPage: 1,
})

const {
  items,
  showPagination,
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
  total: props.total,
  perPage: props.perPage,
  visiblePages: props.visiblePages,
  currentPage: props.currentPage,
  url: props.url,
})
</script>
```

接著在列表頁中引入分頁器元件，並傳入總筆數和每頁筆數：

```astro
<Pagination
  total={32}
  perPage={10}
  currentPage={Number(Astro.url.searchParams.get('page')) || 1}
  url={Astro.request.url}
/>
```

也可以設定顯示的數字按鈕數量：

```astro {4}
<Pagination
  total={32}
  perPage={10}
  visiblePages={7}
  currentPage={Number(Astro.url.searchParams.get('page')) || 1}
  url={Astro.request.url}
/>
```

### Client 端分頁器

我們需要建立一個分頁器元件，用於在 Client 端切換列表頁數。確認專案中有沒有 `src/components/PaginationForClient.vue` 元件，如果沒有就新增一個：

```vue
<template>
  <div v-if="showPagination" :class="props.class">
    <button v-if="canFirst" type="button" @click="gotoFirst">First</button>
    <button v-if="canPrev" type="button" @click="gotoPrev">Previous</button>
    <template v-for="page in items" :key="page">
      <span v-if="page === currentPage">{{ page }}</span>
      <button v-else type="button" @click="gotoPage(page)">{{ page }}</button>
    </template>
    <button v-if="canNext" type="button" @click="gotoNext">Next</button>
    <button v-if="canLast" type="button" @click="gotoLast">Last</button>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { usePagination } from '@stephenchenorg/astro/pagination-vue-client-side'

const props = defineProps<{
  total: number
  perPage?: number
  visiblePages?: number
  currentPage: number
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const {
  items,
  showPagination,
  canFirst,
  canPrev,
  canNext,
  canLast,
  gotoFirst,
  gotoPrev,
  gotoNext,
  gotoLast,
  gotoPage,
} = usePagination({
  total: () => props.total,
  perPage: () => props.perPage,
  visiblePages: () => props.visiblePages,
  currentPage: () => props.currentPage,
  onChange(page) {
    emit('update:currentPage', page)
  },
})
</script>
```

接著在列表頁中引入分頁器元件，並傳入總筆數和每頁筆數：

```vue
<template>
  <PaginationForClient
    v-model:current-page="currentPage"
    :total="total"
    :per-page="perPage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaginationForClient from '@/components/PaginationForClient.vue'

const currentPage = ref(1)
const total = ref(120)
const perPage = ref(10)
</script>
```

也可以設定顯示的數字按鈕數量：

```vue {6}
<template>
  <PaginationForClient
    v-model:current-page="currentPage"
    :total="total"
    :per-page="perPage"
    :visible-pages="7"
  />
</template>
```
