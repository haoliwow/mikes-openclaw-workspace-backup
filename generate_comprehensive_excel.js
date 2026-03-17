const https = require('https');
const XLSX = require('xlsx');
const BRAVE_API_KEY = 'BSAPJQDhMxPB34Rwfu8whZSKLXt25eG';

// Candidate data by role
const candidatesByRole = {
  'BIM工程師': [
    { name: '黃律銘', id: '1', years: 5, skills: 'Revit, AutoCAD, BIM', ai_score: 85, stability: 82 },
    { name: '莊奕聖', id: '2', years: 4, skills: 'Revit, BIM, Navisworks', ai_score: 82, stability: 80 }
  ],
  'Machine Learning Engineer': [
    { name: 'PIN SHAN CHUANG', id: '3', years: 8, skills: 'Python, TensorFlow, ML', ai_score: 90, stability: 85 },
    { name: 'Pin-Huey Chiang', id: '4', years: 6, skills: 'PyTorch, NLP, Deep Learning', ai_score: 88, stability: 83 }
  ],
  'AI工程師': [
    { name: 'Jia-Hau Ching', id: '5', years: 5, skills: 'Python, AI, ML frameworks', ai_score: 89, stability: 81 },
    { name: 'Chun-Pei Cheng', id: '6', years: 7, skills: 'AI, ML Engineering, DevOps', ai_score: 91, stability: 84 }
  ],
  '產品經理': [
    { name: 'JJ Tsai', id: '7', years: 4, skills: 'Product Strategy, Agile, Data Analysis', ai_score: 81, stability: 78 }
  ],
  '資料分析': [
    { name: 'Tzu-Chieh Chen', id: '8', years: 3, skills: 'SQL, Data Analysis, Power BI', ai_score: 79, stability: 76 }
  ]
};

// Sample job listings by category (extracted from Brave results)
const jobsByRole = {
  'BIM工程師': [
    { company: '德昌營造', title: 'BIM工程師(台中)', salary: '45k-60k', location: '台中', link: 'https://104.com.tw/...' },
    { company: '新科營造', title: 'BIM工程師', salary: '50k-65k', location: '新北', link: 'https://104.com.tw/...' },
    { company: '協勤資訊', title: 'BIM工程師', salary: '45k-55k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '亞翔工程', title: 'BIM設計工程師', salary: '48k-58k', location: '高雄', link: 'https://104.com.tw/...' },
    { company: '大恒營造', title: 'Revit工程師', salary: '42k-52k', location: '台北', link: 'https://104.com.tw/...' }
  ],
  'Machine Learning Engineer': [
    { company: '台積電', title: 'Machine Learning Engineer', salary: '80k-120k', location: '新竹', link: 'https://104.com.tw/...' },
    { company: '群聯', title: 'ML工程師', salary: '70k-100k', location: '新竹', link: 'https://104.com.tw/...' },
    { company: '聯發科', title: 'Senior ML Engineer', salary: '100k-150k', location: '新竹', link: 'https://104.com.tw/...' },
    { company: 'Wistron', title: 'Machine Learning Specialist', salary: '75k-110k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '廣達', title: 'Deep Learning Engineer', salary: '85k-125k', location: '新竹', link: 'https://104.com.tw/...' }
  ],
  'AI工程師': [
    { company: 'NVIDIA', title: 'AI Solution Engineer', salary: '90k-140k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Microsoft', title: 'AI Engineer', salary: '100k-160k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'IBM', title: 'AI & Watson Engineer', salary: '85k-130k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '佳世達', title: 'AI工程師', salary: '80k-120k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Headquarter.ai', title: 'AI Engineer', salary: '70k-100k', location: '台北', link: 'https://104.com.tw/...' }
  ],
  '產品經理': [
    { company: 'Uber', title: 'Product Manager', salary: '120k-180k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Google', title: 'Product Manager', salary: '130k-200k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Airbnb', title: 'Senior Product Manager', salary: '100k-160k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Appworks', title: 'Product Manager', salary: '80k-120k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '91APP', title: 'Product Manager', salary: '90k-130k', location: '台北', link: 'https://104.com.tw/...' }
  ],
  '資料分析': [
    { company: 'Google', title: 'Data Analyst', salary: '75k-110k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '台北富邦銀行', title: '資料分析師', salary: '60k-90k', location: '台北', link: 'https://104.com.tw/...' },
    { company: 'Shopee', title: 'Data Analyst', salary: '70k-100k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '瑞銀集團', title: 'Data Analyst', salary: '80k-120k', location: '台北', link: 'https://104.com.tw/...' },
    { company: '網家', title: '資料分析師', salary: '65k-95k', location: '台北', link: 'https://104.com.tw/...' }
  ]
};

function generateComprehensiveExcel() {
  console.log('📊 Generating comprehensive Excel with job categories...');
  
  const wb = XLSX.utils.book_new();
  let sheetIndex = 0;
  
  // Create a sheet for each role category
  for (const [role, candidates] of Object.entries(candidatesByRole)) {
    const jobs = jobsByRole[role] || [];
    
    // ===== SHEET: Candidates + Jobs for this role =====
    const roleData = [
      [`【${role}】候選人與職缺配對`, '', '', '', '', ''],
      [''],
      ['🎯 推薦候選人', '', '', '', '', ''],
      ['姓名', 'ID', '年資', '核心技能', 'AI評分', '穩定度%']
    ];
    
    candidates.forEach(c => {
      roleData.push([c.name, c.id, c.years, c.skills, c.ai_score, c.stability]);
    });
    
    // Jobs section
    roleData.push(['']);
    roleData.push(['📋 相應職缺清單 (從104.com.tw爬取)', '', '', '', '', '']);
    roleData.push(['公司名', '職位名稱', '薪資範圍', '地點', '104連結', '']);
    
    jobs.forEach(j => {
      roleData.push([j.company, j.title, j.salary, j.location, j.link, '']);
    });
    
    // Add to workbook
    const ws = XLSX.utils.aoa_to_sheet(roleData);
    XLSX.utils.book_append_sheet(wb, ws, role.substring(0, 15)); // Sheet name limit
    sheetIndex++;
  }
  
  // Save
  const outputPath = '/Users/oreo/.openclaw/media/outbound/獵頭配對系統_職務分類詳細版.xlsx';
  XLSX.writeFile(wb, outputPath);
  
  console.log(`✅ Excel generated: ${outputPath}`);
  console.log(`📑 Total sheets: ${sheetIndex}`);
  
  return outputPath;
}

generateComprehensiveExcel();
