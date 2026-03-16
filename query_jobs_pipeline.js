const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    // 查詢前 3 個職缺看結構
    return client.query(`
      SELECT id, title, company, description, skills, salary_min, salary_max 
      FROM jobs_pipeline 
      ORDER BY id 
      LIMIT 3;
    `);
  })
  .then(res => {
    console.log('📊 Sample jobs_pipeline data:\n');
    res.rows.forEach((job, idx) => {
      console.log(`\n[${idx+1}] ID: ${job.id}`);
      console.log(`    Title: ${job.title}`);
      console.log(`    Company: ${job.company}`);
      console.log(`    Salary: ${job.salary_min} - ${job.salary_max}`);
      console.log(`    Skills: ${job.skills}`);
    });
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
