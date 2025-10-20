import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const VoiceTestPanel = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast({
        title: t('voice.error'),
        description: "Please enter some text to speak",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);

    try {
      const selectedProvider = localStorage.getItem('ttsProvider') || 'google';
      const selectedVoice = localStorage.getItem('selectedVoice') || 'Aria';

      let ttsData;
      let ttsError;

      if (selectedProvider === 'google') {
        const response = await supabase.functions.invoke('google-tts', {
          body: { 
            text: text.trim(),
            languageCode: 'hi-IN',
            voiceName: 'hi-IN-Standard-A'
          }
        });
        ttsData = response.data;
        ttsError = response.error;
      } else {
        const response = await supabase.functions.invoke('text-to-speech', {
          body: { text: text.trim(), voice: selectedVoice }
        });
        ttsData = response.data;
        ttsError = response.error;
      }

      if (ttsError) {
        console.error('TTS error:', ttsError);
        throw ttsError;
      }

      if (ttsData?.audioContent) {
        // Decode base64 audio and play
        const audioData = atob(ttsData.audioContent);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        
        const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
          toast({
            title: t('voice.error'),
            description: "Failed to play audio",
            variant: "destructive",
          });
        };
        
        await audio.play();
        console.log('Playing TTS audio...');
      } else {
        setIsPlaying(false);
        throw new Error('No audio content received');
      }
    } catch (error: any) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      toast({
        title: t('voice.error'),
        description: error.message || "Failed to generate speech",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Test Panel
        </CardTitle>
        <CardDescription>
          Type any text and click "Speak" to hear Jarvis speak in Hindi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type something for Jarvis to speak... (Hindi/English both supported)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary"
          disabled={isPlaying}
        />
        <Button
          onClick={handleSpeak}
          disabled={isPlaying || !text.trim()}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {isPlaying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Speaking...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Speak
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
