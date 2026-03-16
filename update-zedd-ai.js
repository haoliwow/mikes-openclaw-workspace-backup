#!/usr/bin/env node

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

const aiSummary = {
  one_liner: "9年資深軟體工程師，Web3/Blockchain專家，AWS/GCP大型基礎設施優化實戰",
  grade: "A",
  tier: "T2",
  score: 88,
  confidence: 92,
  strengths: [
    "9年軟體工程經驗",
    "Web3/Blockchain技術專家（Solidity, Smart Contracts）",
    "AWS/GCP大型基礎設施優化（1B+ daily requests）",
    "系統架構與微服務設計能力",
    "領導多個技術團隊成功交付複雜專案"
  ],
  risks: [
    "過去3年有2次轉職，穩定度略高風險",
    "期望薪資可能偏高"
  ],
  top_matches: [
    {
      job_id: 16,
      company: "台灣遊戲橘子",
      title: "雲端維運工程師 (需 on-call)",
      score: 88,
      reason: "K8s/Docker/監控體系完整，AWS on-call經驗豐富，技術能力遠超職缺需求"
    },
    {
      job_id: 46,
      company: "創樂科技",
      title: "資深 SRE / DevOps 工程師",
      score: 85,
      reason: "系統可靠性與架構優化核心經驗"
    }
  ],
  suggested_questions: [
    "Circle的Web3支付系統中，多鏈整合的最大挑戰是什麼？",
    "GCP微服務成本優化30%的具體做法？",
    "NFT專案的gas優化如何實現？",
    "為什麼從Circle轉向我們的機房維運職位？"
  ],
  next_steps: "立即推薦進電話篩選或技術面試"
};

(async () => {
  try {
    const result = await pool.query(`
      UPDATE candidates_pipeline SET
        ai_grade = $1,
        ai_score = $2,
        ai_summary = $3::jsonb,
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, ai_grade, ai_score
    `, [
      'A',
      88,
      JSON.stringify(aiSummary),
      1890
    ]);

    console.log('✅ Zedd Pai AI 欄位更新完成：');
    console.log(JSON.stringify(result.rows[0], null, 2));
    process.exit(0);
  } catch (e) {
    console.error('❌ 錯誤：', e.message);
    process.exit(1);
  }
})();
