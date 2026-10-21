#!/bin/zsh
# Usage: scripts/commit-week.sh <week-id | unit-pq> "<message>". Commit one week self-consistently: spec, every file named <week>* (incl. weeks/<week>.md, audio/<week>.md), shared
# cards with origin = week, its explainers, and a manifest = HEAD's manifest + this week's entries only.
set -e
W=$1; MSG=$2; cd "$(dirname "$0")/.."
if [[ $W == *-pq ]]; then U=${W%-pq}; git add content-src/$W.yaml src/content/questions/$U-w00-*; W=$U-w00; fi
[[ -f content-src/$W.yaml ]] && git add content-src/$W.yaml
[[ -f content-src/aids/$W.yaml ]] && git add content-src/aids/$W.yaml   # study aids; their files match src/content/*/$W* below
git add src/content/*/$W* docs/plans/explainers-2026-10.md
for f in $(grep -l "^origin: $W\$" src/content/cases/*.md src/content/authorities/*.md 2>/dev/null); do git add "$f"; done
node -e "const m=require('./src/components/explainers/manifest.json');for(const[k,v]of Object.entries(m))if(k.startsWith('$W-'))console.log('src/components/explainers/'+v.module+'.tsx')" | xargs git add
node -e "
const {execSync}=require('child_process'),fs=require('fs');
const head=JSON.parse(execSync('git show HEAD:src/components/explainers/manifest.json'));
const cur=JSON.parse(fs.readFileSync('src/components/explainers/manifest.json'));
for(const[k,v]of Object.entries(cur))if(k.startsWith('$W-'))head[k]=v;
const blob=execSync('git hash-object -w --stdin',{input:JSON.stringify(head,null,2)+'\n'}).toString().trim();
execSync('git update-index --cacheinfo 100644,'+blob+',src/components/explainers/manifest.json');"
X=$(mktemp -d); rm -rf $X; mkdir -p $X; git checkout-index -a --prefix=$X/
R=$PWD; (cd $X && node $R/scripts/validate.mjs src/content >/dev/null) || { echo "staged tree does not validate"; exit 1; }
git commit -qm "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git log --oneline -1 | cut -c1-90; git show --stat HEAD | tail -1
