import React from 'react';
import { blogPosts } from '../data/blog';
import BlogPostCard from '../components/blog/BlogPostCard';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import * as ReactRouterDOM from 'react-router-dom';
import { Icons } from '../constants';
import Tag from '../components/ui/Tag';

const BlogPage: React.FC = () => {
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const featuredPost = sortedPosts[0];
    const otherPosts = sortedPosts.slice(1);

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

            {/* Featured Post */}
            {featuredPost && (
                <div className="mb-16">
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

            {/* Other Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default BlogPage;