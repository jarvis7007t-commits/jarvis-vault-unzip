import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Square, RectangleHorizontal, RectangleVertical, ArrowLeft } from "lucide-react";
import { AspectRatioButton } from "@/components/AspectRatioButton";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptInput } from "@/components/PromptInput";

type AspectRatioType = "1:1" | "16:9" | "9:16";

const aspectRatios: { value: AspectRatioType; label: string; icon: typeof Square }[] = [
  { value: "1:1", label: "Square", icon: Square },
  { value: "16:9", label: "Landscape", icon: RectangleHorizontal },
  { value: "9:16", label: "Portrait", icon: RectangleVertical },
];

const ImagenAI = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-lg">
                Imagen AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Google AI से शक्तिशाली छवि निर्माण
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6 animate-slide-in">
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
            </div>
          </div>

          <div className="animate-fade-in-delayed">
            <ImageDisplay
              imageUrl={imageUrl}
              isGenerating={isGenerating}
              aspectRatio={aspectRatio}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagenAI;
