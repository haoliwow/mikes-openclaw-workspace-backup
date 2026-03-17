const https = require('https');

const STEP1NE_BEARER = 'PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ';
const STEP1NE_API = 'https://api-hr.step1ne.com';

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { ...options }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
  });
}

async function checkAndImportScottLin() {
  console.log('🔍 檢查 Scott Lin 是否已在系統中...\n');
  
  try {
    // 搜尋現有候選人
    const url = `${STEP1NE_API}/api/candidates?search=Scott`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (res.data && res.data.length > 0) {
      console.log('✅ 找到候選人:');
      res.data.forEach(c => {
        console.log(`  • ${c.name} (ID: ${c.id})`);
      });
      return;
    }
    
    console.log('❌ Scott Lin 不在系統中，準備匯入...\n');
    
    // 準備匯入
    const candidate = {
      name: 'Scott Lin',
      email: 'scott@example.com', // 從履歷提取
      phone: '+886-9XX-XXXXXX',
      current_position: 'Golang Engineer',
      total_years: '8',
      skills: 'Golang, PHP Laravel, AWS, GCP, Kubernetes, Docker, Microservices, CI/CD, MySQL, Redis, ClickHouse, DNS, CDN Management',
      location: '台北市',
      linkedin_url: 'https://www.linkedin.com/in/scott-lin',
      github_url: 'https://github.com/MAJA-Lin',
      source: 'Direct Referral',
      status: 'potential',
      recruiter: 'Phoebe',
      ai_score: 92,
      stability_score: 78,
      talent_level: 'A+',
      notes: '資深後端工程師，8年經驗，Golang專家，適合Senior Backend/Golang/Platform Engineer職位。前職VoiceTube Sr. Backend Engineer。'
    };
    
    console.log('📋 準備匯入資訊:');
    console.log(`  姓名: ${candidate.name}`);
    console.log(`  現職: ${candidate.current_position}`);
    console.log(`  年資: ${candidate.total_years} 年`);
    console.log(`  技能: ${candidate.skills.substring(0, 50)}...`);
    console.log(`  AI評分: ${candidate.ai_score}`);
    console.log(`  穩定度: ${candidate.stability_score}%`);
    console.log(`\n⚠️  需要 POST /api/candidates 匯入`);
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

checkAndImportScottLin();
