# Step1ne 候選人匯入正確格式

## ✅ 正確欄位名 vs ❌ 常見錯誤

| ✅ 正確欄位名 | ❌ 常見錯誤 | 說明 |
|-------------|-----------|------|
| `recruiter` | `consultant` | ⚠️ 這個最常踩 |
| `total_years` | `years_of_experience` | 年資欄位 |
| `work_history` | 純文字 | **必須是 JSON 陣列格式** |

---

## 📋 work_history 格式範例

```json
[
  {
    "start": "2019-03",
    "end": "present",
    "title": "職稱",
    "company": "公司名",
    "description": "工作描述",
    "duration_months": 73
  }
]
```

---

## 🔴 必填欄位（缺一不可）

- `name` - 姓名
- `location` - 地點
- `current_position` - 現職職位
- `total_years` - 總年資
- `skills` - 技能（逗號分隔）
- `source` - 來源（LinkedIn/GitHub/Email/推薦等）
- `status` - 狀態（未開始/聯繫階段/面試階段等）
- `recruiter` - 獵頭（通常填 Phoebe/Phoebe）

---

## ⚠️ 調試建議

如果匯入失敗，請把**完整錯誤訊息截圖**提供，會更快診斷問題。

---

**來源**：Phoebe 提供 (2026-03-16)  
**重要性**：⭐️⭐️⭐️ 高
