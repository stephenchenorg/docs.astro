# 部署

Stephenchenorg 使用 Netlify 部署前端網站，部署相關設定都記錄在 `netlify.toml` 檔案中：

```toml
[build]
  command = "yarn build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

基本上只需從 Netlify 連結 GitHub 帳號，並且選擇要部署的專案即可。

如果有使用到環境變數，需要在 Netlify 的網站設定中設定，專案中有使用到的環境變數都可以在 `.env.example` 中找到。
