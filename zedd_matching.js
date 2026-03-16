const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    // 查詢所有招募中的職缺，找最匹配Zedd的
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
        job_description,
        talent_profile
      FROM jobs_pipeline 
      WHERE job_status = '招募中'
        AND (
          position_name ILIKE '%Engineer%' 
          OR position_name ILIKE '%Architect%'
          OR position_name ILIKE '%DevOps%'
          OR position_name ILIKE '%Backend%'
          OR position_name ILIKE '%SRE%'
          OR position_name ILIKE '%Cloud%'
          OR key_skills ILIKE '%Terraform%'
          OR key_skills ILIKE '%Kubernetes%'
          OR key_skills ILIKE '%AWS%'
          OR key_skills ILIKE '%GCP%'
        )
      ORDER BY id DESC
      LIMIT 30;
    `);
  })
  .then(res => {
    console.log(`📊 Found ${res.rows.length} relevant open positions for Zedd Pai:\n`);
    res.rows.forEach((job, idx) => {
      console.log(`[${idx+1}] ID: ${job.id} | ${job.position_name}`);
      console.log(`    Company: ${job.client_company}`);
      console.log(`    Salary: ${job.salary_min}K - ${job.salary_max}K`);
      console.log(`    Location: ${job.location}`);
      console.log(`    Experience: ${job.experience_required}`);
      console.log(`    Key Skills: ${job.key_skills?.substring(0, 80)}...`);
      console.log('');
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
