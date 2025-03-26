# 下載資產

在開發網站時，如果沒有拿到完整的網頁模板，這時需要一個一個下載網頁的圖片、CSS、JS 資源，會非常地耗時。這時可以使用 `wget` 工具來下載整個網站的資源：

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https//example.com
```

解釋各個參數的含義：

* `--mirror`：使下載變為遞歸下載。
* `--convert-links`：將所有鏈接 (包括 CSS 樣式表等) 轉換為相對鏈接，適合離線瀏覽。
* `--adjust-extension`：根據內容類型為文件名添加合適的擴展名 (html 或 css)。
* `--page-requisites`：下載顯示頁面所需的 CSS 樣式表和圖像等資源，以便離線正確顯示頁面。
* `--no-parent`：遞歸下載時不會上升到父目錄，這對於限制下載網站的某個部分非常有用。
