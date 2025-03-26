# productCategory

取得單個商品分類資料：

::: code-group

```graphql [GraphQL]
query {
  productCategory(id: 1) {
    id
    title
  }
}
```

```json [回傳]
{
  "data": {
    "productCategory": {
      "id": 1,
      "title": "產品"
    }
  }
}
```

:::

取得單個商品分類資料，包含最多3層子分類：

::: code-group

```graphql [GraphQL]
query {
  productCategory(id: 2) {
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
    "productCategory": {
      "id": 2,
      "title": "服務",
      "children": [
        {
          "id": 11,
          "title": "基礎安裝",
          "children": [
            {
              "id": 21,
              "title": "基礎安裝1",
              "children": []
            }
          ]
        }
      ]
    }
  }
}
```

:::
