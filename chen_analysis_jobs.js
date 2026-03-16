const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
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
      ORDER BY id DESC;
    `);
  })
  .then(res => {
    console.log(`✅ Retrieved ${res.rows.length} open positions from system\n`);
    res.rows.forEach(job => {
      console.log(`ID: ${job.id} | ${job.position_name} | ${job.client_company}`);
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
