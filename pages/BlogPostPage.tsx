import React, { useMemo, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { blogPosts } from '../data/blog';
import NotFoundPage from './NotFoundPage';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { Icons } from '../constants';
import Tag from '../components/ui/Tag';
import ShareButtons from '../components/blog/ShareButtons';
import BlogPostCard from '../components/blog/BlogPostCard';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// --- New Components for Enhanced Blog Post ---

interface TocItem {
  id: string;
  title: string;
}

const StickyTableOfContents: React.FC<{ items: TocItem[] }> = ({ items }) => (
    <div className="sticky top-24 self-start">
        <h3 className="font-bold mb-4 text-lg text-card-foreground">On this page</h3>
        <ul className="space-y-2 border-l-2 border-input">
            {items.map(item => (
                <li key={item.id}>
                    <a 
                        href={`#${item.id}`} 
                        className="block pl-4 text-foreground/70 hover:text-primary-400 hover:border-primary-400 border-l-2 border-transparent -ml-px transition-colors"
                    >
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const InlineTableOfContents: React.FC<{ items: TocItem[] }> = ({ items }) => (
    <div className="my-10 p-6 border-l-4 border-primary-500 bg-card rounded-r-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Icons.list className="h-5 w-5" /> Table of Contents</h3>
        <ul className="space-y-2 list-inside">
            {items.map(item => (
                <li key={item.id}>
                    <a 
                        href={`#${item.id}`} 
                        className="text-primary-400 hover:underline"
                    >
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);


const DownloadableResource: React.FC = () => (
    <div className="my-10 p-6 bg-primary-900/40 rounded-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <Icons.downloadCloud className="h-16 w-16 text-primary-300 flex-shrink-0" />
        <div>
            <h3 className="text-xl font-bold text-card-foreground">Free Broker Selection Checklist</h3>
            <p className="text-card-foreground/80 mt-1">Download our free PDF checklist to ensure you cover all the bases when choosing your next broker.</p>
        </div>
        <Button size="lg" className="mt-4 sm:mt-0 sm:ml-auto flex-shrink-0">Download PDF</Button>
    </div>
);

const InteractiveQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "Which broker model typically has a direct conflict of interest with the trader?";
    const options = ["ECN Broker", "Market Maker Broker", "STP Broker"];
    const correctAnswer = "Market Maker Broker";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Quick Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Market Makers profit from client losses, creating a conflict of interest.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. ECN and STP brokers act as intermediaries, removing that conflict.</p>}
        </div>
    );
};

// --- Enhanced Markdown Parser ---

const parseMarkdown = (markdown: string) => {
    const tableRegex = /^\|.*\|$/m;

    const processInlineFormatting = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
            .replace(/_([^_]+)_/g, '<span class="italic">$1</span>')
            .replace(/`([^`]+)`/g, '<code class="bg-input text-primary-400 font-mono py-1 px-2 rounded text-sm">$1</code>');
    };
    
    const processLinksAndFormatting = (text: string) => {
        // Temporarily replace links with placeholders to avoid nested processing
        const links: string[] = [];
        const textWithPlaceholders = text.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
            const formattedText = processInlineFormatting(linkText);
            const linkType = url.startsWith('/#/') 
                ? `<a href="${url}" class="text-primary-400 hover:underline">${formattedText}</a>`
                : `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:underline">${formattedText}</a>`;
            links.push(linkType);
            return `__LINK_${links.length - 1}__`;
        });

        // Process remaining formatting
        let formattedText = processInlineFormatting(textWithPlaceholders);

        // Restore links
        links.forEach((link, index) => {
            formattedText = formattedText.replace(`__LINK_${index}__`, link);
        });
        
        return formattedText;
    };


    const blocks = markdown.trim().split(/\n\n+/);

    const html = blocks.map(block => {
        // H2 with ID
        if (block.match(/^## (.*?){#(.*?)}/)) {
            return block.replace(/^## (.*?){#(.*?)}/, '<h2 id="$2" class="text-3xl font-bold mt-12 mb-6 pt-4 border-b border-input">$1</h2>');
        }
        // H3
        if (block.startsWith('### ')) {
            return `<h3 class="text-2xl font-semibold mt-8 mb-4">${block.substring(4)}</h3>`;
        }
        // Table
        if (tableRegex.test(block)) {
             const rows = block.trim().split('\n');
            const headerCells = rows[0].split('|').map(h => h.trim()).slice(1, -1);
            const bodyRows = rows.slice(2).map(row => row.split('|').map(c => c.trim()).slice(1, -1));

            let tableHtml = '<div class="my-6 overflow-x-auto rounded-lg border border-input"><table class="w-full text-base">';
            tableHtml += '<thead class="bg-input/50"><tr>';
            headerCells.forEach(h => {
                tableHtml += `<th class="p-4 font-semibold">${h}</th>`;
            });
            tableHtml += '</tr></thead>';

            tableHtml += '<tbody>';
            bodyRows.forEach(row => {
                tableHtml += '<tr class="border-t border-input">';
                row.forEach(cell => {
                    tableHtml += `<td class="p-4">${processLinksAndFormatting(cell)}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table></div>';
            return tableHtml;
        }
        // Unordered List
        if (block.startsWith('* ')) {
            const items = block.split('\n').map(item => {
                const content = item.replace(/^\* /, '').trim();
                return `<li class="ml-5">${processLinksAndFormatting(content)}</li>`;
            }).join('');
            return `<ul class="list-disc pl-5 space-y-2 my-6">${items}</ul>`;
        }
        // Paragraphs
        return `<p class="my-6 leading-relaxed">${processLinksAndFormatting(block)}</p>`;
    }).join('');

    return html;
};

const extractTocItems = (markdown: string): TocItem[] => {
    const tocItems: TocItem[] = [];
    const h2Regex = /^## (.*?){#(.*?)}/gm;
    let match;
    while ((match = h2Regex.exec(markdown)) !== null) {
        tocItems.push({
            title: match[1].trim(),
            id: match[2].trim(),
        });
    }
    return tocItems;
};

const extractFaqs = (markdown: string) => {
    const faqs = [];
    const faqRegex = /\*\*Q: (.*?)\*\*\s*\n\s*A: (.*?)(?=\n\n\*\*Q:|\s*$)/gs;
    let match;
    while ((match = faqRegex.exec(markdown)) !== null) {
        faqs.push({
            question: match[1].trim(),
            answer: match[2].trim(),
        });
    }
    return faqs;
};

const BlogPostPage: React.FC = () => {
    const { slug } = ReactRouterDOM.useParams<{ slug: string }>();
    const post = blogPosts.find(p => p.slug === slug);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return blogPosts
            .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
            .slice(0, 3);
    }, [post]);

    if (!post) {
        return <NotFoundPage />;
    }

    const canonicalUrl = `https://brokeranalysis.com/#/blog/${post.slug}`;
    const tocItems = extractTocItems(post.content);
    const parsedContent = parseMarkdown(post.content);
    const faqs = extractFaqs(post.content);

    const blogPostJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
        "headline": post.title,
        "description": post.metaDescription,
        "image": post.imageUrl,
        "author": {
            "@type": "Person",
            "name": post.author.name,
        },
        "publisher": {
            "@type": "Organization",
            "name": "Brokeranalysis",
            "logo": {
                "@type": "ImageObject",
                "url": "https://brokeranalysis.com/vite.svg" 
            }
        },
        "datePublished": new Date(post.date).toISOString(),
        "dateModified": new Date(post.date).toISOString(),
    };

    const faqJsonLd = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-4 lg:gap-12">
            <MetaTags
                title={post.metaTitle}
                description={post.metaDescription}
                canonicalUrl={canonicalUrl}
                imageUrl={post.imageUrl}
            />
            <JsonLdSchema data={blogPostJsonLd} />
            {faqJsonLd && <JsonLdSchema data={faqJsonLd} />}
            
            <aside className="hidden lg:block lg:col-span-1">
                <StickyTableOfContents items={tocItems} />
            </aside>

            <main className="lg:col-span-3">
                <article>
                    <header className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-card-foreground">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 text-sm text-foreground/70">
                            <div className="flex items-center gap-3">
                                <img src={post.author.avatarUrl} alt={post.author.name} className="h-10 w-10 rounded-full" />
                                <span>By <strong>{post.author.name}</strong></span>
                            </div>
                            <span className="hidden md:inline">&bull;</span>
                            <span>Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="hidden md:inline">&bull;</span>
                            <span className="flex items-center gap-1"><Icons.clock className="h-4 w-4" /> {post.readTimeMinutes} min read</span>
                        </div>
                    </header>

                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto aspect-video object-cover rounded-lg mb-8" />
                    
                    <InlineTableOfContents items={tocItems} />

                    <div className="prose dark:prose-invert max-w-none text-card-foreground/90 text-lg" dangerouslySetInnerHTML={{ __html: parsedContent }} />

                    <DownloadableResource />
                    <InteractiveQuiz />

                    <footer className="mt-12 pt-8 border-t border-input">
                       <ShareButtons title={post.title} url={canonicalUrl} />
                    </footer>
                </article>

                {relatedPosts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map(relatedPost => (
                                <BlogPostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default BlogPostPage;