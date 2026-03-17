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

async function checkBackendJobs() {
  console.log('🔍 查詢系統現有職缺...\n');
  
  try {
    const url = `${STEP1NE_API}/api/jobs?limit=100`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (res.data && Array.isArray(res.data)) {
      console.log(`✅ 找到 ${res.data.length} 個職缺\n`);
      
      // 過濾後端/Golang相關職缺
      const backendJobs = res.data.filter(job => {
        const title = (job.title || '').toLowerCase();
        const desc = (job.description || '').toLowerCase();
        return title.includes('backend') || title.includes('golang') || 
               title.includes('platform') || title.includes('devops') ||
               title.includes('sre') || title.includes('engineer') ||
               desc.includes('golang') || desc.includes('backend');
      });
      
      console.log(`📊 後端/Golang相關職缺: ${backendJobs.length} 個\n`);
      
      if (backendJobs.length > 0) {
        backendJobs.forEach(job => {
          console.log(`  • ${job.title} (ID: ${job.id})`);
          console.log(`    公司: ${job.company_name || 'N/A'}`);
          console.log(`    薪資: ${job.salary_range || 'N/A'}`);
          console.log(`    地點: ${job.location || 'N/A'}`);
        });
      } else {
        console.log('❌ 系統現有職缺中無 Backend/Golang/Platform Engineer 職位');
        console.log('\n⚠️  需要行動:');
        console.log('  1. 從 104.com.tw 爬蟲後端職缺');
        console.log('  2. 或手動新增相關職位到系統');
      }
      
    } else {
      console.log('⚠️  未能取得職缺列表');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

checkBackendJobs();
