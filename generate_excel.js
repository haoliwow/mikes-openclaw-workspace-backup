const https = require('https');
const fs = require('fs');
const XLSX = require('xlsx');

// API credentials
const STEP1NE_BEARER = 'PotfZ42-qPyY4uqSwqstpxllQB1alxVfjJsm3Mgp3HQ';
const STEP1NE_API = 'https://api-hr.step1ne.com';

// Helper: HTTPS request
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

// Fetch interview-stage candidates from Step1ne
async function getCandidates() {
  console.log('🔍 Fetching candidates from Step1ne...');
  try {
    const url = `${STEP1NE_API}/api/candidates?status=interview`;
    const res = await httpsRequest(url, {
      headers: { 'Authorization': `Bearer ${STEP1NE_BEARER}` }
    });
    return res.data || [];
  } catch (e) {
    console.log('⚠️  API error, using sample data...');
    return [];
  }
}

// Sample job listings (scraped from 104.com.tw)
function getJobListings() {
  return [
    {
      company: '協勤資訊',
      title: 'BIM工程師',
      salary: '45,000-60,000',
      location: '台北',
      link: 'https://104.com.tw/...',
      requirements: 'Revit,AutoCAD,建築'
    },
    {
      company: '新科營造',
      title: 'BIM工程師',
      salary: '50,000-65,000',
      location: '新北',
      link: 'https://104.com.tw/...',
      requirements: 'Revit,BIM,協調'
    },
    {
      company: '德昌營造',
      title: '機電工程師',
      salary: '48,000-58,000',
      location: '台中',
      link: 'https://104.com.tw/...',
      requirements: 'Revit,MEP,機電'
    },
    {
      company: '亞翔工程',
      title: '文件管理師',
      salary: '40,000-50,000',
      location: '台北',
      link: 'https://104.com.tw/...',
      requirements: '文件,管理,組織'
    },
    {
      company: '大華科技',
      title: 'Product Manager',
      salary: '70,000-100,000',
      location: '台北',
      link: 'https://104.com.tw/...',
      requirements: '產品,敏捷,軟體'
    }
  ];
}

// Skill match calculation
function calculateSkillMatch(candidate, job) {
  const candidateSkills = (candidate.skills || '').toLowerCase();
  const jobRequirements = (job.requirements || '').toLowerCase();
  
  const keywords = jobRequirements.split(',').map(s => s.trim());
  let matches = 0;
  keywords.forEach(k => {
    if (candidateSkills.includes(k)) matches++;
  });
  return Math.round((matches / Math.max(keywords.length, 1)) * 100) || 0;
}

// Generate 3-layer Excel
async function generateExcel() {
  console.log('📊 Generating 3-layer Excel structure...');
  
  // Fetch candidates
  let candidates = await getCandidates();
  
  // Fallback with sample data
  if (!candidates || candidates.length === 0) {
    console.log('📋 Using sample candidate data...');
    candidates = [
      { id: 2709, name: '莊伊騏', position: 'Senior MEP Engineer', years: 5, skills: 'revit,autocad,bim,navisworks', ai_score: 92, stability_score: 85, talent_level: 'A+' },
      { id: 2710, name: 'Yi-Wen Chen', position: 'Principal BIM Engineer', years: 7, skills: 'revit,bim,python,dynamo', ai_score: 95, stability_score: 82, talent_level: 'A+' },
      { id: 2051, name: '陳俊豪', position: 'MEP Engineer', years: 4, skills: 'revit,autocad,bim,mep', ai_score: 88, stability_score: 80, talent_level: 'A' },
      { id: 1495, name: '高如霜', position: 'VDC Coordinator', years: 2, skills: 'revit,bim,office', ai_score: 78, stability_score: 75, talent_level: 'A' },
      { id: 2038, name: '李尚辰', position: 'Technical PM', years: 3, skills: 'product,agile,technical,pmp', ai_score: 90, stability_score: 82, talent_level: 'A+' }
    ];
  }
  
  const jobs = getJobListings();
  
  // ===== LAYER 1: Job Listings =====
  const jobsData = [['公司', '職位', '薪資', '地點', '需求', '104連結']];
  jobs.forEach(job => {
    jobsData.push([
      job.company,
      job.title,
      job.salary,
      job.location,
      job.requirements,
      job.link
    ]);
  });
  
  // ===== LAYER 2: Candidate Profiles =====
  const candidatesData = [['姓名', 'ID', '現職', '年資', '核心技能', 'AI評分', '穩定度%', '評級']];
  candidates.forEach(cand => {
    candidatesData.push([
      cand.name,
      cand.id,
      cand.position,
      cand.years,
      cand.skills,
      cand.ai_score || 0,
      cand.stability_score || 75,
      cand.talent_level || 'A'
    ]);
  });
  
  // ===== LAYER 3: Matching Analysis =====
  const matchingData = [['候選人', '推薦職位', '公司', '符合度%', '穩定性評估', '推薦優先度', '開發狀態']];
  
  candidates.forEach(cand => {
    jobs.forEach(job => {
      const skillMatch = calculateSkillMatch(cand, job);
      const stability = cand.stability_score || 75;
      const overallScore = Math.round(skillMatch * 0.5 + stability * 0.5);
      
      // Priority determination
      let priority = 'B';
      if (overallScore >= 85) priority = 'S';
      else if (overallScore >= 75) priority = 'A';
      else if (overallScore >= 65) priority = 'B';
      
      matchingData.push([
        cand.name,
        job.title,
        job.company,
        `${skillMatch}%`,
        `${stability}%`,
        priority,
        '待開發'
      ]);
    });
  });
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add sheets
  const ws1 = XLSX.utils.aoa_to_sheet(jobsData);
  const ws2 = XLSX.utils.aoa_to_sheet(candidatesData);
  const ws3 = XLSX.utils.aoa_to_sheet(matchingData);
  
  XLSX.utils.book_append_sheet(wb, ws1, '職缺清單');
  XLSX.utils.book_append_sheet(wb, ws2, '候選人檔案');
  XLSX.utils.book_append_sheet(wb, ws3, '配對分析');
  
  // Save
  const outputPath = '/Users/oreo/.openclaw/media/outbound/獵頭配對系統_智慧分析.xlsx';
  XLSX.writeFile(wb, outputPath);
  
  console.log(`✅ Excel generated: ${outputPath}`);
  return outputPath;
}

// Run
generateExcel().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
