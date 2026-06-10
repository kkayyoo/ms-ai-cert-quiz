#!/bin/bash
# Heartbeat monitor for ms-ai-cert-quiz sub-agents
LOG="/home/azureuser/ms-ai-cert-quiz/heartbeat.log"
REPO="/home/azureuser/ms-ai-cert-quiz"

echo "=== HEARTBEAT $(date -u '+%Y-%m-%d %H:%M UTC') ===" >> "$LOG"

# Check git log - recent commits
echo "--- Recent commits ---" >> "$LOG"
cd "$REPO" && git log --oneline -10 2>&1 >> "$LOG"

# Check data files
echo "--- Data files ---" >> "$LOG"
for f in "data/ai-900/questions.json" "data/ai-102/questions.json"; do
  if [ -f "$REPO/$f" ]; then
    COUNT=$(node -e "const q=JSON.parse(require('fs').readFileSync('$REPO/$f','utf8')); console.log(Array.isArray(q)?q.length:'invalid')" 2>/dev/null || echo "parse error")
    echo "  $f: $COUNT questions" >> "$LOG"
  else
    echo "  $f: NOT YET CREATED" >> "$LOG"
  fi
done

# Check src files
echo "--- Source files ---" >> "$LOG"
find "$REPO/src" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | xargs echo "  TypeScript files:" >> "$LOG"

# Check package.json
if [ -f "$REPO/package.json" ]; then
  echo "  package.json: EXISTS" >> "$LOG"
else
  echo "  package.json: NOT YET CREATED" >> "$LOG"
fi

echo "--- End heartbeat ---" >> "$LOG"
