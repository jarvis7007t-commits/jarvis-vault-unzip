import { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

const VoiceRecorder = ({ onRecordingComplete, isProcessing }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
        {isProcessing ? '⚙ PROCESSING...' : isRecording ? '⏹ TAP TO STOP' : '🎤 TAP TO SPEAK'}
      </p>
    </div>
  );
};

export default VoiceRecorder;
