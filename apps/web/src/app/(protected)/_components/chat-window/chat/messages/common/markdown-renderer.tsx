import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "~/lib/utils";

interface AssistantMessageMarkdownProps {
  message: string;
}

export const MarkdownRenderer = (props: AssistantMessageMarkdownProps) => {
  const { message } = props;

  return (
    <div className="markdown-renderer w-full break-words">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="scroll-m-20 text-4xl font-extrabold tracking-tight"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mt-8 mb-4 scroll-m-20 border-b text-3xl font-semibold tracking-tight"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="mt-4 mb-2 scroll-m-20 text-2xl font-semibold tracking-tight"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="scroll-m-20 text-xl font-semibold tracking-tight"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="scroll-m-20 text-lg font-medium tracking-tight"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="scroll-m-20 font-medium tracking-tight" {...props} />
          ),
          p: ({ node, className, ...props }) => (
            <p
              className={cn(
                "mb-2 leading-7 [&:not(:first-child)]:mt-6",
                className
              )}
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-medium text-primary underline underline-offset-4"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-3 ml-6 list-disc [&>li]:mt-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-3 ml-6 list-decimal [&>li]:mt-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
          ),
          pre: ({ node, children, ...props }) => (
            <pre
              className="overflow-x-auto rounded-xl bg-gray-800 p-4 dark:bg-zinc-900"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ node, className, children, ...props }) => {
            return (
              <code
                className={cn(
                  className,
                  "relative rounded p-4 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold dark:bg-zinc-900"
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full" {...props} />
            </div>
          ),
          tr: ({ node, ...props }) => (
            <tr className="m-0 border-t p-0 even:bg-muted" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border" {...props} />
          ),
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="my-4 h-auto max-w-full rounded-md" {...props} />
          )
        }}
      >
        {message}
      </Markdown>
    </div>
  );
};
