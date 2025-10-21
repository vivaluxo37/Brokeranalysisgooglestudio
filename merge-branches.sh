#!/bin/bash

# Configuration
MAIN_BRANCH="main"
BACKUP_CREATED=false
MERGE_LOG="merge-log.txt"
FAILED_BRANCHES="failed-branches.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$MERGE_LOG"
}

# Create backup
create_backup() {
    if [ "$BACKUP_CREATED" = false ]; then
        log "Creating backup of $MAIN_BRANCH..."
        git checkout "$MAIN_BRANCH"
        git pull origin "$MAIN_BRANCH"
        BACKUP_BRANCH="backup-$MAIN_BRANCH-$(date +%Y%m%d-%H%M%S)"
        git branch "$BACKUP_BRANCH"
        git push origin "$BACKUP_BRANCH"
        log "Backup created: $BACKUP_BRANCH"
        BACKUP_CREATED=true
    fi
}

# Merge single branch
merge_branch() {
    local branch=$1
    log "Starting merge for branch: $branch"
    
    # Checkout and update branch
    git checkout "$branch"
    if ! git pull origin "$branch"; then
        log "${RED}Failed to pull branch $branch${NC}"
        echo "$branch" >> "$FAILED_BRANCHES"
        return 1
    fi
    
    # Merge main into branch first
    if ! git merge "$MAIN_BRANCH" -m "Merge $MAIN_BRANCH into $branch"; then
        log "${RED}Conflict merging $MAIN_BRANCH into $branch${NC}"
        git merge --abort
        echo "$branch" >> "$FAILED_BRANCHES"
        return 1
    fi
    
    # Switch to main and merge branch
    git checkout "$MAIN_BRANCH"
    if ! git merge --no-ff "$branch" -m "Merge branch '$branch' into $MAIN_BRANCH"; then
        log "${RED}Conflict merging $branch into $MAIN_BRANCH${NC}"
        git merge --abort
        echo "$branch" >> "$FAILED_BRANCHES"
        return 1
    fi
    
    # Push the merge
    if ! git push origin "$MAIN_BRANCH"; then
        log "${RED}Failed to push $MAIN_BRANCH after merging $branch${NC}"
        echo "$branch" >> "$FAILED_BRANCHES"
        return 1
    fi
    
    # Delete merged branch
    git branch -d "$branch"
    git push origin --delete "$branch"
    
    log "${GREEN}Successfully merged branch: $branch${NC}"
    return 0
}

# Main execution
main() {
    log "Starting branch merge process..."
    
    # Initialize log files
    echo "Branch Merge Log - $(date)" > "$MERGE_LOG"
    echo "" > "$FAILED_BRANCHES"
    
    # Create backup
    create_backup
    
    # Get list of branches (excluding main and backup branches)
    branches=($(git branch -r | grep -v HEAD | grep -v "$MAIN_BRANCH" | sed 's/origin\///' | grep -v "backup-"))
    
    log "Found ${#branches[@]} branches to merge"
    
    # Merge each branch
    success_count=0
    failure_count=0
    
    for branch in "${branches[@]}"; do
        if merge_branch "$branch"; then
            ((success_count++))
        else
            ((failure_count++))
        fi
    done
    
    # Summary
    log "Merge process completed:"
    log "Successful merges: $success_count"
    log "Failed merges: $failure_count"
    
    if [ "$failure_count" -gt 0 ]; then
        log "${RED}Failed branches:$(cat $FAILED_BRANCHES)${NC}"
        log "Please resolve conflicts manually for failed branches"
    fi
    
    log "${GREEN}Merge process completed!${NC}"
}

# Run main function
main "$@"