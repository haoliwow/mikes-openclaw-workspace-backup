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

async function fullAnalysis() {
  console.log('📊 Scott Lin vs 系統職缺完整配對分析\n');
  console.log('🔍 取得系統全部職缺...\n');
  
  try {
    // 1. 取得所有職缺
    const jobsRes = await httpsRequest(`${STEP1NE_API}/api/jobs?limit=200`, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    const jobs = jobsRes.data || [];
    console.log(`✅ 取得 ${jobs.length} 個職缺\n`);
    
    // 2. 分析每個職缺
    console.log('🎯 職缺分析結果:\n');
    
    const matched = [];
    const unmatched = [];
    
    jobs.forEach(job => {
      const title = (job.title || '').toLowerCase();
      const desc = (job.description || '').toLowerCase();
      const req = (job.requirements || '').toLowerCase();
      
      // 評分邏輯
      let score = 0;
      let reason = [];
      
      // 職位相關性 (0-40分)
      if (title.includes('engineer') || title.includes('工程師')) score += 10;
      if (title.includes('senior') || title.includes('資深')) score += 10;
      if (title.includes('manager') || title.includes('lead') || title.includes('經理')) score += 8;
      if (title.includes('backend') || title.includes('後端')) { score += 20; reason.push('後端職位'); }
      if (title.includes('platform') || title.includes('infra')) { score += 20; reason.push('平台工程'); }
      if (title.includes('devops') || title.includes('sre')) { score += 20; reason.push('DevOps'); }
      
      // 技術棧相關性 (0-40分)
      if (desc.includes('golang') || req.includes('golang')) { score += 15; reason.push('Golang'); }
      if (desc.includes('php') || req.includes('php')) score += 5;
      if (desc.includes('docker') || desc.includes('kubernetes') || desc.includes('k8s')) { score += 15; reason.push('容器/K8s'); }
      if (desc.includes('aws') || desc.includes('gcp') || desc.includes('cloud')) { score += 10; reason.push('雲端'); }
      if (desc.includes('microservice') || desc.includes('架構')) { score += 10; reason.push('微服務'); }
      if (desc.includes('ci/cd') || desc.includes('devops')) { score += 10; reason.push('CI/CD'); }
      
      // 經驗匹配 (0-20分)
      if (req.includes('年') || req.includes('experience')) {
        if (req.match(/[0-3]\s*年|junior/)) score -= 5; // 資淺要求
        if (req.match(/[4-6]\s*年|senior|mid/)) score += 8;
        if (req.match(/[7-9]\s*年|lead|architect|principal/)) score += 15;
      }
      
      // 分類
      if (score >= 50) {
        matched.push({
          id: job.id,
          title: job.title,
          company: job.company_name,
          salary: job.salary_range,
          location: job.location,
          score: score,
          reasons: reason.join(', ')
        });
      } else if (score > 0) {
        unmatched.push({
          id: job.id,
          title: job.title,
          score: score
        });
      }
    });
    
    // 3. 輸出結果
    if (matched.length > 0) {
      console.log(`🎉 匹配職缺 (${matched.length} 個, 評分 ≥ 50分):\n`);
      matched.sort((a, b) => b.score - a.score);
      
      matched.forEach((job, idx) => {
        console.log(`${idx+1}. [${job.score}分] ${job.title}`);
        console.log(`   公司: ${job.company}`);
        console.log(`   薪資: ${job.salary}`);
        console.log(`   地點: ${job.location}`);
        console.log(`   原因: ${job.reasons}`);
        console.log('');
      });
    } else {
      console.log('❌ 無完全匹配的職缺 (≥50分)\n');
    }
    
    // 邊界職缺 (30-49分)
    const boundary = unmatched.filter(j => j.score >= 30);
    if (boundary.length > 0) {
      console.log(`⚠️  邊界職缺 (評分 30-49分, 可考慮): ${boundary.length} 個`);
      boundary.sort((a, b) => b.score - a.score).slice(0, 3).forEach(j => {
        console.log(`   • [${j.score}分] ${j.title}`);
      });
      console.log('');
    }
    
    // 4. 推薦建議
    console.log('---\n');
    console.log('📝 推薦建議:\n');
    
    if (matched.length >= 1) {
      console.log('✅ 推薦: 發送推薦信');
      console.log(`   理由: 找到 ${matched.length} 個適合職缺 (評分${matched[0].score}+)\n`);
      console.log('推薦信策略:');
      console.log(`  • 重點職位: ${matched[0].title}`);
      console.log(`  • 核心優勢: ${matched[0].reasons}`);
      console.log(`  • 薪資範圍: ${matched[0].salary}`);
      console.log(`  • 誘餌: 不先曝露職位，先介紹Scott的背景機會`);
    } else if (boundary.length >= 1) {
      console.log('⚠️  條件推薦: 謹慎發送推薦信');
      console.log(`   理由: 無完全匹配，最接近評分${boundary[0].score}分\n`);
      console.log('考慮因素:');
      console.log(`  • 職位: ${boundary[0].title}`);
      console.log(`  • 需要確認: 薪資、期待、職務細節是否符合Scott期待`);
    } else {
      console.log('❌ 不推薦: 暫不發送推薦信');
      console.log('   理由: 系統職缺與Scott背景無實質重疊\n');
      console.log('替代方案:');
      console.log('  • 從 104.com.tw 爬蟲後端職缺');
      console.log('  • 與特定新創公司洽談職位');
      console.log('  • 等待系統新增相關職位');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

fullAnalysis();
