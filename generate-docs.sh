#!/bin/bash
# Script tự động tạo file docs/log-phattrien-$(date +%Y-%m-%d).md sau mỗi lần commit

DOCS_DIR="docs/phattrien"
LOG_FILE="$DOCS_DIR/log-phattrien-$(date +%Y-%m-%d).md"

mkdir -p "$DOCS_DIR"

echo "# Log phát triển ngày $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "## Commit mới nhất:" >> "$LOG_FILE"
git log -1 --pretty=format:"- %h %s (%an)" >> "$LOG_FILE"
echo "\n## Files thay đổi:" >> "$LOG_FILE"
git diff-tree --no-commit-id --name-only -r HEAD >> "$LOG_FILE"
echo -e "\n---\n" >> "$LOG_FILE"
