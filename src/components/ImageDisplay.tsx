import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
  aspectRatio: "1:1" | "16:9" | "9:16";
}

export const ImageDisplay = ({ imageUrl, isGenerating, aspectRatio }: ImageDisplayProps) => {
  const getAspectRatioStyle = () => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${width} / ${height}`;
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative w-full max-w-2xl bg-card rounded-lg border-2 border-border overflow-hidden flex items-center justify-center mx-auto transition-all duration-300"
      style={{ aspectRatio: getAspectRatioStyle() }}
    >
      {isGenerating ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">छवि बना रहे हैं...</p>
        </div>
      ) : imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Generated"
            className="max-w-full max-h-[600px] rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              onClick={handleDownload}
              size="lg"
              className="gap-2"
            >
              <Download className="w-5 h-5" />
              छवि डाउनलोड करें
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground text-lg">
            आपकी छवि यहाँ दिखाई देगी
          </p>
        </div>
      )}
    </div>
  );
};
