import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface AIModelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIModelDrawer = ({ open, onOpenChange }: AIModelDrawerProps) => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!prompt.trim()) {
      toast.error("कृपया एक प्रॉम्प्ट दर्ज करें");
      return;
    }

    setIsProcessing(true);
    
    try {
      // AI Model processing logic will be implemented here
      toast.success("AI Model processing started!");
      
      // Placeholder for actual implementation
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("प्रोसेसिंग पूर्ण!");
      }, 2000);
    } catch (error) {
      console.error("Error processing:", error);
      toast.error("प्रोसेसिंग में त्रुटि");
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI MODEL
          </SheetTitle>
          <SheetDescription>
            Advanced AI model interface for powerful transformations
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <label className="text-lg font-medium text-foreground">
              Enter Your Prompt
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create or transform..."
              className="w-full"
            />
          </div>

          <Button
            onClick={handleProcess}
            disabled={isProcessing || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Generate with AI Model"}
          </Button>

          <div className="mt-8 p-6 border border-border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">
              AI Model feature is ready for custom implementation.
              <br />
              Upload the unzipped project files to integrate the full functionality.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
