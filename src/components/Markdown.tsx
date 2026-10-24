import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { mediaUrl } from '../lib/media';

export function Markdown({ children }: { children: string }) {
  return <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} skipHtml components={{
    a: ({ href, children }) => href ? <a href={href} target={href.startsWith('https://') ? '_blank' : undefined} rel={href.startsWith('https://') ? 'noreferrer' : undefined}>{children}</a> : <span>{children}</span>,
    img: ({ src, alt }) => typeof src === 'string' && (/^https:\/\//.test(src) || /^\/?media\//.test(src)) ? <img src={mediaUrl(src)} alt={alt || ''} loading="lazy"/> : <span>{alt}</span>,
  }}>{children}</ReactMarkdown></div>;
}
