#!/usr/bin/env bash
# Pusht de huidige feature-branch (nooit main) en herinnert aan de preview-check.
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ]; then
  echo "Fout: je zit op de main-branch. Pushen vanaf main is niet toegestaan." >&2
  echo "Maak eerst een branch, bijvoorbeeld:" >&2
  echo "  git checkout -b mijn-wijziging" >&2
  exit 1
fi

if [ "$#" -lt 1 ]; then
  echo "Gebruik: ./safe-deploy.sh \"commit message\"" >&2
  exit 1
fi

message="$1"

git add -A
git commit -m "$message"
git push -u origin "$branch"

cat <<EOF

Gepusht naar branch '$branch'.

Volgende stappen:
  1. Controleer de Vercel preview-URL voor deze branch (te vinden bij de
     commit/PR op GitHub, of in het Vercel-dashboard).
  2. Alles goed? Merge dan zelf handmatig naar main:
       git checkout main && git merge $branch && git push
EOF
