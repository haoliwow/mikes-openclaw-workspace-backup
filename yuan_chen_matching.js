const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    // 查詢Java/Backend相關職缺
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
        submission_criteria,
        interview_stages,
        rejection_criteria,
        talent_profile
      FROM jobs_pipeline 
      WHERE job_status = '招募中'
        AND (
          position_name ILIKE '%Java%'
          OR position_name ILIKE '%Backend%'
          OR position_name ILIKE '%Developer%'
          OR key_skills ILIKE '%Java%'
          OR key_skills ILIKE '%Spring%'
        )
      ORDER BY id DESC;
    `);
  })
  .then(res => {
    console.log(`📊 Found ${res.rows.length} relevant Java/Backend positions for Yuan-Chen Chang:\n`);
    res.rows.forEach((job, idx) => {
      console.log(`[${idx+1}] ID: ${job.id} | ${job.position_name}`);
      console.log(`    Company: ${job.client_company}`);
      console.log(`    Experience: ${job.experience_required}`);
      console.log(`    Skills: ${job.key_skills?.substring(0, 80)}...`);
      console.log('');
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
