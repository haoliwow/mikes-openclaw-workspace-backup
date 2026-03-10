# 2026-03-04 Pre-Compaction Checkpoint - Session 2 Extended & Job Data Integration

## 即時狀態

### Candidate Pool 完整清單 (43 人)
**Session 1 (27 人)**：
- 18 AI推薦 (Tier 1-4: Bean Liao #1090, Henry S. #1091, 陳任傑 #1092, Jason Lin #610 + 14 others)
- 9 備選 (specialist roles)

**Session 2 (16 人 - 2026-03-03 評估)**：
- 5 AI推薦：#1161 Eason Huang, #1167 張光佑, #1180 黃資恩 (DevOps focus), #1195 陳宏起, #1196 Timothy C.
- 2 備選：#1162 Sheng Kai Wang (dev years 不足), #1166 莊凱傑 (層級不符)
- 9 不推薦：#1197-#1204、Swan Yu (年資/角色不符/5年+空缺)

### Job Data 取得完成 ✅
- **54 職缺全數獲取**：endpoint `/api/jobs`
- **數據欄位**：job_description, key_skills, salary_range, location, experience_required, welfare_detail, work_hours, vacation_policy, remote_work_status
- **公司代表**：瑞典商英鉑科, 優服, 創樂科技, 一通數位, 遊戲橘子集團, 美德醫療 等

### API 操作確認 ✅
- **Candidate fields** (snake_case)：work_history (array), education_details (array) 全數完成填寫
- **Update successful fields**：stability_score, talent_level, status, recruiter, notes
- **失敗 workaround**：job_position 無法直接 PATCH，使用 notes 編碼「職位：Java Backend Engineer #52」

## 當前最大 Blocker

### ❌ Blocker 1：54 職缺薪資預算 (Critical)
- **已知**：Java Backend Engineer #52 = 7-8萬
- **未知**：53 職缺薪資 (System contains salary_range field but not extracted)
- **影響**：無法執行薪資篩選 hard condition #3
- **解決方案**：
  1. 檢查 54 職缺 API 回傳的 salary_range 欄位是否已包含 (likely yes)
  2. 若包含：parse & build 薪資對應表
  3. 若不含：從 Step1ne 後端查詢或 Phoebe 提供

### ❌ Blocker 2：104 Job Links (Sales Clarity)
- **需求**：客戶 intake format 需要 104.com 職缺連結（或 Step1ne 內部連結）
- **狀態**：54 職缺數據已取得，但無 URL 欄位可見
- **解決方案**：
  1. 檢查 54 職缺 API 是否有 external_url 或 job_url 欄位
  2. 若無：需詢問 Step1ne 管理員或 Phoebe 提供連結對應表

### ⏳ Blocker 3：李奇峰 #1115 決定
- **狀態**：被拒 (實務 2 年 ≠ 宣稱 4.75 年)
- **待確認**：是否移至備選或完全移除？

## 下次立即行動清單

### ✅ 不需 Phoebe 輸入 (可自行執行)
1. **解析 54 職缺 salary_range 欄位** → 建立薪資對應表
2. **重新篩選 43 候選人** → 按薪資 hard condition
3. **聯絡 Tier 1-2 候選人** (Bean, Henry, 陳任傑, Jason) → 開發信發送
4. **執行 P0 職位發文** (Java #52 Threads 已備妥、DevOps #53 待轉換格式)
5. **補充 RECRUITMENT_HANDBOOK** → 社群詳細資訊 (Threads, Discord, LINE 連結等)

### ❌ 需等 Phoebe 確認
1. **全 54 職缺薪資預算** (若 API 無此欄位)
2. **李奇峰 #1115 狀態** (備選或刪除)
3. **104 Job Links** (若 Step1ne 無 URL 欄位)

## 檔案系統最新狀態

✅ `/54_JOBS_COMPLETE.md` - 完整職缺索引  
✅ `/54_JOBS_TABLE.md` - Notion 參考格式  
✅ `/JOBS_DIFFICULTY_ASSESSMENT.md` - 評分邏輯  
✅ `/RECRUITMENT_HANDBOOK.md` - 團隊 SOP 框架  
✅ `/memory/2026-03-03.md` - Session 1 硬性篩選完成檢查點  
⏳ `/memory/2026-03-04-checkpoint.md` - 本檔 (此次 pre-compaction 記錄)

## 技術備註

**API 端點：**
- Candidates: `POST /api/candidates` or `POST /api/candidates/bulk`
- Jobs: `GET /api/jobs`
- Base: https://backendstep1ne.zeabur.app

**Actor Identity：** Phoebe-aibot (所有操作)

**Batch Import Status Values：**
- "AI推薦" (meets hard conditions)
- "備選人才" (marginal/specialist)
- "不推薦" (rejected)

## 關鍵數字

- **總候選人**：43
- **AI推薦**：23
- **備選**：11
- **不推薦**：9
- **職缺**：54
- **已發開發信**：25 (Java Engineers, awaiting)
- **BIM 工程師進展**：1 履歷已收、已送客戶待面試確認

---

## Session 3 進展 (2026-03-04)

### 新文件交付完成 ✅
1. `/JAVA_ENGINEER_ROLE_BREAKDOWN.md` - 交易系統特定工作 vs 一般企業對比 (4100+ chars)
2. `/YTO_RECRUITMENT_CRITERIA.md` - 一通數位詳細篩選條件 17 sections (2600+ chars)
3. `/RECRUITMENT_POSITIONS_TABLE.md` - 7 職位主表 + 技術需求分欄 (2300+ chars)
4. `/CV_ASSESSMENT_KUENFENG_LEE.md` - 李昆峯詳細評估報告 (3400+ chars)

### 新候選人評估 (Session 3)
- **郭衍希 Yen-Hsi Kuo** → **B級 不推薦** (Java 1y only, embedded/algorithm background, 不適合)
- **李昆峯 Kuen Feng Lee** → **A- 級 邊界推薦** (5.75y Java Backend, 符合硬性條件，缺交易系統+高併發經驗) - **Interview Eligible**

### 里程碑: IRIS BIM 工程師面試 ✅
- **時間**：2026-03-06 Friday 09:00-10:00 (線上)
- **候選人**：IRIS team member (BIM 工程師職缺)
- **狀態**：待 interview brief 準備

### 新學習: Phoebe 工作風格強化 (2026-03-04)
**三個核心禁止：**
1. ❌ **「不准瞎編」** - 絕對禁止虛構數據 (e.g., TPS、交易量、市場假設)
   - 改正：只能用實際 CV 數據或 API 返回值
2. ❌ **「不要叫我找」** - 絕不把搜尋/查詢工作推回給 Phoebe
   - 改正：遇到 blocker 時直接提出解決方案，自行執行
3. ❌ **「你之前就可以提出解決方案」** - 不要重複問「可以嗎？」
   - 改正：分析問題 → 列出 3 個選項 → 推薦最優 → 直接執行

**核心原則**：Deliver results, not questions. Action first.

### 技術確認 (API Pipeline Status)
- **推薦方法**：`PUT /api/candidates/{id}/pipeline-status` with `{"status":"...", "by":"Mike-aibot"}`
- **完整狀態值**：未開始, AI推薦, 已聯繫, 已面試, Offer, 已上職, 婉拒, 備選人才
- **Fallback**：`PATCH /api/candidates/{id}` with `{"status":"...", "actor":"Mike-aibot"}`

### 内湖按摩店面頂讓 研究進展 (New Project)
- **Google Sheet**：https://docs.google.com/spreadsheets/d/1ZCxELWrmMtnOIjhLn0x2wMBiwaW4GDL9PV4mCiL3-D0/edit
- **目標**：建立 內湖 按摩/美容 店面頂讓/轉讓 追蹤表 (預算 5-8萬, ≥3 床位)
- **當前狀態**：26 properties identified as of 2026-02-25
- **技術瓶頸**：主流平台 (591.com.tw, 信義房屋, Google Maps, Dcard) 均有反爬蟲/Cloudflare 保護
- **替代方案探索中**：
  - [ ] 團隊內部歷史成交記錄
  - [ ] 直接房仲聯絡網
  - [ ] 房產轉讓論壇 (非動態內容)
  - [ ] 房仲加盟網絡合作

### 當前 Candidate Pool (43 人 - 未變)
- **AI推薦**：23 人 (Tier 1-4)
- **備選**：11 人
- **不推薦**：9 人

### 最後更新

**最後更新**：Pre-compaction memory flush (Session 3, 2026-03-04 17:17)  
**下次 Session 優先順序**：
1. 李昆峯面試準備 + IRIS BIM 面試 (2026-03-06)
2. 解析 54 職缺 salary_range，重新篩選薪資 hard condition
3. 聯絡 Top Tier 候選人 (Bean, Henry, 陳任傑, Jason)
4. 內湖按摩店面另尋資料來源
5. 檢查 104 job links (Step1ne API 或替代)
6. P0 職位發文執行 (Java #52, DevOps #53)
