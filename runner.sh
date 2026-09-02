#!/bin/bash

git config --global user.email "sachit1751@gmail.com"
git config --global user.name "sachit1751-art"

MESSAGES=(
  "docs: update maintenance log"
  "refactor: minor code cleanup"
  "chore: sync tracking state"
  "fix: correct formatting output"
  "style: adjust workspace spacing"
  "test: verify utility parameters"
  "build: internal dependency sync"
  "perf: optimize background routines"
  "docs: update status metrics"
  "chore: minor repository maintenance"
)

echo "Railway 24/7 worker start..."

while true
do
  if [ ! -d ".git" ]; then
    git init
    git branch -M main
    git remote add origin https://${GH_PAT}@github.com/sachit1751-art/Sachin-portfolio-ao-studio.git
  else
    git remote set-url origin https://${GH_PAT}@github.com/sachit1751-art/Sachin-portfolio-ao-studio.git
  fi

  git fetch origin main || true
  git reset --soft origin/main || true

  RANDOM_INDEX=$(( RANDOM % ${#MESSAGES[@]} ))
  SELECTED_MSG="${MESSAGES[$RANDOM_INDEX]}"

  echo "Automated sync at $(date)" >> activity_log.txt

  git add activity_log.txt
  git commit -m "$SELECTED_MSG [skip ci]" || true
  git push origin main --force || true

  echo "Pushed! Sleeping 60 seconds..."
  sleep 60
done
