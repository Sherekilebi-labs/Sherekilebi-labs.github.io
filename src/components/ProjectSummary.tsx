import ReactMarkdown from 'react-markdown';

export function ProjectSummary({
  children,
  className,
}: {
  children: string;
  className: string;
}) {
  return (
    <div className={`project-summary ${className}`}>
      <ReactMarkdown skipHtml>{children}</ReactMarkdown>
    </div>
  );
}
