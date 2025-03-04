# 網址

## 網址路徑

Astro 本身支援多種網址路徑書寫樣式，但 Netlify 僅支援強制增加尾隨斜線，因此統一使用該格式來撰寫頁面路徑。

* ✅ `/` (路徑對應 `index.astro`)
* ✅ `/aaa/` (路徑對應 `aaa.astro`)
* ❌ `/aaa` (路徑對應 `aaa.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb/index.astro`)

## 完整網址設定

如果有已經取得網站網域，可以透過 `astro.config.ts` 設定完整網址：

```ts
export default defineConfig({
  site: 'http://localhost:4321',
  // ...
})
```

然後就可以使用 `Astro.site` 來取得網站網址。

通常是在 SEO 標籤中會使用到，比如 `canonical` 或 `og:url`：

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />

<meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />
```
