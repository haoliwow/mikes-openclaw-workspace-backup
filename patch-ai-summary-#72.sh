#!/bin/bash

CANDIDATE_ID=72
API_BASE="https://api-hr.step1ne.com"
API_KEY="PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ"

# 構建 ai_summary JSON
AI_SUMMARY=$(cat <<'EOF'
{
  "grade": "A",
  "score": 97,
  "one_liner": "Manager Level BigData Architect: 13yr Kafka/Spark深度, Micron背景",
  "strengths": [
    "技術深度: Kafka/Spark架構師級別(13yr實務)",
    "系統設計: 分散式系統、大數據管道優化能力頂尖",
    "管理經驗: Manager ML Engineering @ Micron, 帶隊3yr",
    "公司背景: Micron Taiwan (半導體龍頭)",
    "穩定性: 13年深度專業, 無job-hopping信號"
  ],
  "risks": [
    "期待薪資較高 (250萬+), 市場薪資敏感",
    "Manager級人才易被大公司搶, 需快速流程"
  ],
  "next_steps": "推薦CMoney #176 Sr.BigData Engineer (250萬/yr, Tech Lead升遷路). 開發信強調Kafka/Spark稀缺性. 20分鐘電話篩選驗證職涯方向 (推力vs拉力). 預期成功率65-70%.",
  "evaluated_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "evaluated_by": "Claude AI / Mike (Phoebe's Recruiter)"
}
EOF
)

# PATCH 請求
curl -s -X PATCH "$API_BASE/api/candidates/$CANDIDATE_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"talent_level\": \"A\",
    \"ai_grade\": \"A\",
    \"ai_score\": 97,
    \"ai_recommendation\": \"強烈推薦 → CMoney #176 Sr.BigData Engineer\",
    \"ai_report\": \"Manager級Kafka/Spark架構師, 13yr實務背景. 過度資格#215 (IC職位), 完美匹配#176 (Manager→Sr.Engineer橫向轉移+Tech Lead升遷路, 250萬薪資符合期待).\",
    \"ai_summary\": $AI_SUMMARY
  }" | python3 -m json.tool

echo ""
echo "✅ PATCH 請求已發送"
echo "   Candidate: #$CANDIDATE_ID"
echo "   Endpoint: $API_BASE/api/candidates/$CANDIDATE_ID"
