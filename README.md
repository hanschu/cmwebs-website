# CMWebs 官網 V1

可直接部署的靜態網站，已整合：

- 主網站與完整首頁文案
- 功能、使用流程、方案與常見問題
- CM 房東工具箱與 5 個可操作工具
- 地址風險自評、租屋風險中心、信用評分概念頁
- 4 篇 SEO 房東指南
- 每頁獨立 title、description、canonical、Open Graph
- Organization、SoftwareApplication 與 FAQ 結構化資料
- sitemap.xml、robots.txt、manifest、404
- 官方 LINE：@cmwebs

## 部署到 GitHub Pages

1. 建立 GitHub repository。
2. 上傳本資料夾的所有檔案，`index.html` 必須在 repository 根目錄。
3. Settings → Pages → Deploy from a branch → main / root。
4. Custom domain 填入 `cmwebs.com`。
5. 到網域 DNS 依 GitHub 提示設定紀錄。

## 部署到 Cloudflare Pages（較推薦）

1. 將本資料夾推送到 GitHub。
2. Cloudflare Pages → Connect to Git。
3. Framework preset 選 `None`。
4. Build command 留空；Output directory 填 `/` 或 repository root。
5. 綁定 `cmwebs.com` 與 `www.cmwebs.com`。

## 上線前必改

- 確認 LINE 連結 `https://line.me/R/ti/p/@cmwebs` 可正常開啟。
- 確認「30 天免費體驗」與正式方案文案符合實際營運。
- 正式啟用追蹤碼、表單或資料庫前，更新隱私權政策。
- 將 Search Console 驗證碼加入首頁 head。
- 若 www 為主要網域，統一 canonical 與 301 轉址。
