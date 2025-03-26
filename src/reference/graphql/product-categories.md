# productCategories

取得多個商品分類資料，僅限根節點分類：

::: code-group

```graphql [GraphQL]
query {
  productCategories(root_only: true) {
    id
    title
  }
}
```

```json [回傳]
{
  "data": {
    "productCategories": [
      {
        "id": 1,
        "title": "產品"
      },
      {
        "id": 2,
        "title": "服務"
      }
    ]
  }
}
```

:::

取得多個商品分類資料，僅限根節點分類，包含最多3層子分類：

::: code-group

```graphql [GraphQL]
query {
  productCategories(root_only: true) {
    id
    title
    children {
      id
      title
      children {
        id
        title
        children {
          id
          title
        }
      }
    }
  }
}
```

```json [回傳]
{
  "data": {
    "productCategories": [
      {
        "id": 1,
        "title": "產品",
        "children": []
      },
      {
        "id": 2,
        "title": "服務",
        "children": [
          {
            "id": 11,
            "title": "基礎安裝",
            "children": []
          }
        ]
      }
    ]
  }
}
```

:::

取得多個商品分類資料，包含所有子分類：

::: code-group

```graphql [GraphQL]
query {
  productCategories(root_only: false) {
    id
    title
  }
}
```

```json [回傳]
{
  "data": {
    "productCategories": [
      {
        "id": 1,
        "title": "產品"
      },
      {
        "id": 2,
        "title": "服務"
      },
      {
        "id": 11,
        "title": "基礎安裝"
      }
    ]
  }
}
```

:::
