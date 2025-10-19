import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Globe, Mic, Moon, Sun, LogOut, ArrowLeft } from 'lucide-react';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [newsEnabled, setNewsEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "✅ लॉगआउट सफल",
      description: "आप सफलतापूर्वक लॉगआउट हो गए हैं",
    });
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">सेटिंग्स</h1>
            <p className="text-muted-foreground">अपनी प्राथमिकताएं प्रबंधित करें</p>
          </div>
        </div>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              अकाउंट
            </CardTitle>
            <CardDescription>अपनी अकाउंट जानकारी देखें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <Label>ईमेल</Label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Label>स्थिति</Label>
                  <p className="text-sm text-green-600">✅ लॉगिन</p>
                </div>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  लॉगआउट करें
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="w-full">
                लॉगिन / साइन अप करें
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              दिखावट
            </CardTitle>
            <CardDescription>अपनी थीम चुनें</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">डार्क मोड</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              फीचर्स
            </CardTitle>
            <CardDescription>फीचर्स को चालू/बंद करें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  वॉइस असिस्टेंट
                </Label>
                <p className="text-xs text-muted-foreground">आवाज से कमांड दें</p>
              </div>
              <Switch
                id="voice"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="news" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  समाचार
                </Label>
                <p className="text-xs text-muted-foreground">रियल-टाइम न्यूज़ (2025)</p>
              </div>
              <Switch
                id="news"
                checked={newsEnabled}
                onCheckedChange={setNewsEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="search" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  गूगल सर्च
                </Label>
                <p className="text-xs text-muted-foreground">रियल-टाइम इंटरनेट सर्च</p>
              </div>
              <Switch
                id="search"
                checked={searchEnabled}
                onCheckedChange={setSearchEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>एआई के बारे में</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label>संस्करण</Label>
              <p className="text-sm text-muted-foreground">Jarvis AI 2025</p>
            </div>
            <div>
              <Label>डेटा</Label>
              <p className="text-sm text-muted-foreground">2025 का लाइव डेटा</p>
            </div>
            <div>
              <Label>क्षमताएं</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>रियल-टाइम गूगल सर्च</li>
                <li>लाइव समाचार</li>
                <li>वॉइस कमांड</li>
                <li>ऐप लॉन्चर</li>
                <li>व्हाट्सएप मैसेजिंग</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
