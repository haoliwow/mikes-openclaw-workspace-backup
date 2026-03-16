const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    // 查詢Senior/Lead/Architect級別職缺
    return client.query(`
      SELECT 
        id, 
        position_name, 
        client_company, 
        key_skills, 
        experience_required, 
        location,
        salary_min, 
        salary_max,
        talent_profile
      FROM jobs_pipeline 
      WHERE job_status = '招募中'
        AND (
          position_name ILIKE '%Lead%'
          OR position_name ILIKE '%Senior%'
          OR position_name ILIKE '%Principal%'
          OR position_name ILIKE '%Architect%'
          OR position_name ILIKE '%Tech Lead%'
        )
      ORDER BY salary_max DESC NULLS LAST
      LIMIT 15;
    `);
  })
  .then(res => {
    console.log(`📊 Senior/Lead/Architect positions for Yuan-Chen Chang (Current: 140-160K):\n`);
    res.rows.forEach((job, idx) => {
      console.log(`[${idx+1}] ID: ${job.id} | ${job.position_name}`);
      console.log(`    Company: ${job.client_company}`);
      console.log(`    Salary: ${job.salary_min}K - ${job.salary_max}K`);
      console.log(`    Experience: ${job.experience_required}`);
      console.log(`    Skills: ${job.key_skills?.substring(0, 80)}...`);
      console.log('');
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
