import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PromptInput = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating
}: PromptInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-lg font-medium text-foreground">
          अपनी छवि का वर्णन करें
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="एक शेर सूर्यास्त में, realistic, 4K quality..."
          className="min-h-[120px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
          disabled={isGenerating}
        />
      </div>
      <Button
        onClick={onGenerate}
        disabled={!prompt.trim() || isGenerating}
        size="lg"
        className="w-full gap-2 text-lg font-semibold"
      >
        <Sparkles className="w-5 h-5" />
        {isGenerating ? "छवि बना रहे हैं..." : "छवि बनाएं"}
      </Button>
    </div>
  );
};
