const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const inputPath = path.join(__dirname, '..', 'data', '洲子街_raw.csv');
  const outputPath = path.join(__dirname, '..', 'data', '洲子街_contacts_batch1.csv');

  const csv = fs.readFileSync(inputPath, 'utf8');
  const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) {
    console.error('no data rows');
    process.exit(1);
  }
  const header = lines[0].split(',');
  const rows = lines.slice(1)
    .map(line => line.split(','))
    .filter(cols => cols[0] && cols[0].trim());

  // 找出官網/招募平台欄位索引
  const websiteIdx = header.findIndex(h => h.includes('官網'));
  const recruitIdx = header.findIndex(h => h.includes('招募'));

  const targets = [];
  for (const cols of rows) {
    const name = cols[0] || '';
    const website = websiteIdx >= 0 ? (cols[websiteIdx] || '') : '';
    const recruit = recruitIdx >= 0 ? (cols[recruitIdx] || '') : '';
    const url = website || recruit;
    if (!url) continue;
    targets.push({ name: name.trim(), url: url.trim() });
    if (targets.length >= 50) break;
  }

  console.log(`準備處理公司數量: ${targets.length}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
  });

  const results = [];

  const phoneRegex = /(0[2-9][\-\s]?[0-9]{3,4}[\-\s]?[0-9]{4})/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  for (const [i, t] of targets.entries()) {
    console.log(`[#${i+1}/${targets.length}] ${t.name} -> ${t.url}`);
    let phone = '';
    let email = '';
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1500 + Math.random() * 1000);
      const content = await page.content();
      const phones = Array.from(content.match(phoneRegex) || []);
      const emails = Array.from(content.match(emailRegex) || []);
      phone = phones[0] || '';
      email = emails.find(e => /(info|contact|service|support|sales|hr)/i.test(e)) || emails[0] || '';
    } catch (e) {
      console.error(`  !! 抓取失敗: ${e.message}`);
    }
    results.push({ name: t.name, url: t.url, phone, email });
    await page.waitForTimeout(1000 + Math.random() * 1000);
  }

  await browser.close();

  const outLines = [];
  outLines.push('公司名稱,網址,電話,Email');
  for (const r of results) {
    const line = [r.name, r.url, r.phone, r.email]
      .map(v => '"' + (v || '').replace(/"/g, '""') + '"')
      .join(',');
    outLines.push(line);
  }
  fs.writeFileSync(outputPath, outLines.join('\n'), 'utf8');
  console.log(`輸出完成: ${outputPath}，共 ${results.length} 間公司`);
})();
