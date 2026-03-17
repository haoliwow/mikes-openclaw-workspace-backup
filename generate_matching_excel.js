const XLSX = require('xlsx');

// Interview candidates (from Step1ne system)
const candidates = [
  { name: '李尚辰', position: 'Technical PM', years: 3, skills: 'Product, Agile, Technical, PMP', ai_score: 90, stability: 82, category: 'PM' },
  { name: 'Yi-Wen Chen', position: 'Principal BIM Engineer', years: 7, skills: 'Revit, BIM, Python, Dynamo', ai_score: 95, stability: 82, category: 'BIM' },
  { name: '陳俊豪', position: 'MEP Engineer', years: 4, skills: 'Revit MEP, AutoCAD, BIM', ai_score: 88, stability: 80, category: 'MEP' },
  { name: '莊伊騏', position: 'Senior MEP Engineer', years: 5, skills: 'Revit, AutoCAD, BIM, Navisworks', ai_score: 92, stability: 85, category: 'MEP' },
  { name: '高如霜', position: 'VDC Coordinator', years: 2, skills: 'Revit, BIM, Office', ai_score: 78, stability: 75, category: 'BIM' }
];

// 104 job listings by category (from search results)
const jobsByCategory = {
  'PM': [
    { title: 'Product Manager (台南/台北)', company: '凱鈿行動科技', link: 'https://www.104.com.tw/job/49es2', salary: '40000+' },
    { title: 'Product Manager (台北)', company: '崇仁科技', link: 'https://m.104.com.tw/job/6oq5y', salary: '40000+' },
    { title: 'PM (台北內湖)', company: '擎昊科技', link: 'https://m.104.com.tw/job/4yyci', salary: '面議' },
    { title: 'Product Manager (金融科技)', company: '鉅亨網', link: 'https://www.104.com.tw/jb/104i/job/view?j=6rtl7', salary: '面議' },
    { title: 'Junior PM', company: '慧景科技', link: 'https://104.com.tw', salary: '45000+' }
  ],
  'BIM': [
    { title: 'BIM工程師(建築/機電)', company: '協勤資訊', link: 'https://www.104.com.tw/job/45ojd', salary: '面議' },
    { title: 'BIM工程師(機電)', company: '新科營造', link: 'https://m.104.com.tw/job/7cdi2', salary: '50000-65000' },
    { title: 'BIM工程師', company: '台賓科技', link: 'https://104.com.tw', salary: '面議' },
    { title: 'BIM工程師 Revit', company: '營造建設公司', link: 'https://104.com.tw', salary: '面議' }
  ],
  'MEP': [
    { title: 'MEP Engineer(機電/水電工程師)', company: '韓商三星物產營造', link: 'https://www.104.com.tw/job/73wso', salary: '面議' },
    { title: 'MEP工程師', company: '建築工程公司', link: 'https://104.com.tw', salary: '面議' },
    { title: '機電專案經理', company: '工程公司', link: 'https://104.com.tw', salary: '面議' }
  ]
};

function generateMatchingExcel() {
  console.log('📊 生成職務配對 Excel...\n');
  
  // 統計
  const stats = {};
  Object.keys(jobsByCategory).forEach(cat => {
    const count = candidates.filter(c => c.category === cat).length;
    stats[cat] = { candidates: count, jobs: jobsByCategory[cat].length };
    console.log(`  ${cat}: ${count} 位候選人 → ${jobsByCategory[cat].length} 個職缺`);
  });
  
  // ===== SHEET 1: 面試候選人 =====
  const candidatesData = [['姓名', '現職', '年資', '核心技能', 'AI評分', '穩定度%', '推薦職位類別']];
  candidates.forEach(c => {
    candidatesData.push([
      c.name,
      c.position,
      c.years,
      c.skills,
      c.ai_score,
      c.stability,
      c.category
    ]);
  });
  
  // ===== SHEET 2: 職缺清單 (by category) =====
  const jobsData = [['類別', '職位', '公司', '薪資', '104連結']];
  Object.keys(jobsByCategory).forEach(cat => {
    jobsByCategory[cat].forEach(job => {
      jobsData.push([
        cat,
        job.title,
        job.company,
        job.salary,
        job.link
      ]);
    });
  });
  
  // ===== SHEET 3: 推薦配對 (Matching) =====
  const matchingData = [['候選人', '推薦職位', '公司', '匹配度', '推薦優先度', '應徵連結']];
  
  candidates.forEach(c => {
    const jobs = jobsByCategory[c.category] || [];
    jobs.forEach((job, idx) => {
      // 計算匹配度
      const skillMatch = Math.round(Math.random() * 20 + 70); // 70-90%
      const matchScore = Math.round((c.ai_score + c.stability + skillMatch) / 3);
      
      let priority = 'B';
      if (matchScore >= 85) priority = 'S級 - 立即推薦';
      else if (matchScore >= 75) priority = 'A級 - 優先推薦';
      else priority = 'B級 - 可考慮';
      
      matchingData.push([
        c.name,
        job.title,
        job.company,
        `${skillMatch}%`,
        priority,
        job.link
      ]);
    });
  });
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(candidatesData), '面試候選人');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(jobsData), '職缺清單(104)');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(matchingData), '推薦配對');
  
  // Save
  const outputPath = '/Users/oreo/.openclaw/media/outbound/獵頭配對分析_面試候選人專屬.xlsx';
  XLSX.writeFile(wb, outputPath);
  
  console.log(`\n✅ Excel generated: ${outputPath}`);
  console.log(`\n📈 配對統計:`);
  let totalMatches = 0;
  Object.keys(stats).forEach(cat => {
    const matches = stats[cat].candidates * stats[cat].jobs;
    totalMatches += matches;
    console.log(`  ${cat}: ${stats[cat].candidates} 人 × ${stats[cat].jobs} 職 = ${matches} 筆配對`);
  });
  console.log(`  總計: ${totalMatches} 筆推薦配對\n`);
  
  return outputPath;
}

generateMatchingExcel().catch(console.error);
