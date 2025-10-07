# Automated Blog Addition Workflow

## Workflow Overview
This system automatically adds newly created blog posts to the blog index page and updates all related inventory files.

## Process Steps

### 1. Blog Post Creation Trigger
```bash
# When a new blog post is created, trigger the workflow:
blog-create --keyword="target keyword" --author="author name"
```

### 2. Metadata Extraction
```bash
# Extract metadata from the new blog post
blog-extract-metadata --file="new-blog-post.md"
```

**Extracted Information:**
- Title and target keyword
- Author and fact-checker
- Word count and reading time
- Category and tags
- Internal links count
- FAQ count
- Creation date

### 3. Update Blog Index Page
```bash
# Automatically update blog-index.md
blog-update-index --add="new-blog-post.md"
```

**Updates Made:**
- Add to "Recent Posts" section
- Update category count
- Add to author's post count
- Update total posts statistics
- Add to featured posts if warranted

### 4. Update Metadata File
```bash
# Update blog-metadata.json
blog-update-metadata --add="new-blog-post.md"
```

**Data Updated:**
- Add post to posts array
- Update category counts
- Update author statistics
- Mark target keyword as completed
- Update completion statistics

### 5. Quality Assurance
```bash
# Automated quality checks
blog-qa-check --file="new-blog-post.md"
```

**Checks Performed:**
- SEO score calculation
- Internal link validation
- Readability assessment
- Grammar and style verification
- Mobile compatibility check

### 6. Notification System
```bash
# Send completion notifications
blog-notify --completed="new-blog-post.md"
```

**Notifications Sent:**
- Content team notification
- SEO team alert
- Social media team notification
- Analytics update

## Automation Script Example

```python
def add_new_blog_post(blog_file_path):
    """
    Automatically add new blog post to all inventory systems
    """

    # Step 1: Extract metadata
    metadata = extract_blog_metadata(blog_file_path)

    # Step 2: Update blog index
    update_blog_index(metadata)

    # Step 3: Update metadata JSON
    update_blog_metadata(metadata)

    # Step 4: Quality assurance
    qa_results = perform_qa_checks(blog_file_path)

    # Step 5: Update statistics
    update_blog_statistics(metadata)

    # Step 6: Send notifications
    send_completion_notifications(metadata)

    return {
        "status": "completed",
        "blog_id": metadata["id"],
        "qa_score": qa_results["score"],
        "updated_files": ["blog-index.md", "blog-metadata.json"]
    }
```

## Manual Override Commands

### Add Blog Post Manually
```bash
# If automatic detection fails, add manually
blog-add-manual \
  --title="Blog Title" \
  --file="blog-file.md" \
  --author="Author Name" \
  --category="category" \
  --keyword="target keyword"
```

### Update Index Manually
```bash
# Rebuild entire blog index
blog-rebuild-index --from-scratch
```

### Update Metadata Manually
```bash
# Update metadata file from all blog posts
blog-sync-metadata --scan-all
```

## Quality Control Checklist

### Before Publishing
- [ ] Blog post follows BrokerAnalysis guidelines
- [ ] Title is 50-60 characters with keyword
- [ ] Word count is 2,000-2,500 words
- [ ] Plain text format (no HTML)
- [ ] Table of contents included
- [ ] Key takeaways section present
- [ ] Minimum 4 FAQ questions
- [ ] Internal links to BrokerAnalysis features
- [ ] External authority citations included
- [ ] Visual element descriptions provided
- [ ] Author and fact-checker assigned
- [ ] SEO metadata complete

### After Addition
- [ ] Blog index page updated
- [ ] Metadata file updated
- [ ] Category counts updated
- [ ] Author statistics updated
- [ ] Target keyword marked as completed
- [ ] Quality assurance checks passed
- [ ] Notifications sent
- [ ] Analytics tracking configured

## Error Handling

### Common Issues and Solutions

**Issue:** Blog post not detected automatically
**Solution:** Use manual override command or check file naming convention

**Issue:** Metadata extraction fails
**Solution:** Verify blog post follows required format with proper headings

**Issue:** Index update fails
**Solution:** Check file permissions and disk space

**Issue:** QA checks fail
**Solution:** Review failed checks and correct blog post accordingly

## Integration with GLM-4.6

### Automated Blog Generation
```bash
# Generate blog post and automatically add to inventory
glm-generate-blog \
  --keyword="target keyword" \
  --auto-add=true \
  --qa-check=true
```

### Batch Processing
```bash
# Process multiple target keywords
glm-batch-process \
  --keyword-file="target-keywords.txt" \
  --auto-add=true \
  --parallel=true
```

## Monitoring and Analytics

### Track Automation Performance
- Blog posts created per day
- Time from creation to publishing
- QA check success rate
- Error frequency and types

### Content Performance Tracking
- Most popular categories
- Best-performing authors
- Keyword ranking improvements
- User engagement metrics

## Maintenance

### Daily Tasks
- Monitor automation logs
- Check for failed processes
- Review quality assurance results

### Weekly Tasks
- Update content calendar
- Review performance analytics
- Plan upcoming content

### Monthly Tasks
- Comprehensive system audit
- Update automation scripts
- Review and improve workflows

## Backup and Recovery

### Automated Backups
```bash
# Create backup of all blog files
blog-backup --create --compress
```

### Recovery Procedures
```bash
# Restore from backup
blog-restore --date="YYYY-MM-DD" --verify
```

This workflow ensures every new blog post is automatically added to your blog inventory system with proper categorization, metadata tracking, and quality assurance validation.