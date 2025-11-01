import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { AspectRatioButton } from "@/components/AspectRatioButton";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptInput } from "@/components/PromptInput";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AspectRatioType = "1:1" | "16:9" | "9:16";

const aspectRatios: { value: AspectRatioType; label: string; icon: typeof Square }[] = [
  { value: "1:1", label: "Square", icon: Square },
  { value: "16:9", label: "Landscape", icon: RectangleHorizontal },
  { value: "9:16", label: "Portrait", icon: RectangleVertical },
];

interface ImagenAIDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImagenAIDrawer = ({ open, onOpenChange }: ImagenAIDrawerProps) => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("कृपया एक प्रॉम्प्ट दर्ज करें");
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, aspectRatio },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast.success("छवि सफलतापूर्वक बनाई गई!");
      } else {
        throw new Error("No image URL received");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("छवि बनाने में विफल। कृपया पुनः प्रयास करें।");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold">IMAGEN AI</SheetTitle>
          <SheetDescription>
            Turn your imagination into stunning visuals with AI
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          <div className="space-y-3">
            <label className="text-lg font-medium text-foreground">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {aspectRatios.map(({ value, label, icon }) => (
                <AspectRatioButton
                  key={value}
                  icon={icon}
                  label={label}
                  value={value}
                  isActive={aspectRatio === value}
                  onClick={() => setAspectRatio(value)}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: <span className="text-primary font-medium">{aspectRatio}</span>
            </p>
          </div>

          <ImageDisplay
            imageUrl={imageUrl}
            isGenerating={isGenerating}
            aspectRatio={aspectRatio}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
