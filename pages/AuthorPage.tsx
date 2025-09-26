import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { authors } from '../data/authors';
import { blogPosts } from '../data/blog';
import NotFoundPage from './NotFoundPage';
import { Card, CardContent } from '../components/ui/card';
import { Icons } from '../constants';
import BlogPostCard from '../components/blog/BlogPostCard';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';

const AuthorPage: React.FC = () => {
    const { authorSlug } = ReactRouterDOM.useParams<{ authorSlug: string }>();
    const author = authors.find(a => a.slug === authorSlug);
    const posts = blogPosts.filter(p => p.author.slug === authorSlug);

    if (!author) {
        return <NotFoundPage />;
    }

    const canonicalUrl = `https://brokeranalysis.com/#/author/${author.slug}`;

    const authorJsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.credentials,
            "description": author.bio,
            "image": author.avatarUrl,
            "url": canonicalUrl,
            "sameAs": [
                author.socials?.linkedin,
                author.socials?.twitter
            ].filter(Boolean)
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <MetaTags
                title={`${author.name} - Author at Brokeranalysis`}
                description={author.bio.substring(0, 160)}
                canonicalUrl={canonicalUrl}
                imageUrl={author.avatarUrl}
            />
            <JsonLdSchema data={authorJsonLd} />

            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <img src={author.avatarUrl} alt={author.name} className="h-32 w-32 rounded-full ring-4 ring-primary-500/50" />
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-4xl font-bold text-card-foreground">{author.name}</h1>
                            {author.credentials && <p className="text-lg text-primary-400 font-semibold mt-1">{author.credentials}</p>}
                            <div className="flex justify-center sm:justify-start items-center gap-4 mt-4">
                                {author.socials?.twitter && (
                                    <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </a>
                                )}
                                {author.socials?.linkedin && (
                                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-input">
                        <h2 className="text-xl font-semibold mb-2">About {author.name}</h2>
                        <p className="text-card-foreground/80 leading-relaxed">{author.bio}</p>
                    </div>
                </CardContent>
            </Card>

            <section className="mt-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Articles by {author.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AuthorPage;
