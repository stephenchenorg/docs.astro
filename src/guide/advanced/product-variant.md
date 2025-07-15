# 商品多規格選擇器

介紹如何在 Astro 中使用 `@stephenchenorg/astro/product-sku` 模組來建立商品 SKU (庫存單位) 功能。

::: tip
商品多規格選擇器功能在 `@stephenchenorg/astro` v5.0 版本開始才支援，請確保已將套件版本已更新到 v5.0 或以上。
:::

## 商品 SKU 需要的參數

在使用 `ProductvariantSelector` 時，需要提供以下參數：

* **availableVariants**: 商品的規格列表，例如不同顏色和尺寸的組合。
  * `id`：規格的唯一識別碼。
  * `combination_key`：規格的組合鍵，用於從屬性中生成唯一的組合，規則為使用規格屬性選項 ID 連接而成的字串，將 ID 由小到大排序後連接，例如 `1-2-3`。
  * `listing_price`：商品的原價。
  * `selling_price`：商品的售價。
  * `inventory`：商品的庫存數量。
* **variantAttributes**: 商品的屬性列表，例如顏色、尺寸等。
  * `id`：屬性的唯一識別碼。
  * `title`：屬性的名稱，例如「顏色」或「尺寸」。
  * `options`：屬性的選項列表，例如「紅色」、「藍色」、「小」、「中」、「大」等。
    * `id`：選項的唯一識別碼。
    * `title`：選項的名稱。

## 商品 SKU 規格選擇器範例

先初始化商品多規格選擇器，並將商品的規格列表和屬性列表傳入：

```vue
<script setup lang="ts">
import { ProductVariantSelector } from '@stephenchenorg/astro/product-variant'

// 初始化商品多規格選擇器
const variantSelector = new ProductVariantSelector({
  availableVariants: props.product.specifications.map(spec => ({
    id: spec.id,
    combination_key: spec.combination_key,
    listing_price: Number(spec.listing_price),
    selling_price: Number(spec.selling_price),
    inventory: spec.inventory,
  })),
  variantAttributes: props.product.attributes.map(attr => ({
    id: attr.id,
    title: attr.title,
    options: attr.items.slice(),
  })),
})
</script>
```

接著在模板中加入商品的規格選擇器 UI：

```vue
<template>
  <div
    v-for="attribute in variantSelector.variantAttributes"
    :key="attribute.id"
    class="flex items-center space-x-4"
  >
    <span>{{ attribute.title }}</span>
    <ul class="flex flex-wrap gap-2">
      <li v-for="option in attribute.options" :key="option.id">
        <input
          :id="`sku-${attribute.id}-${option.id}`"
          type="radio"
          :name="`sku-${attribute.id}`"
          :value="option.id"
          class="hidden peer"
          @change="updateProductVariantOption(attribute.id, attribute.title, option.id)"
        >
        <label
          :for="`sku-${attribute.id}-${option.id}`"
          class="px-2 py-1 text-gray-500 tracking-wide border border-gray-300 rounded-md cursor-pointer select-none peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500"
        >
          {{ option.title }}
        </label>
      </li>
    </ul>
  </div>
</template>
```

最後是處理商品規格選擇的事件。當用戶選擇不同的規格時，更新商品的價格和庫存：

```ts
// 處理商品規格選擇
function updateProductVariantOption(attributeId: number, attributeLabel: string, optionId: number) {
  // 設定選項值，並根據選中的選項，更新對應的商品規格
  variantSelector.selectVariant(attributeId, optionId, attributeLabel)

  // 還沒選擇完所有屬性...
  if (!variantSelector.areAllAttributesSelected()) return

  // 如果有選擇到商品規格，則更新價格和庫存
  if (variantSelector.currentVariant) {
    product.value.selling_price = variantSelector.currentVariant.selling_price
    product.value.listing_price = variantSelector.currentVariant.listing_price
    productStock.value = variantSelector.currentVariant.inventory
  } else {
    // 如果沒有商品規格，恢復原始價格和庫存
    product.value.selling_price = originalPrice
    product.value.listing_price = originalOldPrice
    productStock.value = 0
  }
}
```
