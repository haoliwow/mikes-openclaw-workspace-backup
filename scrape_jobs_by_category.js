const https = require('https');
const BRAVE_API_KEY = 'BSAPJQDhMxPB34Rwfu8whZSKLXt25eG';

// Candidates grouped by job category (from Phoebe's instruction)
const candidatesByRole = {
  'BIM工程師': [
    { name: '黃律銘', years: 5, ai_score: 85, stability: 82 },
    { name: '莊奕聖', years: 4, ai_score: 82, stability: 80 }
  ],
  'Machine Learning Engineer': [
    { name: 'PIN SHAN CHUANG', years: 8, ai_score: 90, stability: 85 },
    { name: 'Pin-Huey Chiang', years: 6, ai_score: 88, stability: 83 }
  ],
  'AI工程師': [
    { name: 'Jia-Hau Ching', years: 5, ai_score: 89, stability: 81 },
    { name: 'Chun-Pei Cheng', years: 7, ai_score: 91, stability: 84 }
  ],
  '產品經理': [
    { name: 'JJ Tsai', years: 4, ai_score: 81, stability: 78 }
  ],
  '資料分析': [
    { name: 'Tzu-Chieh Chen', years: 3, ai_score: 79, stability: 76 }
  ]
};

// Search keywords for each role
const roleSearchKeywords = {
  'BIM工程師': ['BIM工程師', 'BIM Engineer', 'Revit'],
  'Machine Learning Engineer': ['Machine Learning', 'ML Engineer', 'Deep Learning'],
  'AI工程師': ['AI工程師', 'AI Engineer', 'Artificial Intelligence'],
  '產品經理': ['產品經理', 'Product Manager', 'PM'],
  '資料分析': ['資料分析', 'Data Analyst', '數據分析']
};

function searchBraveAPI(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(`site:104.com.tw ${query}`);
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodedQuery}&count=10`;
    
    const req = https.get(url, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_API_KEY }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.web) {
            resolve(result.web.results || []);
          } else {
            resolve([]);
          }
        } catch (e) {
          resolve([]);
        }
      });
    });
    
    req.on('error', reject);
  });
}

async function scrapeJobsByCategory() {
  console.log('🔍 Scraping 104.com.tw jobs by role category...\n');
  
  const allJobs = {};
  let totalSearches = 0;
  
  for (const [role, candidates] of Object.entries(candidatesByRole)) {
    console.log(`\n📌 Category: ${role} (${candidates.length} candidates)`);
    allJobs[role] = [];
    
    // Search for 2-3 keywords per role
    const keywords = roleSearchKeywords[role] || [role];
    
    for (const keyword of keywords.slice(0, 2)) {
      console.log(`  🔎 Searching: "${keyword}"...`);
      try {
        const results = await searchBraveAPI(keyword);
        
        if (results && results.length > 0) {
          console.log(`     ✅ Found ${results.length} results`);
          
          results.forEach(r => {
            allJobs[role].push({
              title: r.title,
              url: r.url,
              description: r.description
            });
          });
        } else {
          console.log(`     ⚠️  No results for this keyword`);
        }
        
        totalSearches++;
        // Respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (e) {
        console.log(`     ❌ Error: ${e.message}`);
      }
    }
  }
  
  console.log(`\n\n✅ Scraping complete (${totalSearches} searches, ${Object.values(allJobs).flat().length} total jobs)`);
  console.log('\n📊 Jobs found by category:');
  
  for (const [role, jobs] of Object.entries(allJobs)) {
    if (jobs.length > 0) {
      console.log(`\n${role}: ${jobs.length} listings`);
      jobs.slice(0, 3).forEach((j, i) => {
        console.log(`  ${i+1}. ${j.title.substring(0, 60)}`);
      });
    }
  }
  
  return { candidatesByRole, allJobs };
}

scrapeJobsByCategory().then(data => {
  console.log('\n\n✨ Ready to generate Excel report...');
}).catch(console.error);
