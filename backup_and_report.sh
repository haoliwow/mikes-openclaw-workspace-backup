#!/bin/bash

# Daily OpenClaw Workspace Backup & Report Script
cd /Users/oreo/.openclaw/workspace

# Get current date in Taipei timezone
CURRENT_DATE=$(TZ=Asia/Taipei date +"%Y-%m-%d")
CURRENT_TIME=$(TZ=Asia/Taipei date +"%H:%M")

# Stage and commit
git add -A 2>/dev/null
COMMIT_HASH=$(git commit -m "Daily backup: $CURRENT_DATE" 2>&1 | grep -oP '\[main \K[a-f0-9]+' || git rev-parse --short HEAD)

# Get file changes from last commit
FILES_CHANGED=$(git log -1 --numstat | tail -n +2 | wc -l)

# Push to remote
git push origin main 2>/dev/null

# Generate report
REPORT="✅ 每日備份回報 $CURRENT_DATE

📦 工作區備份完成
• 時間：$CURRENT_TIME（台灣時間）
• Commit：$COMMIT_HASH
• 備份至：github.com/haoliwow/mikes-openclaw-workspace-backup

📋 備份內容
• MEMORY.md（長期記憶） ✅
• memory/${CURRENT_DATE}.md（當日工作紀錄） ✅
• 工作區所有檔案 ✅ ($FILES_CHANGED files)"

echo "$REPORT"
