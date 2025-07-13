# 專案指令

## 本地開發

在本地開發環境中，使用以下指令啟動開發伺服器：

```bash
yarn dev
```

模擬 Staging 環境指令：

```bash
yarn dev --mode staging
```

模擬 Production 環境指令：

```bash
yarn dev --mode production
```

## 程式碼檢查 (Linting)

使用以下指令檢查程式碼：

```bash
yarn lint
```

自動修正程式碼檢查問題：

```bash
yarn lint --fix
```

## 部署編譯

Staging 環境編譯指令：

```bash
yarn build --mode staging
```

Production 環境編譯指令：

```bash
yarn build --mode production
```
