const { Pool } = require('pg');

const pool = new Pool({
  host: 'tpe1.clusters.zeabur.com',
  port: 27883,
  database: 'zeabur',
  user: 'root',
  password: 'etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q'
});

const updates = [
  {
    id: 69,
    name: 'Jia-Hau Ching',
    current_position: 'AI Engineer',
    current_company: 'Taiwan Mobile',
    linkedin_url: 'https://www.linkedin.com/in/jia-hau-ching'
  },
  {
    id: 72,
    name: 'Chun-Pei Cheng',
    current_position: 'Manager, Machine Learning Engineering',
    current_company: 'Micron Technology',
    linkedin_url: 'https://www.linkedin.com/in/chun-pei-cheng-phd-06010268'
  },
  {
    id: 93,
    name: 'Guan-Lin Chen',
    current_position: 'Sr. Engineer (Frontend)',
    current_company: 'Yahoo Taiwan E-Commerce',
    linkedin_url: 'https://www.linkedin.com/in/guan-lin-chen-36980b58'
  }
];

(async () => {
  try {
    for (const candidate of updates) {
      const query = `
        UPDATE candidates_pipeline 
        SET current_position = $1, 
            current_company = $2, 
            linkedin_url = $3
        WHERE id = $4
        RETURNING id, name, current_position, current_company, linkedin_url;
      `;
      
      const result = await pool.query(query, [
        candidate.current_position,
        candidate.current_company,
        candidate.linkedin_url,
        candidate.id
      ]);
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        console.log(`✅ #${candidate.id} ${candidate.name}:`);
        console.log(`   Position: ${row.current_position}`);
        console.log(`   Company: ${row.current_company}`);
        console.log(`   LinkedIn: ${row.linkedin_url}\n`);
      } else {
        console.log(`⚠️ #${candidate.id} ${candidate.name}: Not found in database\n`);
      }
    }
    
    await pool.end();
    console.log('✅ All updates completed');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
})();
