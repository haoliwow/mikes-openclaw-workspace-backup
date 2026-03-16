const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur'
});

client.connect()
  .then(() => {
    return client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
  })
  .then(res => {
    console.log('📋 Available tables in zeabur database:');
    res.rows.forEach(r => console.log('  -', r.table_name));
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
