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

async function getInterviewCandidates() {
  console.log('🔍 Fetching interview-stage candidates...');
  try {
    const url = `${STEP1NE_API}/api/candidates?status=interview`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    
    if (res.data && Array.isArray(res.data)) {
      console.log(`✅ Found ${res.data.length} interview candidates`);
      
      // Group by position/job type
      const grouped = {};
      res.data.forEach(c => {
        const jobType = (c.current_position || c.position || 'Other').toLowerCase();
        if (!grouped[jobType]) {
          grouped[jobType] = [];
        }
        grouped[jobType].push({
          name: c.name,
          id: c.id,
          position: c.current_position || c.position,
          years: c.total_years || c.years_experience || 0,
          skills: c.skills,
          ai_score: c.ai_grade || c.ai_score || 0,
          stability: c.stability_score || 75
        });
      });
      
      console.log('\n📋 Grouped by job type:');
      Object.keys(grouped).forEach(type => {
        console.log(`  • ${type}: ${grouped[type].length} candidates`);
        grouped[type].forEach(c => console.log(`    - ${c.name} (${c.position})`));
      });
      
      return grouped;
    } else {
      console.log('⚠️  No candidates found, using fallback data');
      return null;
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
    return null;
  }
}

getInterviewCandidates().then(result => {
  if (result) {
    console.log('\n---\n');
    console.log(JSON.stringify(Object.keys(result), null, 2));
  }
});
