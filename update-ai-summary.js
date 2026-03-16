const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'step1ne',
  user: 'step1ne'
});

const candidateId = 72;
const aiGrade = 'A++';
const aiScore = 97;
const aiSummary = `【Manager Level BigData Architect】
13年Kafka/Spark深度,Micron Manager背景。

✅ 5大核心優勢:
1. 技術深度: Kafka/Spark架構師級別(13yr實務)
2. 系統設計: 分散式系統、大數據管道優化能力頂尖
3. 管理經驗: Manager ML Engineering @ Micron, 帶隊3yr
4. 公司背景: Micron Taiwan (半導體龍頭)
5. 適應能力: 跨IC設計、製程工程、軟體基礎設施

📊 職位匹配度分析:
- ✅ 推薦#176 CMoney Sr.BigData (250萬): 完美匹配96/100
  → Kafka/Spark完全對應 | 年資職級完全符合 | 250萬符合Manager期待 | Tech Lead升遷路徑
- ❌ 不推薦#215宇泰華Data Engineer: 過度資格
  → IC vs Manager (降級) | Python/Airflow (非最適) | 薪資差120萬 | 6m內高流失率

💡 推薦策略:
- 開發信: 強調Kafka/Spark稀缺性, 隱喻CMoney無層級優勢(Manager背景值錢)
- 電話篩選: 確認職涯方向(推力vs拉力), 驗證Tech Lead路徑接受度
- 快速流程: Manager級競爭激烈, 2週內完成所有面試

📈 成功預測: 65-70% (穩定性強, 無job-hopping信號, 完美職位匹配)

🔴 優先度: HIGH - A++97分稀缺人才, 需快速推進CMoney#176`;

async function updateAISummary() {
  try {
    const query = `
      UPDATE candidates_pipeline 
      SET 
        ai_grade = $1,
        ai_score = $2,
        ai_summary = $3,
        updated_at = NOW()
      WHERE candidate_id = $4
      RETURNING candidate_id, name, ai_grade, ai_score;
    `;

    const result = await pool.query(query, [aiGrade, aiScore, aiSummary, candidateId]);
    
    if (result.rowCount === 0) {
      console.error(`❌ Candidate #${candidateId} not found`);
      process.exit(1);
    }

    console.log(`✅ AI Summary Updated for #${candidateId}:`);
    console.log(`   Name: ${result.rows[0].name}`);
    console.log(`   Grade: ${result.rows[0].ai_grade}`);
    console.log(`   Score: ${result.rows[0].ai_score}`);
    console.log(`   Summary Length: ${aiSummary.length} chars`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

updateAISummary();
