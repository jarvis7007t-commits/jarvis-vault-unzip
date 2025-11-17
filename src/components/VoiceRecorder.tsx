import { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const VoiceRecorder = ({ onTranscript, isProcessing }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN'; // Hindi (India) for better Hindi recognition
    recognition.maxAlternatives = 3;
    
    recognition.onresult = (event: any) => {
      // Only process final results to avoid duplicate messages
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const transcript = result[0].transcript;
        console.log('Final Transcript:', transcript);
        onTranscript(transcript);
        setIsRecording(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      let errorMessage = 'Voice recognition failed';
      if (event.error === 'no-speech') {
        errorMessage = 'कोई आवाज नहीं सुनाई दी। कृपया फिर से प्रयास करें।';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'माइक्रोफ़ोन की अनुमति दें।';
      }
      
      toast({
        title: "❌ एरर / Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, toast]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "❌ एरर / Error",
          description: "Voice recognition शुरू नहीं हो सका। कृपया browser refresh करें।",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ripple" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ripple" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ripple" style={{ animationDelay: '1s' }} />
          </>
        )}
        
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "relative h-28 w-28 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-primary transition-all duration-300",
            isRecording && "animate-pulse-neon scale-110",
            isProcessing && "opacity-50 cursor-not-allowed",
            !isRecording && !isProcessing && "hover:scale-105 shadow-neon"
          )}
        >
          <div className="absolute inset-2 rounded-full border border-primary/50 animate-pulse" />
          {isRecording ? (
            <Square className="h-10 w-10 text-background" fill="currentColor" />
          ) : (
            <Mic className="h-10 w-10 text-background" />
          )}
        </Button>
      </div>

      <p className="text-sm text-primary font-mono tracking-wide">
        {isProcessing ? '⚙ ' + t('voice.processing').toUpperCase() : isRecording ? '⏹ ' + t('voice.tapToStop').toUpperCase() : t('voice.tapToSpeak').toUpperCase()}
      </p>
    </div>
  );
};

export default VoiceRecorder;
