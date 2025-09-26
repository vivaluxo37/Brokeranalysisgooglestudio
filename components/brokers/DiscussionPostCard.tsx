import React, { useState, useContext } from 'react';
import { DiscussionPost } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { DiscussionContext } from '../../contexts/DiscussionContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Icons } from '../../constants';
import { Input } from '../ui/input';

const DiscussionPostCard: React.FC<{ post: DiscussionPost }> = ({ post }) => {
    const { user } = useAuth();
    const discussionContext = useContext(DiscussionContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    if (!discussionContext) return null;
    const { addReply, upvotePost, upvoteReply } = discussionContext;

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !user) return;
        addReply({
            postId: post.id,
            userId: user.id,
            userName: user.name,
            content: replyContent,
        });
        setReplyContent('');
    };
    
    const sortedReplies = [...post.replies].sort((a,b) => b.upvotes - a.upvotes);

    return (
        <Card>
            <CardContent>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center space-y-1">
                        <button onClick={() => upvotePost(post.id)} className="p-1 text-foreground/60 hover:text-primary-400">
                            <Icons.arrowUp className="h-5 w-5" />
                        </button>
                        <span className="font-bold text-lg">{post.upvotes}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-card-foreground/60">
                            Posted by {post.userName} on {new Date(post.date).toLocaleDateString()}
                        </p>
                        <h4 className="text-lg font-bold text-card-foreground mt-1">{post.title}</h4>
                        <p className="text-sm text-card-foreground/80 mt-2">{post.content}</p>
                        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-sm text-primary-400 mt-3">
                            <Icons.messageSquare className="h-4 w-4" />
                            <span>{post.replies.length} Replies</span>
                            <Icons.chevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 pl-8 border-t border-input pt-4 space-y-4 animate-fade-in">
                        {sortedReplies.map(reply => (
                            <div key={reply.id} className="flex gap-3">
                                <div className="flex flex-col items-center space-y-1 mt-1">
                                    <button onClick={() => upvoteReply(reply.id)} className="p-1 text-foreground/60 hover:text-primary-400">
                                        <Icons.arrowUp className="h-4 w-4" />
                                    </button>
                                    <span className="font-semibold text-sm">{reply.upvotes}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-card-foreground/60">
                                        {reply.userName} &bull; {new Date(reply.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-card-foreground/90 mt-1">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                        
                        {user ? (
                            <form onSubmit={handleReplySubmit} className="pt-4 border-t border-input/50">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    rows={2}
                                    className="block w-full bg-input border-input rounded-md shadow-sm p-2 placeholder:text-foreground/60"
                                    required
                                />
                                <Button type="submit" size="sm" className="mt-2" disabled={!replyContent.trim()}>Post Reply</Button>
                            </form>
                        ) : (
                             <p className="text-center text-sm text-card-foreground/70 pt-4 border-t border-input/50">You must be logged in to reply.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DiscussionPostCard;
