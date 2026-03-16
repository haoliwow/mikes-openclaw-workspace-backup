const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    // 查詢Zedd的Top 3最匹配職缺
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
        job_description,
        talent_profile,
        rejection_criteria
      FROM jobs_pipeline 
      WHERE id IN (175, 229, 46)
      ORDER BY id DESC;
    `);
  })
  .then(res => {
    console.log(`📋 Top 3 Matching Jobs for Zedd Pai (8y System Design + Tech Lead + Cloud Architecture):\n`);
    res.rows.forEach((job, idx) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`[${idx+1}] Job ID: ${job.id} | ${job.position_name}`);
      console.log(`    Company: ${job.client_company}`);
      console.log(`    Salary: ${job.salary_min || 'N/A'} - ${job.salary_max || 'N/A'} K`);
      console.log(`    Location: ${job.location}`);
      console.log(`    Experience: ${job.experience_required || 'N/A'}`);
      console.log(`    Interview Stages: ${job.interview_stages || 'N/A'}`);
      console.log(`\n    Key Skills: ${job.key_skills}`);
      console.log(`\n    Talent Profile: ${job.talent_profile || 'N/A'}`);
      console.log(`\n    Job Description: ${job.job_description?.substring(0, 150) || 'N/A'}...`);
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
