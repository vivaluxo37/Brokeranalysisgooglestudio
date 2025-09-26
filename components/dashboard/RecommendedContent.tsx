import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { brokers as allBrokers } from '../../data/brokers';
import { blogPosts } from '../../data/blog';
import { StrategyMatcherHistoryItem } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Icons } from '../../constants';
import BlogPostCard from '../blog/BlogPostCard';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const RecommendedContent: React.FC = () => {
    const { user } = useAuth();
    const { favoritesList } = useFavorites();
    const [history, setHistory] = useState<StrategyMatcherHistoryItem[]>([]);

    useEffect(() => {
        if (user) {
            const key = `strategyMatcherHistory_${user.id}`;
            try {
                const storedHistory = JSON.parse(localStorage.getItem(key) || '[]');
                setHistory(storedHistory);
            } catch (e) {
                console.error("Failed to load matcher history:", e);
                setHistory([]);
            }
        }
    }, [user]);

    const recommendedPosts = useMemo(() => {
        if (!user) return [];

        const interestTags = new Set<string>();

        // 1. Analyze favorite brokers
        const favoriteBrokers = allBrokers.filter(b => favoritesList.includes(b.id));
        favoriteBrokers.forEach(broker => {
            if (broker.copyTrading) interestTags.add('Copy Trading');
            if (broker.technology.executionType.includes('ECN')) interestTags.add('ECN');
            if (broker.isIslamic) interestTags.add('Islamic Brokers');
            if ((broker.tradableInstruments.stocks?.total ?? 0) > 100) interestTags.add('Stock Trading');
        });

        // 2. Analyze matcher history
        history.forEach(item => {
            const strategy = item.strategy.toLowerCase();
            if (strategy.includes('scalp')) interestTags.add('Scalping');
            if (strategy.includes('beginner')) interestTags.add('Beginner Guide');
            if (strategy.includes('risk')) interestTags.add('Risk Management');
            if (strategy.includes('platform')) interestTags.add('Trading Platforms');
        });

        if (interestTags.size === 0) {
            // Default recommendations if no specific interests are found
            return blogPosts.filter(p => p.tags.includes('Beginner Guide')).slice(0, 2);
        }

        // 3. Score and rank blog posts
        const scoredPosts = blogPosts.map(post => {
            const score = post.tags.reduce((acc, tag) => {
                return interestTags.has(tag) ? acc + 1 : acc;
            }, 0);
            return { post, score };
        });

        return scoredPosts
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.post)
            .slice(0, 2); // Return top 2 recommendations

    }, [user, favoritesList, history]);


    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <Icons.eye className="h-6 w-6 text-primary-400" />
                    Recommended For You
                </h2>
            </CardHeader>
            <CardContent>
                {recommendedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {recommendedPosts.map(post => (
                            <Link to={`/blog/${post.slug}`} key={post.id} className="group block">
                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-input transition-colors">
                                    <img src={post.imageUrl} alt={post.title} className="h-20 w-20 object-cover rounded-md flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-card-foreground group-hover:text-primary-400">{post.title}</h3>
                                        <p className="text-xs text-card-foreground/70 mt-1 line-clamp-2">{post.summary}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-card-foreground/70">Start favoriting brokers or use the AI Matcher to get personalized article recommendations!</p>
                         <Link to="/blog">
                            <Button variant="secondary" className="mt-4">Explore Blog</Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecommendedContent;
