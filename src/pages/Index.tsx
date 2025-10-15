import { Bot, Waves } from 'lucide-react';
import VoiceRecorder from '@/components/VoiceRecorder';
import ConversationDisplay from '@/components/ConversationDisplay';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import jarvisBg from '@/assets/jarvis-bg.jpg';

const Index = () => {
  const { messages, isProcessing, isListening, processVoiceInput } = useVoiceAssistant();

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${jarvisBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated Scan Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative border-b border-primary/20 bg-card/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full gradient-primary flex items-center justify-center animate-pulse-neon">
              <Bot className="h-7 w-7 text-background" />
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-wider">JARVIS</h1>
              <p className="text-xs text-primary/70 font-mono">
                {isListening ? '⚡ SPEAKING...' : isProcessing ? '⚙ PROCESSING...' : '● READY'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conversation Display */}
      <ConversationDisplay messages={messages} isListening={isListening} />

      {/* Voice Recorder */}
      <div className="relative border-t border-primary/20 bg-card/10 backdrop-blur-md py-8">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <VoiceRecorder 
            onRecordingComplete={processVoiceInput}
            isProcessing={isProcessing || isListening}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
