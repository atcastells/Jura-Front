import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

// Custom components for styled markdown rendering
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-neutral-900 mb-3 mt-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-neutral-900 mb-2 mt-3 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-neutral-800 mb-2 mt-3 first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-neutral-800 mb-1 mt-2 first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-neutral-700 leading-relaxed mb-3 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-sm text-neutral-700 mb-3 space-y-1 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-sm text-neutral-700 mb-3 space-y-1 pl-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-neutral-700 leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:text-primary-700 underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    // Check if it's an inline code or a code block
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-neutral-100 text-primary-700 px-1.5 py-0.5 rounded text-xs font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-neutral-900 text-neutral-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-neutral-900 text-neutral-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-300 bg-primary-50 pl-4 py-2 my-3 text-sm text-neutral-700 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-neutral-200 my-4" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full text-sm border border-neutral-200 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-neutral-100">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-neutral-200 last:border-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-neutral-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-neutral-700">{children}</td>
  ),
};

export const MarkdownViewer = ({
  content,
  className = "",
}: MarkdownViewerProps) => {
  return (
    <div className={`markdown-viewer ${className}`}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
};
