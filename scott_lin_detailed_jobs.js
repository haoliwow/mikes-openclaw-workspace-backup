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

async function getDetailedJobs() {
  console.log('🔍 查詢具體職缺詳細資訊 (ID 50-60)...\n');
  
  try {
    // 先取得清單
    const listRes = await httpsRequest(`${STEP1NE_API}/api/jobs?limit=10&offset=40`, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    const jobs = listRes.data || [];
    console.log(`✅ 取得 ${jobs.length} 個職缺\n`);
    
    // 查詢前10個職缺的詳細資訊
    for (let i = 0; i < Math.min(10, jobs.length); i++) {
      const jobId = jobs[i].id;
      console.log(`\n[查詢 ID: ${jobId}]`);
      
      const detailRes = await httpsRequest(`${STEP1NE_API}/api/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
      });
      
      if (detailRes && detailRes.data) {
        const job = detailRes.data;
        console.log(`職位: ${job.job_position || job.position || job.title || 'N/A'}`);
        console.log(`公司: ${job.company_name || 'N/A'}`);
        console.log(`薪資: ${job.salary_range || 'N/A'}`);
        console.log(`要求: ${(job.requirements || job.description || 'N/A').substring(0, 100)}...`);
      } else {
        console.log('❌ 無詳細資訊');
      }
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

getDetailedJobs();
