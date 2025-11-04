import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Upload, Wand2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PixshopDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PixshopDrawer = ({ open, onOpenChange }: PixshopDrawerProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<'generate' | 'edit'>('generate');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setEditMode('edit');
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneratedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('कृपया एक prompt दर्ज करें');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('pixshop-generate', {
        body: { 
          prompt: prompt.trim(),
          mode: editMode,
          imageData: editMode === 'edit' ? generatedImage : null
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success(editMode === 'generate' ? 'इमेज जेनरेट हो गई!' : 'इमेज एडिट हो गई!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('कुछ गलत हो गया। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pixshop-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('इमेज डाउनलोड हो रही है!');
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setSelectedFile(null);
    setPrompt('');
    setEditMode('generate');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold gradient-text">Pixshop AI</SheetTitle>
          <SheetDescription>
            AI-powered image generation और editing
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={editMode === 'generate' ? 'default' : 'outline'}
              onClick={() => {
                setEditMode('generate');
                setGeneratedImage(null);
                setSelectedFile(null);
              }}
              className="flex-1"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
            <Button
              variant={editMode === 'edit' ? 'default' : 'outline'}
              onClick={() => setEditMode('edit')}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Edit Image
            </Button>
          </div>

          {/* File Upload for Edit Mode */}
          {editMode === 'edit' && !selectedFile && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  एडिट करने के लिए इमेज अपलोड करें
                </p>
              </label>
            </div>
          )}

          {/* Preview Area */}
          {generatedImage && (
            <div className="relative border border-border rounded-lg overflow-hidden bg-muted">
              <img 
                src={generatedImage} 
                alt="Generated or uploaded" 
                className="w-full h-auto"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {editMode === 'generate' ? 'Image Description' : 'Editing Instructions'}
            </label>
            <Textarea
              placeholder={
                editMode === 'generate'
                  ? 'एक सुंदर sunset over mountains...'
                  : 'इस इमेज में क्या बदलाव करना है बताएं...'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || (editMode === 'edit' && !selectedFile)}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {editMode === 'generate' ? 'Generate' : 'Edit'}
                </>
              )}
            </Button>
            
            {generatedImage && (
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
            <p>• AI-powered image generation using Lovable AI</p>
            <p>• Upload any image to edit with AI</p>
            <p>• Download generated images instantly</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
