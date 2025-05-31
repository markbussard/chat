import { useStickToBottomContext } from "use-stick-to-bottom";

interface StickToBottomContentProps {
  content: React.ReactNode;
  footer: React.ReactNode;
}

export const StickToBottomContent = (props: StickToBottomContentProps) => {
  const { content, footer } = props;

  const context = useStickToBottomContext();

  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className="absolute inset-0 grid grid-rows-[1fr_auto] overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
    >
      <div
        ref={context.contentRef}
        className="mx-auto flex w-full max-w-3xl flex-col gap-4 pt-8 pb-8"
      >
        {content}
      </div>
      <div className="sticky bottom-0 flex flex-col items-center gap-8 bg-background">
        {footer}
      </div>
    </div>
  );
};
