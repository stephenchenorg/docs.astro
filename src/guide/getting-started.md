# 快速開始

本指南將幫助您快速開始使用 Astro 建立前端網站。

## 開發環境

* Node.js (v22.14.0 或更新版本)
* Yarn 1.x

## 建立專案

使用以下指令安裝 Yarn：

```bash
npm install -g yarn
```

初始化 Astro 專案：

```bash
npx degit stephenchenorg/starter.astro --mode=git my-project
```

進入專案目錄：

```bash
cd my-project
```

複製 `.env` 檔案，並設定好環境變數：

```bash
cp .env.example .env
```

如果有使用到 [Astro Cookie Session](https://github.com/koyopro/astro-cookie-session)，需要設定 `SECRET_KEY_BASE` 加密金鑰環境變數，可以使用以下指令生成：

```bash
openssl rand -hex 64
```

接著就可以啟動開發伺服器了：

```bash
yarn dev
```
