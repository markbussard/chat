interface UserMessageProps {
  text: string;
}

export const UserMessage = (props: UserMessageProps) => {
  const { text } = props;

  return (
    <article className="flex justify-end py-4">
      <div className="max-w-[70%] rounded-2xl bg-zinc-800 px-4 py-3 text-white">
        {text}
      </div>
    </article>
  );
};
