# 圖片

*TODO*

```astro
---
import Layout from '@/layouts/Layout.astro'
import { gql, graphQLAPI } from '@/api'
import { imageFields, Image, ResponsiveImage } from '@stephenchenorg/astro/image'
import type { ImageSource } from '@stephenchenorg/astro/image'
import { companySettingFields } from '@stephenchenorg/astro/company-setting'
import type { DataCompanySetting } from '@stephenchenorg/astro/company-setting'

interface Data extends DataCompanySetting {
  product: {
    image: ImageSource
  }
}

const data = await graphQLAPI<Data>(gql`
  query {
    product {
      image {
        ...ImageFields
      }
    }
    companySetting {
      ...CompanySettingFields
    }
  }
  ${imageFields}
  ${companySettingFields}
`)
---

<Layout meta={data.page} companySetting={data.companySetting}>
  <Image src={data.product.image.desktop} alt="Image alt" />
  <Image src={data.product.image.mobile} alt="Image alt" />

  <ResponsiveImage {...data.product.image} alt="Responsive image alt" />
</Layout>
```
