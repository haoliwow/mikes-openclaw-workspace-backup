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
          resolve({error: data});
        }
      });
    });
    req.on('error', reject);
  });
}

async function getAllCandidates() {
  console.log('🔍 Fetching all candidates...');
  try {
    const url = `${STEP1NE_API}/api/candidates?limit=100`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (res.data && Array.isArray(res.data)) {
      console.log(`✅ Found ${res.data.length} total candidates`);
      
      // Show first 10
      console.log('\n--- Sample candidates (first 10) ---');
      res.data.slice(0, 10).forEach((c, i) => {
        console.log(`${i+1}. ${c.name} - ${c.current_position || c.position || 'N/A'}`);
      });
      
      // Filter those with "interview" status
      const interview = res.data.filter(c => 
        c.status === 'interview' || 
        (c.notes && c.notes.includes('interview')) ||
        (c.ai_grade && c.ai_grade !== 'reject')
      );
      
      console.log(`\n📌 Candidates with interview/active status: ${interview.length}`);
      interview.slice(0, 15).forEach((c, i) => {
        console.log(`${i+1}. ${c.name} (${c.current_position || c.position}) - AI: ${c.ai_grade || 'N/A'}, Status: ${c.status}`);
      });
      
    } else {
      console.log('⚠️  Unexpected response:', JSON.stringify(res).substring(0, 200));
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

getAllCandidates();
