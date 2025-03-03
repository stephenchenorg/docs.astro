# 部署

Stephenchenorg 使用 Netlify 部署前端網站。部署相關設定都記錄在 `netlify.toml` 檔案中。

```toml
[build]
  command = "yarn build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

基本上只需將 GitHub 帳號與 Netlify 帳號連結，並且選擇要部署的專案即可完成部署。
