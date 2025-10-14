import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
// CSS will be handled by Tailwind classes
import { cn } from '../../lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
  allowedElements?: string[];
}

const Markdown: React.FC<MarkdownProps> = ({
  content,
  className,
  allowedElements = [
    'p', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ]
}) => {
  const components = {
    // Custom link component for security
    a: ({ href, children, ...props }: any) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    // Code block with syntax highlighting
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    // Table styling
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-border" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-border px-4 py-2 text-left font-semibold bg-muted" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    ),
    // List styling
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside my-4 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-1" {...props}>
        {children}
      </ol>
    ),
    // Blockquote styling
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic" {...props}>
        {children}
      </blockquote>
    ),
  };

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={components}
        allowedElements={allowedElements}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;