import React, { createContext, useState, useEffect } from 'react';
import { DiscussionPost, DiscussionReply, DiscussionContextType } from '../types';

const initialPosts: DiscussionPost[] = [
    {
        id: 'post1',
        topicId: 'pepperstone',
        userId: 'user123',
        userName: 'Alice',
        title: 'Does Pepperstone offer TradingView integration on all account types?',
        content: 'I am thinking of opening a Razor account but I want to make sure I can connect it to my TradingView Pro account. Can anyone confirm this?',
        date: '2023-11-05T10:00:00Z',
        upvotes: 12,
        replies: [
            {
                id: 'reply1',
                postId: 'post1',
                userId: 'user456',
                userName: 'Bob',
                content: 'Yes, I use it with my Razor account. It works flawlessly!',
                date: '2023-11-05T11:30:00Z',
                upvotes: 5
            },
            {
                id: 'reply2',
                postId: 'post1',
                userId: 'user101',
                userName: 'David',
                content: 'Confirmed, it works. Integration is smooth and you can trade directly from the TradingView charts.',
                date: '2023-11-05T14:15:00Z',
                upvotes: 3
            }
        ]
    },
    {
        id: 'post2',
        topicId: 'pepperstone',
        userId: 'user789',
        userName: 'Charlie',
        title: 'What are the withdrawal times like for PayPal?',
        content: 'Has anyone recently withdrawn funds using PayPal? How long did it take to show up in your account after you requested it?',
        date: '2023-10-28T16:00:00Z',
        upvotes: 8,
        replies: []
    }
];

export const DiscussionContext = createContext<DiscussionContextType | null>(null);

export const DiscussionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<DiscussionPost[]>(() => {
        try {
            const savedPosts = typeof window !== 'undefined' && localStorage ? localStorage.getItem('discussionPosts') : null;
            return savedPosts ? JSON.parse(savedPosts) : initialPosts;
        } catch (e) {
            console.error("Failed to parse posts from localStorage", e);
            return initialPosts;
        }
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('discussionPosts', JSON.stringify(posts));
        }
    }, [posts]);

    const getPostsByTopicId = (topicId: string) => {
        return posts.filter(post => post.topicId === topicId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const addPost = (postData: Omit<DiscussionPost, 'id' | 'date' | 'upvotes' | 'replies'>) => {
        const newPost: DiscussionPost = {
            ...postData,
            id: `post_${Date.now()}`,
            date: new Date().toISOString(),
            upvotes: 1,
            replies: [],
        };
        setPosts(prev => [newPost, ...prev]);
    };

    const addReply = (replyData: Omit<DiscussionReply, 'id' | 'date' | 'upvotes'>) => {
        const newReply: DiscussionReply = {
            ...replyData,
            id: `reply_${Date.now()}`,
            date: new Date().toISOString(),
            upvotes: 1,
        };
        setPosts(prev => prev.map(post => {
            if (post.id === newReply.postId) {
                return { ...post, replies: [...post.replies, newReply] };
            }
            return post;
        }));
    };

    const upvotePost = (postId: string) => {
        setPosts(prev => prev.map(post =>
            post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        ));
    };

    const upvoteReply = (replyId: string) => {
        setPosts(prev => prev.map(post => ({
            ...post,
            replies: post.replies.map(reply =>
                reply.id === replyId ? { ...reply, upvotes: reply.upvotes + 1 } : reply
            )
        })));
    };

    return (
        <DiscussionContext.Provider value={{ posts, getPostsByTopicId, addPost, addReply, upvotePost, upvoteReply }}>
            {children}
        </DiscussionContext.Provider>
    );
};
