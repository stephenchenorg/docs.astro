# 資料夾結構

這裡是 [stephenchenorg/starter.astro](https://github.com/stephenchenorg/starter.astro) 預設的資料夾結構，可以根據自己的需求進行調整。

```
public/
src/
  ├── api/
  ├── layouts/
  ├── pages/
  ├── utils/
  ├── env.d.ts
  ├── middleware.ts
  └── site.config.ts
.editorconfig
.env
.env.example
.gitignore
.graphqlrc.yml
astro.config.ts
netlify.toml
package.json
README.md
tsconfig.json
```

## public

這個資料夾是用來存放靜態檔案，例如圖片、影片、字型等等。

## src

這個資料夾是用來存放專案的程式碼。

## src/api

這個資料夾是用來存放 API 相關的程式碼。

## src/layouts

這個資料夾是用來存放 Layout 元件的程式碼。

## src/pages

這個資料夾是用來存放頁面元件的程式碼，每個檔案檔名就是該頁面的路徑。

## src/utils

這個資料夾是用來存放工具函式的程式碼。

目前預設會提供一個 `date.md` 檔案，包含一個 `formatDate()` 函式，可以根據情境自訂日期格式。

## src/env.d.ts

這個檔案是用來定義環境變數的型別。

## src/middleware.ts

這個檔案是用來定義 Astro Middleware 的程式碼。

預設會處理 GraphQL 回傳的 404 錯誤，並顯示到 404 頁面。

## src/site.config.ts

這個檔案是用來定義網站的靜態設定，預設是一個空物件，可以根據需求自訂。

## .editorconfig

這個檔案是用來定義 EditorConfig 格式程式碼的規則。

## .env

這個檔案是用來定義環境變數的值，不會被版本控制，可以從 `.env.example` 複製。

## .graphqlrc.yml

這個檔案是用來定義 GraphQL Config 的設定，讓編輯器中的 GraphQL 套件可以正確顯示語法突顯。

## astro.config.ts

這個檔案是用來定義 Astro 的設定，包含打包編譯的方式、註冊載入的套件等等。

## netlify.toml

這個檔案是用來定義 Netlify 的設定，包含部署的指令、Node.js 版本等等。

## tsconfig.json

這個檔案是用來定義 TypeScript 的設定。
