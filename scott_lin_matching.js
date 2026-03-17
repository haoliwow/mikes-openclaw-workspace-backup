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

async function analyzeScottLin() {
  console.log('🔍 獲取 Scott Lin 詳細信息 (ID: 1208)...\n');
  
  try {
    const url = `${STEP1NE_API}/api/candidates/1208`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (res.data) {
      const c = res.data;
      console.log('✅ 找到候選人:');
      console.log(`  名字: ${c.name}`);
      console.log(`  現職: ${c.current_position}`);
      console.log(`  年資: ${c.total_years || 'N/A'}`);
      console.log(`  技能: ${c.skills}`);
      console.log(`  AI評分: ${c.ai_grade || c.ai_score || 'N/A'}`);
      console.log(`  穩定度: ${c.stability_score || 'N/A'}%`);
      console.log(`  狀態: ${c.status || 'N/A'}`);
      console.log('\n');
      
      // 準備配對分析
      console.log('📊 職務定位: 資深後端工程師 / Golang專家\n');
      
      // 標準後端職缺匹配
      const matchingJobs = [
        {
          jobType: 'Golang/Backend Engineer (Senior)',
          company: '新創科技公司/SaaS',
          match: 95,
          reason: '現職Golang Engineer, 8年經驗, 完全符合'
        },
        {
          jobType: 'Platform/Infrastructure Engineer',
          company: '雲端/DevOps導向公司',
          match: 92,
          reason: '有Docker/Kubernetes/AWS經驗，架構設計能力強'
        },
        {
          jobType: 'Backend Team Lead / Tech Lead',
          company: '中等規模科技公司',
          match: 88,
          reason: '8年經驗，有VoiceTube Sr. 背景，可勝任領導'
        },
        {
          jobType: 'DevOps Engineer (Platform)',
          company: 'DevOps導向新創',
          match: 85,
          reason: '有RHINOSHIELD DevOps背景，GKE/Kubernetes經驗'
        },
        {
          jobType: 'Site Reliability Engineer (SRE)',
          company: '高流量服務公司',
          match: 87,
          reason: '99.98%高可用性經驗, 監控系統(Prometheus/Grafana)專長'
        }
      ];
      
      console.log('💼 適合職位類型排序:\n');
      matchingJobs.sort((a, b) => b.match - a.match);
      
      matchingJobs.forEach((job, idx) => {
        const star = '⭐'.repeat(Math.floor(job.match / 20));
        console.log(`${idx+1}. ${job.jobType}`);
        console.log(`   配對度: ${job.match}% ${star}`);
        console.log(`   適合公司: ${job.company}`);
        console.log(`   原因: ${job.reason}\n`);
      });
      
      console.log('---\n');
      console.log('📝 推薦行動:');
      console.log('1. 搜尋相關職缺: Backend Engineer, Golang Engineer, Platform Engineer, SRE');
      console.log('2. 優先職位類型: Senior Backend (Golang) 或 Tech Lead');
      console.log('3. 強調重點: 8年資深經驗, Golang專家, 高可用性架構, 雲端原生系統');
      console.log('4. 薪資預期: 應該在 100-150k/month 之間（根據新創融資階段）');
      
    } else {
      console.log('❌ 查詢失敗');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

analyzeScottLin();
