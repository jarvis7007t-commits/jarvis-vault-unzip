import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { User, Bell, Globe, Mic, Moon, Sun, LogOut, ArrowLeft, Languages, Volume2 } from 'lucide-react';
import { VoiceTestPanel } from '@/components/VoiceTestPanel';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [newsEnabled, setNewsEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return localStorage.getItem('selectedVoice') || 'Aria';
  });
  const [ttsProvider, setTtsProvider] = useState(() => {
    return localStorage.getItem('ttsProvider') || 'browser';
  });
  const [speechRate, setSpeechRate] = useState(() => {
    return parseFloat(localStorage.getItem('speechRate') || '0.9');
  });
  const [hindiVoice, setHindiVoice] = useState(() => {
    return localStorage.getItem('hindiVoice') || 'hi-IN';
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

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
      title: "✅ " + t('nav.logout'),
      description: t('common.success'),
    });
    navigate('/auth');
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('selectedVoice', voice);
    toast({
      title: t('common.success'),
      description: `${t('settings.voiceModel')}: ${voice}`,
    });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
    toast({
      title: t('common.success'),
      description: `${t('settings.language')}: ${lang}`,
    });
  };

  const handleTtsProviderChange = (provider: string) => {
    setTtsProvider(provider);
    localStorage.setItem('ttsProvider', provider);
    toast({
      title: t('common.success'),
      description: `Voice Provider: ${provider === 'browser' ? 'Browser (Free)' : provider}`,
    });
  };

  const handleSpeechRateChange = (rate: string) => {
    const rateValue = parseFloat(rate);
    setSpeechRate(rateValue);
    localStorage.setItem('speechRate', rate);
    toast({
      title: t('common.success'),
      description: `Speech Rate: ${rate}x`,
    });
  };

  const handleHindiVoiceChange = (voice: string) => {
    setHindiVoice(voice);
    localStorage.setItem('hindiVoice', voice);
    toast({
      title: t('common.success'),
      description: `Hindi Voice: ${voice}`,
    });
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
            <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.subtitle')}</p>
          </div>
        </div>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.account')}
            </CardTitle>
            <CardDescription>{t('settings.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <Label>{t('settings.email')}</Label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Label>{t('settings.status')}</Label>
                  <p className="text-sm text-green-600">✅ {t('settings.loggedIn')}</p>
                </div>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="w-full">
                {t('nav.login')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {t('settings.appearance')}
            </CardTitle>
            <CardDescription>{t('settings.selectLanguage')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">{t('settings.darkMode')}</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t('settings.language')}
              </Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文 (Chinese)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {t('settings.voice')}
            </CardTitle>
            <CardDescription>आवाज और बोलने की गति चुनें (Choose voice and speech rate)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">🆓 Browser Voice (बिल्कुल मुफ्त - No API needed)</p>
              <p className="text-xs text-muted-foreground mt-1">
                आपके ब्राउज़र की built-in Hindi voice का उपयोग करता है
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="hindi-voice">हिंदी आवाज़ (Hindi Voice)</Label>
              <Select value={hindiVoice} onValueChange={handleHindiVoiceChange}>
                <SelectTrigger id="hindi-voice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi-IN">🇮🇳 Hindi (India) - Standard</SelectItem>
                  <SelectItem value="en-IN">🇮🇳 English (India)</SelectItem>
                  <SelectItem value="hi">हिंदी - Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-rate">बोलने की गति (Speech Rate)</Label>
              <Select value={speechRate.toString()} onValueChange={handleSpeechRateChange}>
                <SelectTrigger id="speech-rate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">🐢 बहुत धीमी (0.5x - Very Slow)</SelectItem>
                  <SelectItem value="0.75">🐌 धीमी (0.75x - Slow)</SelectItem>
                  <SelectItem value="0.9">⚡ सामान्य (0.9x - Normal)</SelectItem>
                  <SelectItem value="1.0">🎯 मानक (1.0x - Standard)</SelectItem>
                  <SelectItem value="1.2">⚡ तेज़ (1.2x - Fast)</SelectItem>
                  <SelectItem value="1.5">🚀 बहुत तेज़ (1.5x - Very Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 टिप: धीमी गति से शुरू करें और अपनी पसंद के अनुसार बढ़ाएं
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Voice Test Panel */}
        <VoiceTestPanel />

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('settings.features')}
            </CardTitle>
            <CardDescription>{t('settings.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  {t('settings.voiceAssistant')}
                </Label>
                <p className="text-xs text-muted-foreground">{t('settings.voiceDesc')}</p>
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
                  {t('settings.news')}
                </Label>
                <p className="text-xs text-muted-foreground">{t('settings.newsDesc')}</p>
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
                  {t('settings.search')}
                </Label>
                <p className="text-xs text-muted-foreground">{t('settings.searchDesc')}</p>
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
            <CardTitle>{t('settings.about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label>{t('settings.version')}</Label>
              <p className="text-sm text-muted-foreground">Jarvis AI 2025</p>
            </div>
            <div>
              <Label>{t('settings.data')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.liveData')}</p>
            </div>
            <div>
              <Label>{t('settings.capabilities')}</Label>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>{t('settings.search')}</li>
                <li>{t('settings.news')}</li>
                <li>{t('settings.voiceAssistant')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
