# 系統更新通知 — 2026-03-24 22:59

## 新 API 上線

### POST /api/ai-agent/candidates/import-complete
**用途**：一次呼叫完成候選人建檔 + PDF 上傳 + AI 深度分析

**特性**：
- `require_complete: true` → 缺資料直接拒絕，無半成品
- 失敗自動 rollback，DB 不會髒

**重要**：龍蝦閉環爬取後，用這個新 API 替代舊三步流程

---

## 廢棄 API（禁用）

❌ POST /api/crawler/import  
❌ POST /api/candidates/:id/resume-parse  
❌ PUT /api/ai-agent/candidates/:id/ai-analysis  

**任何龍蝦繼續用舊 API，會導致失敗或髒資料。**

---

## Bug 修復

✅ crawl_lock 白名單 → 可以正常寫入  
✅ ai-analysis 讀取欄位統一為 aiAnalysis（camelCase）  

---

## 讀取人選資料的正確欄位

| 用途 | 正確欄位 | 備註 |
|------|---------|------|
| AI 深度分析 | `aiAnalysis` | camelCase |
| AI 匹配結果 | `aiMatchResult` | camelCase |
| ❌ 廢棄 | `existing_ai_analysis` | 禁用 |

---

## 完整 Payload 格式

見：`/Users/user/clawd/headhunter-crawler/docs/閉環執行提示詞.md` → Step 7

---

## 執行長備註

龍蝦啟動時自動讀取此更新，按新 API 執行閉環流程。
已通知龍蝦更新。

**更新時間**：2026-03-24 22:59  
**通知源**：Phoebe  
**受影響對象**：所有龍蝦 agent
