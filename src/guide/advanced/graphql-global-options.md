# GraphQL 全局設定

## 全局 fetch 參數

在 `src/api/index.ts` 中可以設定全局的 fetch 參數，這些參數會在每次發送 GraphQL 請求時自動使用。比如可以設定 `Content-Type` header：

```ts {3-7}
export const graphQLAPI = createGraphQLAPI({
  endpoint: `${import.meta.env.API_BASE_URL.replace(/\/$/, '')}/graphql`,
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/json',
    },
  }),
})
```

## 自動注入 Authorization Header

有時候需要在 GraphQL 請求中帶入認證資訊，這時候可以使用 `Authorization` 標頭來傳遞認證資訊。這通常用於需要身份驗證的 API，例如需要使用者登入後才能存取的資料。

在 `src/api/index.ts` 的 `fetchOptions` 參數可以取得 `astroContext`，然後從 cookies 中取得使用者的認證 token，並將其加入到 `Authorization` header：

```ts {3-14}
export const graphQLAPI = createGraphQLAPI({
  endpoint: `${import.meta.env.API_BASE_URL.replace(/\/$/, '')}/graphql`,
  fetchOptions: astroContext => {
    let token: string | undefined
    if (astroContext?.cookies) {
      const session = getSession(astroContext.cookies)
      token = session.get('token')
    }
    return {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  },
})
```

::: tip
`astroContext` 在 `@stephenchenorg/astro` v2.0 版本開始才支援，請確保已將套件版本已更新到 v2.0 或以上。
:::

::: tip
如果要使用 `getSession()` 函數，需要安裝 [Astro Cookie Session](https://github.com/koyopro/astro-cookie-session) 套件後才能使用。
:::
