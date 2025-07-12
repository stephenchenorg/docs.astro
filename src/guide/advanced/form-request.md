# 表單請求

介紹如何處理提交表單，並透過 Fetch API 來發送表單資料到後端 API。

## 聯絡我們表單

這裡用聯絡我們表單來做示範，首先在 `src/pages/contact.astro` 中新增一個表單，注意一下這裡的 `action` 是指向 Astro 的 API 路由，等下會新增：

```astro
<div id="contact-form-wrapper">
  <!-- 表單 -->
  <form id="contact-form" method="post" action="/api/contact/" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Name" />
    <input type="text" name="email" placeholder="Email" />
    <input type="text" name="subject" placeholder="Subject" />
    <textarea name="message" rows="5" placeholder="Message"></textarea>
    <div>
      <div>Attachment:</div>
      <input type="file" name="file" />
    </div>
    <button type="submit">Send message</button>
  </form>

  <!-- 表單結果訊息 -->
  <div id="output-contact"></div>
</div>
```

然後新增一段 JavaScript 來處理提交表單：

```astro
<script>
const contactForm = document.getElementById('contact-form') as HTMLFormElement
contactForm.addEventListener('submit', function (e) {
  e.preventDefault()
  fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      const wrapper = document.getElementById('contact-form-wrapper') as HTMLDivElement
      const output = document.getElementById('output-contact') as HTMLDivElement
      if (status === 200) {
        wrapper.innerHTML = '<h5>Message sent</h5>'
        output.innerHTML = '<p>Thanks for contacting us! We will check your message within a few minutes.</p>'
      } else if (status === 422) {
        const error = body.errors[Object.keys(body.errors)[0]][0]
        if (error) {
          output.innerHTML = `<div class="error-message">${error}</div>`
        }
      } else if (status === 500) {
        output.innerHTML = '<div class="error-message">' + body.message + '</div>'
      }
    })
    .catch(error => {
      const output = document.getElementById('output-contact') as HTMLDivElement
      output.innerHTML = '<div class="error-message">' + error.message + '</div>'
    })
})
</script>
```

HTTP 狀態主要處理 200、422、500 三種狀況，分別代表成功、表單驗證錯誤、伺服器錯誤，其中最關鍵的是 422 狀態，需要將後端的表單欄位錯誤訊息顯示出來。

現在就可以在 `src/pages/api/contact.ts` 新增一個 POST 的路由，接收到剛才的表單資料後，再透過 Fetch API 來發送到後端 API，而這邊打的 API 就會是真正的後端。

主要需要調整的是表單欄位的部分，因為每個專案需要的欄位都不一樣，因此在這邊來做必填欄位的驗證，需要注意的是，`contactUs` 這個 API 一定需要 `name` 和 `title` 這兩個欄位為必填，以及檔案最多只能一次上傳 5 個：

```ts {7-11,15-18,30-46}
import type { APIRoute } from 'astro'
import { gql, graphQLAPI, GraphQLValidationError } from '@/api'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const name = data.get('name') || ''
  const email = data.get('email') || ''
  const title = data.get('subject') || ''
  const content = data.get('message') || ''
  const files = [data.get('file') as File | null].filter(Boolean)

  const errors: Record<string, string[]> = {}

  if (!name || typeof name !== 'string') errors.name = ['姓名 是必填']
  if (!email || typeof email !== 'string') errors.email = ['電子郵件 是必填']
  if (!title || typeof title !== 'string') errors.title = ['標題 是必填']
  if (!content || typeof content !== 'string') errors.content = ['內容 是必填']

  if (Object.keys(errors).length) {
    return new Response(JSON.stringify({
      errors,
    }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await graphQLAPI(gql`
      mutation (
        $name: String
        $email: String
        $title: String
        $content: String
        $files: [Upload!]!
      ) {
        contactUs(
          name: $name
          email: $email
          title: $title
          content: $content
          files: $files
        )
      }
    `, { variables: { name, email, title, content, files } })

    return new Response(JSON.stringify({
      message: 'success',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    if (e instanceof GraphQLValidationError) {
      return new Response(JSON.stringify({
        errors: e.errors,
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.error(e)

    return new Response(JSON.stringify({
      message: 'server error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

::: info
如果眼尖你會發現這邊欄位名稱好像怪怪的? `title` 和 `content` 為什麼不設定成 `subject` 和 `message`? 這是因為後端 API 為了設計比較通用，欄位名稱先設定成 `title` 和 `content`，而只要知道對應欄位的用途，前端就可以自行調整欄位名稱了~
:::

而之所以要多開一個 API 路由的原因，一方面是為了保護後端 API 的安全，另一方面是為了避免 CORS 問題。

## 表單多語系設定

> [!TIP]
>
> 如果你的網站有多語系需求，需要先參考 [多語系](/guide/advanced/i18n) 來設定。

因為表單後端的 API 不是放在多語系的路由下，所以需要在表單中加入一個 `input` 來傳遞當前語系，這樣後端 API 就可以正確設定語系了：

```astro
---
import { getLocale } from 'i18n:astro'
---

<form method="post" id="contact-form" action="/api/contact/">
  <input type="hidden" name="lang" value={getLocale().replace('-', '_')} />
  <!-- ... -->
</form>
```

然後在 POST 路由中處理語系：

```ts {2,12,16-19,36-38}
import type { APIRoute } from 'astro'
import { t } from 'i18n:astro'
import { gql, graphQLAPI, GraphQLValidationError } from '@/api'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const name = data.get('name') || ''
  const email = data.get('email') || ''
  const title = data.get('subject') || ''
  const content = data.get('message') || ''
  const lang = data.get('lang') as string

  const errors: Record<string, string[]> = {}

  if (!name || typeof name !== 'string') errors.name = [t('validation:name.required')]
  if (!email || typeof email !== 'string') errors.email = [t('validation:email.required')]
  if (!title || typeof title !== 'string') errors.title = [t('validation:title.required')]
  if (!content || typeof content !== 'string') errors.content = [t('validation:content.required')]

  if (Object.keys(errors).length) {
    return new Response(JSON.stringify({
      errors,
    }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await graphQLAPI(gql`
      ...
    `, {
      variables: { name, email, title, content },
      fetchOptions: {
        headers: {
          'Content-Language': lang,
        },
      },
    })

    // ...
  } catch (e) {
    // ...
  }
}
```

以及對應的多語系檔案：

::: code-group

``` json [src/locales/zh-TW/validation.json]
{
  "name": {
    "required": "姓名 是必填"
  },
  "email": {
    "required": "電子信箱 是必填"
  },
  "title": {
    "required": "標題 是必填"
  },
  "content": {
    "required": "內容 是必填"
  }
}
```

``` json [src/locales/en/validation.json]
{
  "name": {
    "required": "The name field is required."
  },
  "email": {
    "required": "The email field is required."
  },
  "title": {
    "required": "The title field is required."
  },
  "content": {
    "required": "The content field is required."
  }
}
```

:::
