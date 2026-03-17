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

async function getAllJobs() {
  console.log('🔍 從 Step1ne 系統取得所有職缺詳細資訊...\n');
  
  try {
    const url = `${STEP1NE_API}/api/jobs?limit=200`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    const jobs = res.data || [];
    console.log(`✅ 取得 ${jobs.length} 個職缺\n`);
    
    // 詳細列表
    console.log('═══ 系統職缺清單 ═══\n');
    
    jobs.forEach((job, idx) => {
      console.log(`${idx + 1}. [ID: ${job.id}] ${job.title}`);
      console.log(`   公司: ${job.company_name || 'N/A'}`);
      console.log(`   地點: ${job.location || 'N/A'}`);
      console.log(`   薪資: ${job.salary_range || 'N/A'}`);
      console.log(`   要求年資: ${job.years_required || 'N/A'}`);
      console.log(`   核心要求: ${(job.requirements || 'N/A').substring(0, 80)}...`);
      console.log('');
    });
    
    // 分類統計
    console.log('═══ 職缺分類統計 ═══\n');
    
    const categories = {};
    jobs.forEach(job => {
      const title = (job.title || '').toLowerCase();
      let cat = 'Other';
      if (title.includes('bim')) cat = 'BIM';
      else if (title.includes('機電') || title.includes('mep')) cat = 'MEP';
      else if (title.includes('後端') || title.includes('backend')) cat = 'Backend';
      else if (title.includes('工程師') || title.includes('engineer')) cat = 'Engineer';
      
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    Object.keys(categories).forEach(cat => {
      console.log(`  ${cat}: ${categories[cat]} 個`);
    });
    
    // Scott Lin 配對
    console.log('\n═══ Scott Lin 配對評分 ═══\n');
    
    const matching = [];
    
    jobs.forEach(job => {
      let score = 0;
      let reasons = [];
      
      const title = (job.title || '').toLowerCase();
      const desc = (job.description || '').toLowerCase();
      const req = (job.requirements || '').toLowerCase();
      const fullText = `${title} ${desc} ${req}`.toLowerCase();
      
      // 技術匹配
      if (fullText.includes('golang') || fullText.includes('go')) { score += 25; reasons.push('Golang'); }
      if (fullText.includes('backend') || fullText.includes('後端')) { score += 20; reasons.push('後端'); }
      if (fullText.includes('microservice')) { score += 15; reasons.push('微服務'); }
      if (fullText.includes('aws') || fullText.includes('gcp') || fullText.includes('cloud')) { score += 10; reasons.push('雲端'); }
      if (fullText.includes('docker') || fullText.includes('kubernetes') || fullText.includes('k8s')) { score += 15; reasons.push('容器'); }
      if (fullText.includes('ci/cd') || fullText.includes('devops')) { score += 10; reasons.push('DevOps'); }
      if (fullText.includes('platform') || fullText.includes('infrastructure')) { score += 15; reasons.push('平台工程'); }
      
      if (score > 0) {
        matching.push({
          id: job.id,
          title: job.title,
          company: job.company_name,
          salary: job.salary_range,
          score: score,
          reasons: reasons.join(', ')
        });
      }
    });
    
    if (matching.length > 0) {
      console.log(`✅ 找到 ${matching.length} 個匹配職缺:\n`);
      matching.sort((a, b) => b.score - a.score);
      
      matching.forEach((job, idx) => {
        console.log(`${idx+1}. [${job.score}分] ${job.title}`);
        console.log(`   公司: ${job.company}`);
        console.log(`   薪資: ${job.salary}`);
        console.log(`   匹配: ${job.reasons}`);
        console.log('');
      });
    } else {
      console.log('❌ 無任何匹配職缺 (Scott Golang技能無法匹配系統職位)\n');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

getAllJobs();
