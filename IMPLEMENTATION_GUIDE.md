# Branch Merge Implementation Guide

## Quick Start Commands

### Step 1: Repository Setup
```bash
# Navigate to your repository
cd Brokeranalysisgooglestudio

# Create backup branch
git checkout main
git branch backup-main-$(date +%Y%m%d-%H%M%S)
git push origin backup-main-$(date +%Y%m%d-%H%M%S)

# Update main branch
git fetch origin
git pull origin main
```

### Step 2: Branch Discovery
```bash
# List all branches
git branch -a

# Get detailed branch information
git for-each-ref --sort=-committerdate --format='%(refname:short) | %(committerdate) | %(subject)' refs/heads/ refs/remotes/origin/

# Save branch list to file
git branch -r | grep -v HEAD | sed 's/origin\///' > branches.txt
```

### Step 3: Automated Merge Script
Create a file called `merge-branches.sh`:

```bash
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
```

### Step 4: Manual Merge Commands
If you prefer to merge branches manually:

```bash
# For each branch you want to merge:
git checkout branch-name
git pull origin branch-name
git merge main
# Resolve conflicts if any
git checkout main
git merge --no-ff branch-name -m "Merge branch 'branch-name' into main"
git push origin main
git branch -d branch-name
git push origin --delete branch-name
```

## GitHub Web Interface Alternative

If you prefer using the GitHub web interface:

1. **Create Pull Requests**
   - Go to your repository on GitHub
   - Click "New pull request"
   - Select each branch as source, main as target
   - Create pull request for each branch

2. **Merge Pull Requests**
   - Review each pull request
   - Resolve conflicts using GitHub's conflict editor
   - Merge pull requests one by one

3. **Clean Up**
   - Delete merged branches through the interface
   - Update any related issues

## Conflict Resolution Guide

### Common Conflict Scenarios

1. **Package.json conflicts**
```json
// Choose the highest version number
"dependencies": {
  "react": "^18.2.0",  // Keep the newer version
  "vue": "^3.3.0"     // Keep the newer version
}
```

2. **Import statement conflicts**
```javascript
// Choose the correct import path
import { Component } from '../components/Component';  // Keep correct path
```

3. **CSS conflicts**
```css
/* Combine styles or choose the most recent version */
.button {
  background-color: #007bff;  /* Keep the desired color */
  padding: 10px 20px;         /* Combine properties */
}
```

### Conflict Resolution Steps

1. **Identify conflicts**
```bash
git status  # Shows conflicted files
git diff    # Shows conflict details
```

2. **Edit files to resolve conflicts**
   - Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
   - Choose appropriate code sections
   - Remove conflict markers

3. **Test resolution**
```bash
npm test
npm run build
```

4. **Commit resolution**
```bash
git add .
git commit -m "Resolve merge conflicts"
```

## Post-Merge Verification

### Automated Checks
```bash
# Run all tests
npm test

# Check build
npm run build

# Check for linting issues
npm run lint

# Type checking
npm run type-check
```

### Manual Checklist
- [ ] Application starts without errors
- [ ] All main features work correctly
- [ ] Database connections function
- [ ] API endpoints respond correctly
- [ ] UI renders properly
- [ ] No console errors in browser

## Rollback Procedures

### If Something Goes Wrong
```bash
# Option 1: Use backup branch
git checkout backup-main-[timestamp]
git push -f origin backup-main-[timestamp]:main

# Option 2: Reset to previous commit
git log --oneline  # Find the commit before the merge
git reset --hard <commit-hash>
git push -f origin main

# Option 3: Revert merge commits
git revert -m 1 <merge-commit-hash>
git push origin main
```

## Tips for Success

1. **Work in small batches** - Merge 2-3 branches at a time
2. **Test after each merge** - Don't wait until the end
3. **Keep good notes** - Document decisions and issues
4. **Communicate with team** - Let others know what you're doing
5. **Take breaks** - Don't rush the process

## Timeline

- **Preparation**: 30 minutes
- **Branch discovery**: 15 minutes
- **Merging**: 2-4 hours (depending on conflicts)
- **Testing**: 1-2 hours
- **Cleanup**: 30 minutes

## Support

If you encounter issues:
1. Check the merge log file
2. Review failed branches list
3. Use rollback procedures if needed
4. Contact repository maintainer for assistance