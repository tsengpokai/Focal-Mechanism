# P 波初動震源機制解互動 Demo

這是一個可直接部署到 GitHub Pages 的純前端互動網頁，用來展示如何用：

- Azimuth
- Take-off angle
- P 波初動上下動（+ / −）

推敲地震震源機制解。

## 網頁功能

1. **P25 範例資料互動投影**
   - 內建 P25 first-motion CSV 範例。
   - 可貼上 P25 原始文字或 CSV 格式資料。
   - 自動整理 station、distance、azimuth、take-off angle、polarity。
   - 沒有 + / − 初動的測站會自動忽略。

2. **Take-off angle 修正教學**
   - 若 take-off angle > 90°：

     ```text
     takeoff' = 180° - takeoff
     azimuth' = azimuth - 180°
     再把 azimuth' 調回 0°–360°
     ```

   - 表格會標出哪些測站經過 180° 修正。

3. **下半球等面積投影**
   - + upward 畫成黑色實心點。
   - − downward 畫成白色空心點。
   - 可開關測站名、理論黑白象限、不符合測站紅叉。

4. **震源機制搜尋**
   - 使用 strike / dip / rake 三個滑桿即時更新 fit。
   - 可按「自動搜尋最佳解」做 coarse grid + local refine。
   - 可按「套用本作業解」載入參考解：Strike=102°，Dip=30°，Rake=-11°。

5. **P 波初動偵探小遊戲**
   - 改寫自附件 `games.py` 的互動概念。
   - seed 會產生不同題型：低角度逆衝、逆斷層、正斷層、斜移斷層、左移與右移走向滑移。
   - 可先猜斷層型態，再顯示正解海灘球。

## 部署到 GitHub Pages

1. 在 GitHub 建立新 repository，例如：`p-first-motion-demo`。
2. 把本資料夾內所有檔案上傳到 repository 根目錄。
3. 到 repository 的 **Settings → Pages**。
4. Source 選擇：`Deploy from a branch`。
5. Branch 選擇：`main`，Folder 選擇：`/root`。
6. 儲存後等待 GitHub 產生網址。

## 檔案結構

```text
p_first_motion_github_demo/
├── index.html
├── style.css
├── app.js
├── assets/
│   └── p25_focal_mechanism_reference.png
├── data/
│   └── P25_first_motion_used.csv
├── reference/
│   └── games.py
└── README.md
```

## 備註

這個版本是純 HTML/CSS/JavaScript，不需要 Python 後端，因此最適合 GitHub Pages。`reference/games.py` 保留原始附件概念作為參考，但 GitHub Pages 不會執行 Python。
