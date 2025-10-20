import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ImagenAI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "कृपया एक प्रॉम्प्ट दर्ज करें",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "सफलता!",
          description: "छवि सफलतापूर्वक बनाई गई",
        });
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: error.message || "छवि बनाने में विफल",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `imagen-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Imagen AI
            </h1>
            <p className="text-muted-foreground">Google AI से शक्तिशाली छवि निर्माण</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>छवि प्रॉम्प्ट</CardTitle>
              <CardDescription>
                वह छवि का वर्णन करें जिसे आप बनाना चाहते हैं
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">प्रॉम्प्ट</Label>
                <Textarea
                  id="prompt"
                  placeholder="उदाहरण: एक सुंदर सूर्यास्त पर्वत पर, विस्तृत, 4K गुणवत्ता"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    छवि बना रहे हैं...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    छवि बनाएं
                  </>
                )}
              </Button>

              <div className="pt-4 space-y-2">
                <h3 className="font-semibold text-sm">सुझाव:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• विस्तृत विवरण दें</li>
                  <li>• शैली का उल्लेख करें (realistic, artistic, etc.)</li>
                  <li>• रंग और मूड निर्दिष्ट करें</li>
                  <li>• गुणवत्ता शब्द जोड़ें (4K, detailed, high-quality)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>उत्पन्न छवि</CardTitle>
              <CardDescription>
                आपकी AI-निर्मित छवि यहाँ दिखाई देगी
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    छवि डाउनलोड करें
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg bg-muted/50">
                  <div className="text-center space-y-2">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isGenerating ? 'छवि बना रहे हैं...' : 'छवि बनाने के लिए एक प्रॉम्प्ट दर्ज करें'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle>प्रॉम्प्ट उदाहरण</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold">परिदृश्य</h4>
                <p className="text-sm text-muted-foreground">
                  "एक शांत झील पर्वतों से घिरी हुई, सूर्यास्त के समय, नारंगी और गुलाबी आकाश, विस्तृत, 4K"
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold">पोर्ट्रेट</h4>
                <p className="text-sm text-muted-foreground">
                  "एक सुंदर महिला का चित्र, पारंपरिक भारतीय पोशाक में, मुस्कुराते हुए, स्टूडियो लाइटिंग, high-quality"
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold">वास्तुकला</h4>
                <p className="text-sm text-muted-foreground">
                  "आधुनिक भवन डिजाइन, कांच और स्टील, रात में, शहर की रोशनी, cinematic, wide angle"
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-semibold">कलात्मक</h4>
                <p className="text-sm text-muted-foreground">
                  "एक जादुई जंगल, चमकती तितलियाँ, बायोलुमिनेसेंट पौधे, fantasy art style, vibrant colors"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
