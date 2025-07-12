# 表單驗證

介紹如何處理前端和後端的表單驗證，確保用戶輸入的數據符合預期格式和要求。

::: tip
表單驗證功能在 `@stephenchenorg/astro` v4.0 版本開始才支援，請確保已將套件版本已更新到 v4.0 或以上。
:::

## Vue 表單驗證範例

首先需要先準備表單，先在表單外層使用 `<FormValidatorProvider>` 元件包裹，這個元件會提供 `formValidator` 物件來進行表單驗證，以及可以使用 `errors` 屬性來傳入後端驗證錯誤：

```vue
<template>
  <FormValidatorProvider ref="formValidatorProvider" :errors>
    <form @submit="handleSubmit">
      ...
    </form>
  </FormValidatorProvider>
</template>

<script setup lang="ts">
import type { FormErrors, FormValidatorProviderExposed } from '@stephenchenorg/astro/form-validator'
import { FormValidatorProvider } from '@stephenchenorg/astro/form-validator'
import { useTemplateRef } from 'vue'

const props = withDefaults(defineProps<{
  errors?: FormErrors
}>(), {
  errors: () => ({}),
})

const formValidatorProvider = useTemplateRef<FormValidatorProviderExposed>('formValidatorProvider')

function handleSubmit(event: Event) {
  const formValidator = formValidatorProvider.value!.formValidator()
  if (!formValidator.validate(form)) {
    event.preventDefault()
    return
  }

  // 如果驗證通過，可以在這裡處理表單提交
}
</script>
```

`errors` 屬性可以用來傳入後端驗證錯誤，可以解析 Laravel 的驗證錯誤格式：

```json
{
  "name": ["姓名為必填欄位", "姓名不能超過 50 個字"],
  "email": ["電子郵件格式不正確"],
  "files": ["檔案大小不能超過 2MB"]
}
```

然後就可以使用 `<FormField>` 元件來包裹每個表單欄位，定義欄位 ID 和欄位驗證規則，以及使用 `v-slot` 來取得欄位的錯誤訊息：

```vue {5-16,23}
<template>
  <FormValidatorProvider ref="formValidatorProvider" :errors>
    <form @submit="handleSubmit">

      <FormField
        id="name"
        v-slot="{ error }"
        :rules="[
          { validate: (value: string) => value.trim() !== '', message: '姓名為必填欄位' },
          { validate: (value: string) => value.length <= 50, message: '姓名不能超過 50 個字' },
        ]"
      >
        <label for="name">姓名</label>
        <input type="text" name="name" id="name" />
        <span v-if="error">{{ error }}</span>
      </FormField>

    </form>
  </FormValidatorProvider>
</template>

<script setup lang="ts">
import { FormField } from '@stephenchenorg/astro/form-validator'
</script>
```

## 包裝表單欄位

如果需要重複使用表單欄位，可以將欄位包裝成一個元件，這樣可以更方便地管理欄位驗證規則和錯誤訊息。比如可以包裝一個 `<FormTextField>` 元件：

```vue
<template>
  <FormField
    :id
    v-slot="{ error }"
    :rules
  >
    <div>
      <label :for="id">{{ label }}</label>
      <input
        :id
        :name="id"
        type="text"
        v-model="modelValue"
        v-bind="$attrs"
      >
      <span v-if="error">{{ error }}</span>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import { FormField } from '@stephenchenorg/astro/form-validator'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  id: string
  label: string
}>()

const modelValue = defineModel<string>({
  type: String,
  default: '',
})
</script>
```

然後在表單中使用這個元件：

```vue {5-13,20}
<template>
  <FormValidatorProvider ref="formValidatorProvider" :errors>
    <form @submit="handleSubmit">

      <FormTextField
        id="name"
        v-model="form.name"
        label="姓名"
        :rules="[
          { validate: (value: string) => value.trim() !== '', message: '姓名為必填欄位' },
          { validate: (value: string) => value.length <= 50, message: '姓名不能超過 50 個字' },
        ]"
      />

    </form>
  </FormValidatorProvider>
</template>

<script setup lang="ts">
import FormTextField from '@/components/FormTextField.vue'
</script>
```
