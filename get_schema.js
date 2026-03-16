const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    return client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'jobs_pipeline'
      ORDER BY ordinal_position;
    `);
  })
  .then(res => {
    console.log('📋 jobs_pipeline columns:\n');
    res.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // 也查詢一筆完整資料
    console.log('\n📊 Sample record:\n');
    return client.query(`SELECT * FROM jobs_pipeline LIMIT 1;`);
  })
  .then(res => {
    if (res.rows[0]) {
      console.log(JSON.stringify(res.rows[0], null, 2));
    }
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
