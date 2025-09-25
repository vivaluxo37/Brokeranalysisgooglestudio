import React, { useState, useMemo } from 'react';
import { blogPosts } from '../data/blog';
import BlogPostCard from '../components/blog/BlogPostCard';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import * as ReactRouterDOM from 'react-router-dom';
import { Icons } from '../constants';
import Tag from '../components/ui/Tag';

const BlogPage: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, []);

    const filteredPosts = useMemo(() => {
        const sorted = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!selectedTag) {
            return sorted;
        }
        return sorted.filter(post => post.tags.includes(selectedTag));
    }, [selectedTag]);

    const featuredPost = !selectedTag ? filteredPosts[0] : null;
    const postsToDisplay = !selectedTag ? filteredPosts.slice(1) : filteredPosts;

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Brokeranalysis Blog - Forex Trading Insights & Guides",
        "url": "https://brokeranalysis.com/#/blog",
        "description": "Explore expert articles, in-depth guides, and the latest insights on forex trading, broker reviews, and market analysis.",
        "publisher": {
            "@type": "Organization",
            "name": "Brokeranalysis",
        }
    };

    return (
        <div>
            <MetaTags
                title="Brokeranalysis Blog - Forex Trading Insights & Guides"
                description="Explore expert articles, in-depth guides, and the latest insights on forex trading, broker reviews, and market analysis."
                canonicalUrl="https://brokeranalysis.com/#/blog"
            />
            <JsonLdSchema data={pageJsonLd} />
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">The Brokeranalysis Blog</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                    Expert insights, guides, and analysis to help you navigate the world of forex trading.
                </p>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${!selectedTag ? 'bg-primary-600 text-white' : 'bg-input text-foreground/80 hover:bg-input/70'}`}
                >
                    All Posts
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'bg-primary-600 text-white' : 'bg-input text-foreground/80 hover:bg-input/70'}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Content */}
            {selectedTag && (
                 <h2 className="text-2xl font-bold mb-8 text-center animate-fade-in">
                    Posts tagged with: <span className="text-primary-400">{selectedTag}</span>
                </h2>
            )}

            {/* Featured Post */}
            {featuredPost && (
                <div className="mb-16 animate-fade-in">
                    <ReactRouterDOM.Link to={`/blog/${featuredPost.slug}`} className="group block">
                        <div className="grid lg:grid-cols-2 gap-8 items-center bg-card p-6 rounded-lg border border-input hover:border-primary-600 transition-colors">
                            <img src={featuredPost.imageUrl} alt={featuredPost.title} className="rounded-lg aspect-video object-cover" />
                            <div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {featuredPost.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </div>
                                <h2 className="text-3xl font-bold text-card-foreground group-hover:text-primary-400 transition-colors">{featuredPost.title}</h2>
                                <p className="text-card-foreground/80 mt-4">{featuredPost.summary}</p>
                                <div className="flex items-center gap-3 mt-4 text-sm text-card-foreground/70">
                                    <img src={featuredPost.author.avatarUrl} alt={featuredPost.author.name} className="h-8 w-8 rounded-full" />
                                    <span>{featuredPost.author.name}</span>
                                    <span>&bull;</span>
                                    <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span>&bull;</span>
                                    <span className="flex items-center gap-1"><Icons.clock className="h-4 w-4" /> {featuredPost.readTimeMinutes} min read</span>
                                </div>
                            </div>
                        </div>
                    </ReactRouterDOM.Link>
                </div>
            )}

            {/* Posts Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${!featuredPost ? 'animate-fade-in' : ''}`}>
                {postsToDisplay.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>

             {filteredPosts.length === 0 && (
                <div className="text-center py-16 text-foreground/70 bg-card rounded-lg border border-input animate-fade-in">
                    <p className="text-xl">No posts found for this tag.</p>
                </div>
            )}
        </div>
    );
};

export default BlogPage;