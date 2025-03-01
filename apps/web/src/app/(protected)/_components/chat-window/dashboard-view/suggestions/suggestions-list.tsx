import { Button } from "~/components/ui/button";

const items = ["Brainstorm", "Summarize text", "Make a plan", "Help me write"];

export const SuggestionsList = () => {
  return (
    <div className="flex gap-4">
      {items.map((item) => {
        return (
          <Button key={item} variant="secondary" className="rounded-3xl">
            {item}
          </Button>
        );
      })}
    </div>
  );
};
