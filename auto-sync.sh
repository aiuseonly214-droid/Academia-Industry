#!/usr/bin/env bash

# ========================================================
#       GitHub Auto Push / Pull / Sync Script for Git Bash
# ========================================================

ACTION="${1:-sync}"
COMMIT_MSG="$2"

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ -z "$BRANCH" ]; then
    echo "❌ Error: Not a git repository or Git is not installed."
    exit 1
fi

# Get remote url
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null)
if [ -z "$REMOTE_URL" ]; then
    echo "❌ Error: No remote 'origin' configured."
    exit 1
fi

echo "========================================================"
echo " Branch     : $BRANCH"
echo " Remote URL : $REMOTE_URL"
echo " Action     : $ACTION"
echo "========================================================"

do_pull() {
    echo "📥 Pulling latest changes from origin/$BRANCH..."
    git pull origin "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "❌ Pull failed or encountered merge conflicts."
        return 1
    fi
    echo "✅ Pull completed successfully."
    return 0
}

do_push() {
    local msg="$1"
    if [ -z "$msg" ]; then
        msg="Auto update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi

    echo "📦 Staging all changes..."
    git add -A

    # Check if there are staged changes
    if ! git diff --cached --quiet; then
        echo "📝 Committing changes: '$msg'..."
        git commit -m "$msg"
    else
        echo "ℹ️ No new changes to commit. Checking for unpushed commits..."
    fi

    echo "🚀 Pushing to origin/$BRANCH..."
    git push -u origin "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "❌ Push failed."
        return 1
    fi
    echo "✅ Push completed successfully!"
    return 0
}

case "$ACTION" in
    pull)
        do_pull
        ;;
    push)
        do_push "$COMMIT_MSG"
        ;;
    sync)
        echo "🔄 Performing Sync (Pull then Push)..."
        if do_pull; then
            echo ""
            do_push "$COMMIT_MSG"
        fi
        ;;
    *)
        echo "Usage: ./auto-sync.sh [pull|push|sync] [\"commit message\"]"
        echo "Examples:"
        echo "  ./auto-sync.sh pull"
        echo "  ./auto-sync.sh push \"My commit message\""
        echo "  ./auto-sync.sh sync \"Syncing my work\""
        exit 1
        ;;
esac
