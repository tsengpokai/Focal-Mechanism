# P 波初動震源機制解互動 Demo v2

這是一個可直接部署到 GitHub Pages 的純前端互動網頁，用於展示如何由 azimuth、take-off angle、P 波初動上下動（+ / −）推敲震源機制解。

## v2 修正內容

1. 修正參考圖片無法顯示的問題：所有網頁需要的檔案都改放在 repository 根目錄，避免 `assets/` 或 `data/` 路徑沒有一起上傳造成破圖。
2. 新增 `hand_drawn_mechanism.jpeg`，在網頁中標示為「手繪震源機制解」。
3. 新增 take-off angle 修正互動練習，可即時看到 take-off angle 超過 90° 時如何修正。
4. 新增原理動畫，用 step-by-step 方式解釋 P 波初動、下半球投影、黑白象限與節面。
5. 改良 P 波初動偵探小遊戲：可在圖上點選 4 個點畫出兩條自己猜測的節面，並新增提示按鈕。
6. P25 Demo 新增逐點播放測站功能，方便展示每個測站如何被投影到震源球上。

## 建議上傳到 GitHub 的檔案

請把下列檔案全部放在 repository 根目錄：

- `index.html`
- `style.css`
- `app.js`
- `P25_first_motion_used.csv`
- `p25_focal_mechanism_reference.png`
- `hand_drawn_mechanism.jpeg`
- `games.py`（參考用，GitHub Pages 不會執行 Python）
- `README.md`

## GitHub Pages 部署

1. 進入 GitHub repository。
2. 上傳上面所有檔案到根目錄。
3. 到 Settings → Pages。
4. Source 選 Deploy from a branch。
5. Branch 選 main，Folder 選 `/root`。
6. 儲存後等待 1–3 分鐘。

GitHub Pages 對檔名大小寫敏感，請確認圖片檔名與 HTML 中完全一致：

```html
p25_focal_mechanism_reference.png
hand_drawn_mechanism.jpeg
```
