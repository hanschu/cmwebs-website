# CMWebs V1 Sitemap 與 SEO 規格

## 核心定位

**CMWebs 是建立在 LINE 上的智能租管系統。**

核心價值：免下載 App、免學習新軟體、免更換銀行收款方式，將租金帳單、後五碼對帳、催繳、租約到期、線上續約與報表集中管理。

## URL 架構

- `/` 主成交頁
- `/features/` 完整功能
- `/how-it-works/` 導入與收租流程
- `/pricing/` 30 天免費體驗與方案洽詢
- `/tools/` 房東工具箱
- `/address-risk/` 地址風險自評
- `/rental-risk/` 租屋風險中心
- `/credit-score/` 信用評分概念
- `/guides/*` SEO 房東指南
- `/faq/` FAQ 與 FAQPage schema
- `/privacy/`、`/terms/` 信任與合規頁

## 首頁主關鍵字

租管系統、租賃管理系統、房東管理系統、LINE 租管系統、租金管理系統、房東收租系統。

## 內容策略

1. 工具型關鍵字：投報率、收據、催租、點交、租約檢查。
2. 問題型關鍵字：房客欠租、租金對帳、租約到期、退租點交。
3. 產品型關鍵字：LINE 租管、房東管理系統、自動收租。
4. 風險型關鍵字：地址風險、租屋風險、租屋信用評分。

## Next.js 遷移建議

未來需要登入、資料庫、API 或後台時，再移轉到 Next.js App Router：

```
app/
  page.tsx
  features/page.tsx
  how-it-works/page.tsx
  pricing/page.tsx
  tools/page.tsx
  tools/[slug]/page.tsx
  address-risk/page.tsx
  rental-risk/page.tsx
  credit-score/page.tsx
  guides/[slug]/page.tsx
  sitemap.ts
  robots.ts
components/
lib/
public/
```

第一版靜態網站可先快速部署並驗證流量；需要會員與資料功能時再遷移，能避免過早增加開發與維護成本。
