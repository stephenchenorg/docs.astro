# CSS & JS

介紹如何在 Astro 中引入外部的 CSS 和 JS 檔案。

## 連結外部套件

連結 CSS 檔案的方式是一樣的，而 JS 檔案還需要加上 `is:inline` 屬性，讓 Astro 不會將其當作模組來編譯處理，會原封不動的輸出：

```html
<link rel="stylesheet" href="/css/bootstrap.min.css">

<script is:inline src="/js/bootstrap.min.js"></script>
```

## 快取

有時候更改了 CSS 或 JS 檔案，但是瀏覽器還是會使用舊的快取，這時候可以在連結的 URL 後面加上一個版本號字串，瀏覽器就會重新請求新的檔案：

```html
<link rel="stylesheet" href="/css/style.css?20240506v1">

<script is:inline src="/js/script.js?20240506v1"></script>
```

約定的版本號格式是 `YYYYMMDDvN`，其中 `N` 是版本號，每次更新時設定為 `1`，當日有多次更新時才會遞增。比如：

* 2024/5/6 更新了一次檔案，版號：20240506v1
* 2024/5/6 更新了一次檔案，版號：20240506v2
* 2024/5/7 更新了一次檔案，版號：20240507v1

::: info
當然實際上這只是一個約定，為了可以有一個固定的更新方式，實際上你可以使用任何你喜歡的版本號格式。
:::

## 頁面 CSS & JS

有時候需為當前頁面加入一些 CSS 或 JS：

```html
<style>
/* CSS */
</style>

<script>
/* JS */
</script>
```

此種方式會將 CSS 和 JS 進行編譯處理、最佳化等，CSS 會被限定只能作用在當前元件的 HTML 標籤。而 JS 會被當作模組來處理，且會進行 TypeScript 的型別檢查。

## 全局 CSS

如果想要將 CSS 樣式應用到整個頁面，可以使用 `is:global` 屬性：

```html
<style is:global>
/* CSS */
</style>
```

## 保留原始 CSS & JS

如果想要保留原始的 CSS 和 JS，可以使用 `is:inline` 屬性，這樣 Astro 就不會對其進行編譯處理，但同時也就不能引入 npm 套件等功能：

```html
<style is:inline>
/* CSS */
</style>

<script is:inline>
/* JS */
</script>
```

如果要將變數從 Astro 的 Server 端傳遞給 Client 端的 JS，可以使用 `define:vars` 屬性，將資料使用 JSON 格式傳遞：

```astro
---
const message = 'Hello, Astro!'
---

<script is:inline define:vars={{ message }}>
alert(message)
</script>
```

或者也可以使用 `data-*` 屬性來傳遞資料：

```astro
---
const placement = 'top'
---

<div id="tooltip" data-placement={placement}></div>

<script>
const tooltip = document.querySelector('#tooltip') as HTMLElement
console.log(tooltip.dataset.placement) // top
</script>
```

## 參考資料

* [Template directives reference | Astro](https://docs.astro.build/en/reference/directives-reference/)
