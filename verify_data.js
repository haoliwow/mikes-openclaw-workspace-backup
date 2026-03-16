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
    // 檢查 candidates_pipeline 表結構
    const schemaResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'candidates_pipeline'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 candidates_pipeline 表結構:');
    schemaResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\n📊 查詢 ID 69, 72, 93 的數據:\n');
    
    // 查詢這三位候選人的完整資料
    const candidates = await pool.query(
      'SELECT id, name, current_position, current_company, linkedin_url FROM candidates_pipeline WHERE id IN (69, 72, 93);'
    );
    
    candidates.rows.forEach(row => {
      console.log(`#${row.id} ${row.name}:`);
      console.log(`  position: ${row.current_position || 'NULL'}`);
      console.log(`  company: ${row.current_company || 'NULL'}`);
      console.log(`  linkedin: ${row.linkedin_url || 'NULL'}\n`);
    });
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
