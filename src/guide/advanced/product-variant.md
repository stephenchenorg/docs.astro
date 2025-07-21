# 商品多規格選擇器

介紹如何在 Astro 中建立商品多規格選擇器功能。

## 需要的參數

在建立商品多規格選擇器時，需要確保商品物件中提供以下參數：

* **specifications**: 商品的規格列表，例如不同顏色和尺寸的組合。
  * `id`：規格的唯一識別碼。
  * `combination_key`：規格的組合鍵，用於從屬性中生成唯一的組合，規則為使用規格屬性選項 ID 連接而成的字串，將 ID 由小到大排序後連接，例如 `1-2-3`。
  * `listing_price`：商品的原價。
  * `selling_price`：商品的售價。
  * `inventory`：商品的庫存數量。
* **attributes**: 商品的屬性列表，例如顏色、尺寸等。
  * `id`：屬性的唯一識別碼。
  * `title`：屬性的名稱，例如「顏色」或「尺寸」。
  * `items`：屬性的選項列表，例如「紅色」、「藍色」、「小」、「中」、「大」等。
    * `id`：選項的唯一識別碼。
    * `title`：選項的名稱。
    * `product_attribute_id`：選項所屬屬性的 ID。

## 商品多規格選擇器範例

先初始化商品規格相關變數：

```vue
<script setup lang="ts">
import type { ProductSpecification } from '@/types'
import { computed, ref, shallowRef, watch } from 'vue'

// 使用者已選擇的屬性值 { [attributeId]: [itemId] }
const selectedAttributes = ref<Record<number, number>>({})

// 匹配到的商品規格物件
const selectedSpecification = shallowRef(undefined) as ShallowRef<ProductSpecification | undefined>

// 可以點選的商品屬性
const enabledAttributeItems = computed<number[]>(() => {
  return product.value.attributes.flatMap(attribute => {
    return attribute.items
      .filter(item => {
        return product.value.specifications.some(spec =>
          (spec.combination_key?.split('-') || []).includes(item.id.toString()) &&
          spec.inventory > 0
        )
      })
      .map(item => item.id)
  })
})
</script>
```

接著在模板中加入商品的規格選擇器 UI：

```vue
<template>
  <div
    v-for="attribute in product.attributes"
    :key="attribute.id"
    class="flex items-center space-x-4"
  >
    <span>{{ attribute.title }}</span>
    <ul class="flex flex-wrap gap-2">
      <li v-for="item in attribute.items" :key="item.id">
        <input
          :id="`sku-${attribute.id}-item-${item.id}`"
          v-model="selectedAttributes[attribute.id]"
          type="radio"
          class="hidden peer"
          :value="item.id"
          :disabled="!enabledAttributeItems.includes(item.id)"
        >
        <label
          :for="`sku-${attribute.id}-item-${item.id}`"
          class="px-2 py-1 text-gray-500 tracking-wide border border-gray-300 cursor-pointer select-none peer-checked:bg-primary-500 peer-checked:text-white peer-checked:border-primary-500 peer-disabled:bg-gray-100 peer-disabled:text-gray-300 peer-disabled:border-gray-300 peer-disabled:cursor-default"
        >
          {{ item.title }}
        </label>
      </li>
    </ul>
  </div>
</template>
```

然後是處理商品規格選擇的事件。當用戶選擇不同的規格時，更新商品的價格和庫存：

```vue
<script setup lang="ts">
...

// 更新商品規格時，重新計算價格和庫存
watch(selectedAttributes, () => {
  updateSelectedProductSpecification()

  // 確認是否已選擇所有商品規格選項...
  if (Object.keys(selectedAttributes.value).length !== product.value.attributes.length) return

  // 如果有選擇到商品規格，則更新價格和庫存
  if (selectedSpecification.value) {
    product.value.selling_price = selectedSpecification.value.selling_price
    product.value.listing_price = selectedSpecification.value.listing_price
    productStock.value = selectedSpecification.value.inventory
  } else {
    // 如果沒有商品規格，恢復原始價格和庫存
    product.value.selling_price = originalPrice
    product.value.listing_price = originalOldPrice
    productStock.value = 0
  }
}, { deep: true })

// 更新商品規格
function updateSelectedProductSpecification() {
  // 由選項組裝出商品規格 Key
  const combinationKey = Object.values(selectedAttributes.value)
    .sort((a, b) => a - b)
    .join('-')

  // 尋找符合的商品規格
  selectedSpecification.value = product.value.specifications.find(spec => spec.combination_key === combinationKey)
}
</script>
```

最後是加入購物車的處理函式，確保用戶已選擇所有規格並且庫存足夠：

```vue
<script setup lang="ts">
...

function handleAddToCart() {
  if (Object.keys(selectedAttributes.value).length !== product.value.attributes.length) {
    alert('請先選擇商品規格')
    return
  }
  if (!selectedSpecification.value || selectedSpecification.value.inventory <= 0) {
    alert('商品規格不存在或庫存不足')
    return
  }

  // add to cart...

  showMessage('success', '商品已加入購物車')
}
</script>
```

## 購物車多規格選擇器下拉選單範例

在購物車中，需要設計一個下拉選單來選擇商品的規格。先初始化商品規格相關變數：

```vue
<script setup lang="ts">
import type { ProductSpecification } from '@/types'
import { computed, ref, shallowRef, watch } from 'vue'

const open = ref(false)

// 使用者已選擇的屬性值 { [attributeId]: [itemId] }
const selectedAttributes = ref<Record<number, number>>({})

// 匹配到的商品規格物件
const selectedSpecification = shallowRef(undefined) as ShallowRef<ProductSpecification | undefined>

// 可以點選的商品屬性
const enabledAttributeItems = computed<number[]>(() => {
  return props.availableAttributes.flatMap(attribute => {
    return attribute.items
      .filter(item => {
        return props.availableSpecifications.some(spec =>
          (spec.combination_key?.split('-') || []).includes(item.id.toString()) &&
          spec.inventory > 0
        )
      })
      .map(item => item.id)
  })
})
</script>
```

然後在模板中加入下拉選單的 UI：

```vue
<template>
  <button type="button" @click="open = !open">
    <span>規格：{{ selectedSpecification.title }}</span>
  </button>

  <div v-if="open">
    <dl class="space-y-3">
      <div v-for="attribute in availableAttributes" :key="attribute.title">
        <dt>{{ attribute.title }}：</dt>
        <dd
          v-for="item in attribute.items"
          :key="item.id"
          class="flex items-center"
        >
          <input
            :id="`cart-sku-${attribute.id}-item-${item.id}`"
            v-model="selectedAttributes[attribute.id]"
            type="radio"
            class="hidden peer"
            :value="item.id"
            :disabled="!enabledAttributeItems.includes(item.id)"
          />
          <label
            :for="`cart-sku-${attribute.id}-item-${item.id}`"
            class="px-2 py-1 text-gray-500 tracking-wide border border-gray-300 cursor-pointer select-none peer-checked:bg-primary-500 peer-checked:text-white peer-checked:border-primary-500 peer-disabled:bg-gray-100 peer-disabled:text-gray-300 peer-disabled:border-gray-300 peer-disabled:cursor-default"
          >
            {{ item.title }}
          </label>
        </dd>
      </div>
    </dl>
  </div>
</template>
```

接著是處理下拉選單開啟時的事件，初始化已選擇的屬性值：

```vue
<script setup lang="ts">
...

// 當開啟下拉選單時，初始化已選擇的屬性值
watch(open, open => {
  if (open) {
    selectedAttributes.value = props.selectedAttributeItems.reduce<Record<number, number>>((acc, item) => {
      acc[item.product_attribute_id] = item.id
      return acc
    }, {})

    updateSelectedProductSpecification()
  }
})

// 當選擇的屬性值改變時，更新商品規格
watch(selectedAttributes, () => {
  updateSelectedProductSpecification()
}, { deep: true })

// 更新商品規格
function updateSelectedProductSpecification() {
  // 由選項組裝出商品規格 Key
  const combinationKey = Object.values(selectedAttributes.value)
    .sort((a, b) => a - b)
    .join('-')

  // 尋找符合的商品規格
  selectedSpecification.value = props.availableSpecifications.find(spec => spec.combination_key === combinationKey)
}
</script>
```
