const { Pool } = require('pg');

const pool = new Pool({
  host: 'tpe1.clusters.zeabur.com',
  port: 27883,
  database: 'zeabur',
  user: 'root',
  password: 'etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q'
});

(async () => {
  try {
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`
    );
    console.log('📊 Available tables:');
    result.rows.forEach(row => console.log('  -', row.table_name));
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
