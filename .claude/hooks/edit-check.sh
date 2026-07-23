#!/bin/bash
FILE=$(python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path","") or "")')
echo "$FILE" | grep -qE '\.(ts|vue)$' || exit 0
# Skip while the project has no package.json yet (fresh repo)
[ -f package.json ] || exit 0
pnpm typecheck && pnpm lint:file "$FILE"
