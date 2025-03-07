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

然後現在在 `src/pages/api/contact.ts` 新增一個 POST 的路由，接收到剛才的表單資料後，再透過 Fetch API 來發送到後端 API，而這邊打的 API 就會是真正的後端，需要根據情況自行調整：

```ts {9-14,16}
import type { APIRoute } from 'astro'
import { getLocale } from 'i18n:astro'
import siteConfig from '@/site.config'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const formdata = new FormData()
  formdata.append('name', data.get('name') || '')
  formdata.append('email', data.get('email') || '')
  formdata.append('title', data.get('subject') || '')
  formdata.append('content', data.get('message') || '')
  const file = data.get('file')
  if (file) formdata.append('files[]', file)

  const response = await fetch(`${import.meta.env.API_BASE_URL.replace(/\/$/, '')}/api/contacts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Language': 'zh_TW',
      'Time-Zone': 'Asia/Taipei',
    },
    body: formdata,
  })
  const result = await response.json()

  if (response.status === 422) {
    return new Response(JSON.stringify({
      errors: result.errors,
    }), { status: 422 })
  } else if (response.status >= 400 && response.status < 600) {
    return new Response(JSON.stringify({
      message: 'server error',
    }), { status: 500 })
  }

  return new Response(JSON.stringify({
    message: 'success',
  }), { status: 200 })
}
```

::: info
如果眼尖你會發現這邊欄位名稱好像怪怪的? `title` 和 `content` 為什麼不設定成 `subject` 和 `message`? 這是因為後端 API 為了設計比較通用，欄位名稱先設定成 `title` 和 `content`，而只要知道對應欄位的用途，前端就可以自行調整欄位名稱了~
:::

而之所以要多開一個 API 路由的原因，一方面是為了保護後端 API 的安全，另一方面是為了避免 CORS 問題。
