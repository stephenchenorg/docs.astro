# 網址

## 網址路徑

Astro 本身支援多種網址路徑書寫樣式，但 Netlify 僅支援強制增加尾隨斜線，因此統一使用該格式來撰寫頁面路徑。

* ✅ `/` (路徑對應 `index.astro`)
* ✅ `/aaa/` (路徑對應 `aaa.astro`)
* ❌ `/aaa` (路徑對應 `aaa.astro`)
* ❌ `/aaa.html` (路徑對應 `aaa.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb/index.astro`)

## 完整網址設定

如果有已經取得上線使用的域名，就可以在 `astro.config.ts` 裡設定：

```ts
export default defineConfig({
  site: 'https://example.org',
  // ...
})
```

然後就能透過 `Astro.site` 來取得網站網址了。

通常是在 SEO 標籤中會使用到，例如 `canonical` 和 `og:url`：

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />

<meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />
```
