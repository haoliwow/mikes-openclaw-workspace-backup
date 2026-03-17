const https = require('https');
const querystring = require('querystring');

const BRAVE_API_KEY = 'BSAPJQDhMxPB34Rwfu8whZSKLXt25eG';
const STEP1NE_BEARER = 'PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ';

// Job categories to scrape mapped to keywords
const JOB_CATEGORIES = {
  'PM/Product Manager': ['產品經理', '產品總監', 'PM'],
  'AI/ML Engineer': ['AI工程師', '機器學習', '深度學習', 'NLP工程師'],
  'Data Analyst': ['資料分析', '資料科學', '商業分析'],
  'Backend Engineer': ['後端工程師', 'Java工程師', 'Python工程師'],
  'Frontend Engineer': ['前端工程師', 'React工程師', 'Vue工程師'],
  'DevOps/SRE': ['DevOps', 'SRE', '系統工程師'],
  'BIM/Architecture': ['BIM工程師', '建築資訊模型', 'Revit'],
  'MEP Engineer': ['機電工程師', 'MEP工程師', 'HVAC']
};

async function searchBraveAPI(query, count = 20) {
  return new Promise((resolve, reject) => {
    const params = querystring.stringify({
      q: query,
      count: count,
      search_lang: 'zh',
      ui_lang: 'zh'
    });
    
    const url = `https://api.search.brave.com/res/v1/web/search?${params}`;
    
    const req = https.get(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = (json.web || []).map(r => ({
            title: r.title,
            url: r.url,
            description: r.description
          }));
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    });
    
    req.on('error', reject);
  });
}

async function fetchInterviewCandidates() {
  return new Promise((resolve, reject) => {
    const url = 'https://api-hr.step1ne.com/api/candidates?status=interview&limit=100';
    
    const req = https.get(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    
    req.on('error', reject);
  });
}

async function runBulkScrape() {
  console.log('🚀 開始大量職缺爬蟲...\n');
  
  // Step 1: Fetch candidates
  console.log('1️⃣  獲取面試階段候選人...');
  let candidates = await fetchInterviewCandidates();
  
  if (!candidates || candidates.length === 0) {
    console.log('⚠️  API無候選人，使用樣本數據');
    candidates = [
      { name: '李尚辰', current_position: 'Product Manager', total_years: 3 },
      { name: 'Yi-Wen Chen', current_position: 'BIM Engineer', total_years: 7 },
      { name: '陳俊豪', current_position: 'MEP Engineer', total_years: 4 },
      { name: '莊伊騏', current_position: 'Senior MEP', total_years: 5 },
      { name: '高如霜', current_position: 'VDC Coordinator', total_years: 2 }
    ];
  }
  
  console.log(`✅ 找到 ${candidates.length} 位面試候選人\n`);
  
  // Step 2: Categorize candidates
  console.log('2️⃣  按職務類別分類...');
  const candidatesByCategory = {};
  
  candidates.forEach(c => {
    const position = (c.current_position || '').toLowerCase();
    let category = 'Other';
    
    if (position.includes('product') || position.includes('pm')) category = 'PM/Product Manager';
    else if (position.includes('ai') || position.includes('機器')) category = 'AI/ML Engineer';
    else if (position.includes('data')) category = 'Data Analyst';
    else if (position.includes('backend') || position.includes('java') || position.includes('python')) category = 'Backend Engineer';
    else if (position.includes('frontend') || position.includes('react') || position.includes('vue')) category = 'Frontend Engineer';
    else if (position.includes('devops') || position.includes('sre')) category = 'DevOps/SRE';
    else if (position.includes('bim') || position.includes('建築')) category = 'BIM/Architecture';
    else if (position.includes('mep') || position.includes('機電')) category = 'MEP Engineer';
    
    if (!candidatesByCategory[category]) {
      candidatesByCategory[category] = [];
    }
    candidatesByCategory[category].push(c);
  });
  
  Object.keys(candidatesByCategory).forEach(cat => {
    console.log(`  • ${cat}: ${candidatesByCategory[cat].length} 人`);
  });
  
  // Step 3: Scrape jobs for each category
  console.log('\n3️⃣  爬蟲各職務類別的職缺...\n');
  
  const jobsByCategory = {};
  
  for (const [category, keywords] of Object.entries(JOB_CATEGORIES)) {
    if (!candidatesByCategory[category]) continue;
    
    console.log(`  🔍 ${category}...`);
    const jobs = [];
    
    for (const keyword of keywords.slice(0, 2)) {
      const query = `site:104.com.tw ${keyword}`;
      const results = await searchBraveAPI(query, 15);
      
      results.forEach(r => {
        if (r.url && r.url.includes('104')) {
          jobs.push({
            title: r.title,
            url: r.url,
            snippet: r.description
          });
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    }
    
    jobsByCategory[category] = [...new Set(jobs.map(j => j.url))].slice(0, 25).map(url => ({
      url: url,
      title: jobs.find(j => j.url === url)?.title || 'Job Listing'
    }));
    
    console.log(`     ✅ Found ${jobsByCategory[category].length} listings`);
  }
  
  // Step 4: Output summary
  console.log('\n---\n✨ 爬蟲完成\n');
  console.log('📊 職務類別 x 職缺數:');
  Object.keys(jobsByCategory).forEach(cat => {
    const candidates = candidatesByCategory[cat].length;
    const jobs = jobsByCategory[cat].length;
    console.log(`  ${cat}: ${candidates} 候選人 → ${jobs} 職缺`);
  });
  
  return { candidates: candidatesByCategory, jobs: jobsByCategory };
}

runBulkScrape().catch(console.error);
