const https = require('https');

const STEP1NE_BEARER = 'PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ';
const STEP1NE_API = 'https://api-hr.step1ne.com';

function httpsPatch(url, data, options = {}) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);
    
    const urlObj = new URL(url);
    const req = https.request(urlObj, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData),
        'Authorization': `Bearer ${STEP1NE_BEARER}`,
        ...options.headers
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    req.write(jsonData);
    req.end();
  });
}

async function updateCandidate() {
  console.log('📤 準備更新 Scott Lin (#1208) 的 AI 評估結果...\n');
  
  const aiSummary = {
    one_liner: "10年資深後端架構師，Golang專家，精通99.98%高可用性分散式系統設計，市場稀缺度⭐⭐⭐⭐⭐",
    top_matches: [
      {
        job_id: 218,
        job_title: "Backend Engineer (Golang)",
        company: "新創科技",
        match_score: 98,
        match_reason: "Golang核心技能完全符合，10年資深，年資超額達成",
        gaps: "缺乏明確DDD實踐證據，建議電話驗證",
        submission_check: "✅ Golang經驗超額 / ✅ Microservices符合 / ✅ 學士學歷符合 / ⚠️ DDD需驗證",
        interview_stages: 3
      },
      {
        job_id: 219,
        job_title: "SRE (Site Reliability Engineer)",
        company: "新創科技",
        match_score: 96,
        match_reason: "GCP/K8s深度，99.98%高可用性經驗完全符合",
        gaps: "SRE非主力職務，Prometheus經驗需確認，On-call意願需確認",
        submission_check: "✅ K8s/GCP符合 / ⚠️ Prometheus未明確列出 / ⚠️ On-call經驗未記載",
        interview_stages: 3
      },
      {
        job_id: 217,
        job_title: "Playsee Senior Backend Engineer",
        company: "Playsee",
        match_score: 78,
        match_reason: "10年後端經驗，支付系統與API設計能力強",
        gaps: "薪資風險極高(年薪180萬=月薪15k，遠低於期望120-150k)，缺乏明確QPS優化案例，MySQL深度不明",
        submission_check: "✅ 後端年資超額 / ✅ API開發符合 / ⚠️ 高併發QPS未提及 / 🔴 薪資異常(建議確認)",
        interview_stages: 3
      }
    ],
    strengths: [
      "Golang專家級深度(⭐⭐⭐⭐⭐) — 現職Golang Engineer，DNS架構重設計PowerDNS→CoreDNS/Golang",
      "分散式系統與高可用性架構設計(⭐⭐⭐⭐⭐) — VoiceTube 99.42%→99.98%實績，Mlytics多CDN整合",
      "雲端原生技術棧全覆蓋(⭐⭐⭐⭐⭐) — AWS/GCP/GKE/Docker/Microservices/CI-CD完整",
      "複雜系統整合與支付系統經驗(⭐⭐⭐⭐) — Google Play/App Store/Stripe/NewebPay整合",
      "監控告警與效能優化(⭐⭐⭐⭐) — Grafana+Loki整合，Redis效能優化"
    ],
    risks: [
      "穩定度70%(中等) — 平均任期2.5年，但現職Mlytics 3.5年趨於穩定，轉職原因需電話確認",
      "職缺#217薪資風險極高(🔴) — 年薪180萬≈月薪15k遠低於期望120-150k，拒絕率>95%",
      "缺乏明確QPS/TPS優化案例(中) — VoiceTube 99.98% uptime隱含高流量，但具體數字未提及(關鍵驗證點)",
      "能力缺口可短期補足 — MySQL/PostgreSQL深度、Kafka經驗、DDD實踐均可2-4週內補足"
    ],
    salary_risk: "期望薪資未填(推斷120-150k/月)，職缺#218#219月薪180k符合預期。職缺#217年薪180萬(月薪15k)遠低於期望，風險極高。顧問務必先確認#217薪資資訊是否有誤。",
    stability_risk: "穩定度70%(中等)，平均任期2.5年。但現職Mlytics 3.5年趨於穩定，表示正朝更穩定方向發展。建議電話確認：(1)為什麼平均任期只有2.5年(2)Mlytics目前的滿意度與轉職動機。",
    deep_insight: null,
    suggested_questions: [
      "Golang技能驗證：你在Mlytics設計的DNS架構從PowerDNS→CoreDNS/Golang，新系統的性能提升具體是多少(QPS/延遲)？在多CDN整合中如何處理不同供商的API差異與容錯機制？",
      "高可用性深度詢問：VoiceTube將uptime從99.42%→99.98%，當時的主要故障瓶頸是什麼？具體採取了哪些架構改進？日活用戶與每秒請求量(QPS)大約多少？",
      "轉職動機與薪資：你在Mlytics已3.5年，現在為什麼想轉職？對下一份工作的薪資期望範圍是多少？是否開放remote工作？",
      "穩定性探索：過去10年換過4份工作，平均2.5年一換，這些轉職都是主動辭職嗎？是否曾因薪資或公司重組而離職？Mlytics最滿意和不滿意的地方是什麼？",
      "技術深度確認：履歷中未明確提及Kafka/消息隊列、MySQL性能調優、Prometheus經驗，這些領域有接觸過嗎？"
    ],
    next_steps: "優先推進職缺#218(Backend Engineer Golang，98/100 S級)，24-48h內電話篩選Scott，重點驗證VoiceTube日活/QPS數字與轉職動機，若通過立即邀請面試；職缺#217需先確認薪資誤差後再評估；職缺#219備選。",
    evaluated_at: new Date().toISOString(),
    evaluated_by: "Claude (AI 深度職缺匹配分析引擎 v1.0)"
  };
  
  const patchData = {
    ai_summary: aiSummary,
    actor: "AI-summary"
  };
  
  try {
    console.log('🔄 發送 PATCH 請求到 Step1ne API...\n');
    
    const response = await httpsPatch(
      `${STEP1NE_API}/api/candidates/1208`,
      patchData
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ API 更新成功！\n');
      console.log(`狀態碼: ${response.status}`);
      console.log('回應資料:', JSON.stringify(response.data, null, 2));
    } else {
      console.log(`⚠️ API 返回狀態: ${response.status}\n`);
      console.log('回應:', JSON.stringify(response.data, null, 2));
    }
    
    // 輸出 JSON 供手動複製貼入
    console.log('\n═══════════════════════════════════════════════\n');
    console.log('📋 ai_summary JSON 區塊（供複製貼入系統）:\n');
    console.log(JSON.stringify(aiSummary, null, 2));
    
  } catch (e) {
    console.error('❌ API 呼叫失敗:', e.message);
    console.log('\n輸出 JSON 供手動複製貼入：\n');
    console.log(JSON.stringify(aiSummary, null, 2));
  }
}

updateCandidate();
