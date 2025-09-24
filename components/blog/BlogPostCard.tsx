import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { BlogPost } from '../../types';
import Card, { CardContent } from '../ui/Card';
import Tag from '../ui/Tag';
import { Icons } from '../../constants';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <ReactRouterDOM.Link to={`/blog/${post.slug}`} className="group block h-full">
      <Card className="flex flex-col h-full hover:border-primary-600 hover:-translate-y-1 transition-all">
        <div className="flex-shrink-0">
          <img className="h-48 w-full object-cover rounded-t-xl" src={post.imageUrl} alt={post.title} />
        </div>
        <CardContent className="flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.slice(0, 2).map(tag => <Tag key={tag}>{tag}</Tag>)}
            </div>
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary-400 transition-colors">{post.title}</h3>
            <p className="mt-3 text-sm text-card-foreground/80">{post.summary}</p>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-input text-sm text-card-foreground/70">
            <img src={post.author.avatarUrl} alt={post.author.name} className="h-8 w-8 rounded-full" />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-xs">{new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
                <Icons.clock className="h-4 w-4" />
                <span>{post.readTimeMinutes} min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </ReactRouterDOM.Link>
  );
};

export default BlogPostCard;
