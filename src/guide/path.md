# 路徑

Astro 本身支援多種網址路徑書寫樣式，但 Netlify 僅支援強制增加尾隨斜線，因此統一使用該格式來撰寫頁面路徑。

* ✅ `/` (路徑對應 `index.astro`)
* ✅ `/aaa/` (路徑對應 `aaa.astro`)
* ❌ `/aaa` (路徑對應 `aaa.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb.astro`)
* ✅ `/aaa/bbb/` (路徑對應 `aaa/bbb/index.astro`)
