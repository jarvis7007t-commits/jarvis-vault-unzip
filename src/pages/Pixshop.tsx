import { useState } from 'react';
import { ArrowLeft, Wand2, Upload, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Pixshop = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Pixshop AI
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Image Studio</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Image Controls</CardTitle>
              <CardDescription>Generate new images or edit existing ones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </label>
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
                      ? 'A beautiful sunset over mountains with vibrant colors...'
                      : 'Make the sky more dramatic, add clouds...'
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || (editMode === 'edit' && !selectedFile)}
                  className="flex-1"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      {editMode === 'generate' ? 'Generate Image' : 'Edit Image'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated or edited image appears here</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative border border-border rounded-lg overflow-hidden bg-muted aspect-square">
                    <img 
                      src={generatedImage} 
                      alt="Generated or edited" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center aspect-square flex flex-col items-center justify-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {editMode === 'generate' 
                      ? 'Enter a description and generate an image'
                      : 'Upload an image and describe your edits'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Wand2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">AI Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create stunning images from text descriptions using advanced AI models
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Smart Editing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload your images and edit them with natural language instructions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">High Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get professional-grade results powered by Lovable AI technology
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Pixshop;
