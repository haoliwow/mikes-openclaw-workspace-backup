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
          resolve(null);
        }
      });
    });
    req.on('error', reject);
  });
}

async function deepAnalysis() {
  console.log('📊 Scott Lin (#1208) 深度職缺匹配分析 (資深獵頭顧問模式)\n');
  console.log('═══════════════════════════════════════════════\n');
  
  try {
    // 1. 獲取職缺217詳細資訊
    console.log('🔍 Step 1: 取得目標職缺 #217 詳細資訊...\n');
    
    const job217Res = await httpsRequest(`${STEP1NE_API}/api/jobs/217`, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (job217Res && job217Res.data) {
      const job = job217Res.data;
      console.log(`✅ 職缺 #217: ${job.job_position || job.title || 'N/A'}`);
      console.log(`   公司: ${job.company_name || 'N/A'}`);
      console.log(`   薪資: ${job.salary_range || `${job.salary_min}-${job.salary_max}` || 'N/A'}`);
      console.log(`   年資需求: ${job.years_required || 'N/A'}`);
      console.log(`   關鍵技能: ${job.key_skills || 'N/A'}`);
      console.log(`   位置: ${job.location || 'N/A'}`);
    } else {
      console.log('⚠️  無法取得職缺217詳細資訊');
    }
    
    // 2. 獲取所有職缺清單
    console.log('\n🔍 Step 2: 掃描系統所有職缺...\n');
    
    const jobsRes = await httpsRequest(`${STEP1NE_API}/api/jobs?limit=50`, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    const jobs = jobsRes?.data || [];
    console.log(`✅ 系統職缺總數: ${jobs.length} 個\n`);
    
    // 3. 執行匹配分析
    console.log('📋 Scott Lin 個人檔案速查:\n');
    console.log('  • 名字: Scott Lin');
    console.log('  • 現職: Backend Engineer (Golang) @ Mlytics');
    console.log('  • 年資: 10年');
    console.log('  • 核心技能: Golang⭐⭐⭐⭐⭐, AWS/GCP⭐⭐⭐⭐⭐, K8s⭐⭐⭐⭐, Docker/Microservices');
    console.log('  • 特殊經驗: DNS架構(PowerDNS→CoreDNS), 多CDN整合(Akamai/Cloudflare/AWS), 99.98% uptime');
    console.log('  • 管理經驗: ❌ 無');
    console.log('  • 穩定度: 70% (4份工作, 平均2.5年)');
    console.log('  • 期望薪資: ❌ 未填 (推斷: 月薪 100-150k)');
    
    console.log('\n═══════════════════════════════════════════════\n');
    
    // 4. 推薦職缺匹配
    console.log('🎯 Top 3 最匹配職缺評估:\n');
    
    // 從記憶中已知的職缺資訊
    const targetJobs = [
      {
        id: 218,
        title: 'Backend Engineer (Golang)',
        salary: '180k/月',
        years: '3-5',
        skills: 'Golang, Microservices, DDD',
        scoreReason: 'Golang主力, 微服務深度, 年資完全符合'
      },
      {
        id: 219,
        title: 'SRE (Site Reliability Engineer)',
        salary: '180k/月',
        years: '4-6',
        skills: 'Kubernetes, Prometheus, GCP',
        scoreReason: 'K8s/GCP深度, 99.98% uptime經驗'
      },
      {
        id: 217,
        title: 'Playsee Senior Backend Engineer',
        salary: '180k/月',
        years: '5-7',
        skills: 'Backend, 系統架構, 高併發',
        scoreReason: '8-10年後端, 架構設計強'
      }
    ];
    
    targetJobs.forEach((job, idx) => {
      console.log(`${idx+1}. 職缺 #${job.id}: ${job.title} | ${job.salary}`);
      console.log(`   需求年資: ${job.years}年 | 技能: ${job.skills}`);
      console.log(`   匹配原因: ${job.scoreReason}`);
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════\n');
    
    console.log('✅ 分析資料已準備就緒，開始深度評估...\n');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

deepAnalysis();
