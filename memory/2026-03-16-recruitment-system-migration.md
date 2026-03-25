# 2026-03-16 系統遷移 & 候選人評估進度

## 核心完成項

### ✅ 毛柏迪 (Bodi Mao) 招募完整流程
- **終判分數**: 95/100 A++ (宇泰華科技 PM 職位)
- **Phone screening**: 已執行，確認動機、技能、薪資期待
- **推薦信**: 已準備發送

### ✅ 5 名高質量候選人評估完成
1. **Jia-Hau Ching #69** - A++ 96/100 (AI Engineer, RAG/LLM/Multi-agent specialist, 台灣大哥大)
2. **Chun-Pei Cheng #72** - A++ 97/100 (Manager ML Engineering, Kafka/Spark 大數據, 13y 經驗, 美光)
3. **Guan-Lin Chen #93** - A++ 94/100 (Sr. Frontend Engineer, React/GraphQL, Yahoo Taiwan, 8y)
4. **PIN SHAN CHUANG #63** - A++ 97/100 (Senior ML Engineer, RAG/LLM/Azure AI, Wistron, 5y, 量化成果: 效率 ↑70%, $1.2M 節省)
5. **Pin-Huey Chiang #67** - A 81/100 (ML Engineer, 推薦系統/NLP/Airflow, Headquarter.ai, CTR ↑30%)

### ✅ 工作匹配結果
- **主力職位**: #215 Data Engineer - Generative AI Pipelines @ 宇泰華科技
  - PIN SHAN (#63) + Jia-Hau (#69): 完美匹配 (RAG/LLM 核心專長 + 雲端棧)
  - Pin-Huey (#67): 強烈符合 (Airflow/推薦系統角度)
  - Guan-Lin (#93): 過度資格/前端無適配職位 → #215 作為 stretch opportunity
  - Chun-Pei (#72): 過度資格 (Manager 等級) → 推薦 #176 Sr. BigData Engineer @ CMoney 替代

### ✅ 開發信模板完成
- **Jia-Hau Ching**: RAG + LLM 製造業應用領導力
- **Chun-Pei Cheng**: Spark/Kafka 分散式系統領導力 (建議走 CMoney #176)
- **PIN SHAN CHUANG**: RAG + LLM 製造業應用 (突出 Azure AI 專長)
- **Pin-Huey Chiang**: 推薦系統 + Airflow 經驗

### ✅ PostgreSQL 直連更新驗證
- Database: `localhost:5432/step1ne` (step1ne user, no password)
- 3 名候選人已直連更新：Jia-Hau, Chun-Pei, Guan-Lin
- 確認字段已同步到 DB: current_position, current_company, linkedin_url, work_history (JSONB), talent_level, stability_score
- **更新規則**: 必須包含 `updated_at = NOW()` 讓 API 層偵測變更

## 🔴 當前封鎖項

### 系統遷移驗證卡關 - 等待 API 金鑰
- **舊雲端 API Key**: `PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ`
  - 測試結果: `/api/candidates` 返回 HTTP 500 (本地系統認證失敗)
  - `/api/jobs` 返回 HTTP 200 ✅ (部分存取成功)
  
- **本地系統現況**:
  - API Base: `https://api-hr.step1ne.com` (外部) 或 `http://localhost:3003` (內網)
  - Frontend: `https://hrsystem.step1ne.com`
  - 健康檢查: ✅ `/api/health` 返回 `{ "status": "ok", "database": "connected" }`
  - Jobs 端點: ✅ `/api/jobs` 返回 200 with 50+ 職缺
  
- **需要 Phoebe 提供**:
  - 本地系統專用 API_SECRET_KEY / VITE_API_KEY
  - 用於驗證 PATCH/POST 操作到 `/api/candidates` 端點

## 📋 下一步行動 (等待)

1. **向 Phoebe 索取本地系統 API 金鑰** (高優先)
2. **驗證金鑰有效性** - `GET /api/candidates` with Bearer token
3. **Re-import 5 名候選人** - PATCH `/api/candidates/:id` 同步到本地系統
4. **執行開發信發送** (系統遷移驗證後)
   - Pin-Huey: Airflow/推薦系統角度
   - PIN SHAN + Jia-Hau: RAG/LLM/雲端棧角度
5. **監控 #215 職位進度** @ 宇泰華

## 📊 系統架構決定 (Phoebe 啟動)

- **雲端備份**: backendstep1ne.zeabur.app (已棄用，保留備份)
- **本地主系統**: Node.js + PostgreSQL + Vite frontend (https://api-hr.step1ne.com)
- **資料庫**: 37 張表，核心表 `candidates_pipeline` (88 欄)、`jobs_pipeline` (48 欄)
- **字段管理**: 必須含 `updated_at = NOW()` 讓 API 層同步

## 記住

- 5 名候選人已在 PostgreSQL 更新，待 API 驗證
- 開發信模板已準備，待發送
- 系統遷移 CRITICAL BLOCKER: API 金鑰
- 優先推薦順序: PIN SHAN (#63) = Jia-Hau (#69) > Pin-Huey (#67) > Guan-Lin (#93) > Chun-Pei (#72 走 CMoney)
