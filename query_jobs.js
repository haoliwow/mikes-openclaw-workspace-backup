const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    console.log('✅ Connected');
    return client.query(`SELECT * FROM jobs LIMIT 3;`);
  })
  .then(res => {
    console.log('\n📊 Sample jobs:');
    console.log(JSON.stringify(res.rows, null, 2));
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
