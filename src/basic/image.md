# 圖片

介紹如何使用圖片元件。

## 圖片欄位

目前 GraphQL 後端有定義以下圖片類型可以使用：

| 圖片類型 | 說明 |
| --- | --- |
| **Image** | 一般圖片 |
| **Cover** | 封面圖片 |
| **Background** | 背景圖片 |

GraphQL 後端欄位都有不同的類型定義，需要依照查詢的欄位來輸入對應的 Fragment。而每個圖片都有以下欄位：

| 欄位名稱 | 說明 |
| --- | --- |
| **desktop** | 桌面版圖片 |
| ~~**desktop_blur**~~ | ~~桌面版模糊圖片 *(目前不使用)*~~ |
| **mobile** | 手機版圖片 |
| ~~**mobile_blur**~~ | ~~手機版模糊圖片 *(目前不使用)*~~ |

## 請求和展示 API 的圖片欄位

比如要使用 Image 圖片，就引入 `imageFields` Fragment，並在查詢時使用 `...ImageFields` 來帶入圖片欄位。以及要在 `Data` 介面中定義圖片欄位的型別為 `ImageSource`。

以下是一個使用 Image 圖片的範例：

```astro {3-4,8-10,17-25,28-30,35-38}
---
import { gql, graphQLAPI } from '@/api'
import { imageFields, Image, ResponsiveImage } from '@stephenchenorg/astro/image'
import type { ImageSource } from '@stephenchenorg/astro/image'

interface Data extends DataCompanySetting {
  product: {
    image: ImageSource
    cover: ImageSource
    background: ImageSource
  }
}

const data = await graphQLAPI<Data>(gql`
  query {
    product {
      image {
        ...ImageFields
      }
      cover {
        ...CoverFields
      }
      background {
        ...BackgroundFields
      }
    }
  }
  ${imageFields}
  ${coverFields}
  ${backgroundFields}
`)
---

<div>
  <Image src={data.product.image.desktop} alt="Image alt" />
  <Image src={data.product.image.mobile} alt="Image alt" />

  <ResponsiveImage {...data.product.image} alt="Responsive image alt" />
</div>
```

而更多關於 `<Image>` 和 `<ResponsiveImage>` 的使用方式，可以參考 [圖片 (image) 模組](../modules/image.md)。
