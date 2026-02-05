# OPENCLAW_SOP.md（本機可落地版）

> 目標：把「技能書」裡偏 Clawdbot/agent-browser 的做法，轉成目前這台 OpenClaw 環境真的能執行的流程。

## 0) 硬規則（不要踩雷）
- **不瞎編**：拿不到資料就寫「（此環境無法取得）」。
- **敏感操作先確認**：寄信/公開發文/刪除檔案/花錢/付款送出 → 先問。
- **自動化到確認頁為止**：涉及金流或不可逆提交，最後一步由人按。

## 1) 常用工具對照
- 讀檔/寫檔/改檔：`read` / `write` / `edit`
- 跑指令（本機）：`exec`
- 排程提醒/週期任務：`cron`
- 發 Telegram 訊息：`message.send`（可指定 `target` + `threadId`）
- 網頁自動化：`browser`（建議 `snapshot refs=aria`，再用 `act` 點按/輸入）
- 查本 session 用量卡：`session_status`

## 2) Telegram 投遞設定（AIJob 用量回報）
- 群組 chat_id：`-1003195398232`
- 用量回報 threadId：`514`
- 格式：
  1. 【用量回報｜YYYY-MM-DD HH:mm（Asia/Taipei）】
  2. 本 session 狀態（能拿到就寫）
  3. 額度/配額（拿不到就明講未提供）
  4. 重要提醒（有才寫）
  - 5–10 行內，避免刷屏。

## 3) 「每 4 小時用量回報」落地流程
1. 取用量：呼叫 `session_status`
2. 組字串：依格式輸出（中文精簡）
3. 發訊：`message.send` 到 `target=-1003195398232`、`threadId=514`
4. 若誤發非格式內容：`message.delete` 刪掉重發

## 4) Browser 自動化（OpenClaw 版）
- 用 `browser.snapshot`（建議 `refs="aria"`）取得可點元素
- 用 `browser.act` 進行 click/type/press/select
- 遇到 captcha/驗證：停止並請人介入

## 5) 之後我會做的「可直接交付」
- 把 skillbooks 裡的 USER/TOOLS/HEARTBEAT 範例，改寫成你這台機器的版本並落在 workspace 根目錄。
- 針對你指定的每日/每週會報，做成可直接 `cron.add` 的設定。
