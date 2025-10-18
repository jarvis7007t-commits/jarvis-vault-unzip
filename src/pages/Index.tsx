import VoiceRecorder from '@/components/VoiceRecorder';
import ConversationDisplay from '@/components/ConversationDisplay';
import JarvisFace from '@/components/JarvisFace';
import NavigationBar from '@/components/NavigationBar';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import jarvisBg from '@/assets/jarvis-bg.jpg';

const Index = () => {
  const { messages, isProcessing, isListening, processVoiceInput } = useVoiceAssistant();

  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${jarvisBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Navigation Bar */}
      <NavigationBar isListening={isListening} isProcessing={isProcessing} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-8 py-12">
            <JarvisFace isListening={isListening} isProcessing={isProcessing} />
            <div className="text-center space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-primary">J.A.R.V.I.S. Interface</h2>
              <p className="text-primary/70 font-mono text-sm">
                Just A Rather Very Intelligent System
              </p>
              <p className="text-primary/50 text-xs">
                Voice-activated AI assistant ready for your commands
              </p>
            </div>
          </div>
        ) : (
          <ConversationDisplay messages={messages} isListening={isListening} />
        )}
      </main>

      {/* Voice Recorder */}
      <div className="relative border-t border-primary/20 bg-card/10 backdrop-blur-md py-8 z-10">
        <div className="container mx-auto px-4 relative">
          <VoiceRecorder 
            onTranscript={processVoiceInput}
            isProcessing={isProcessing || isListening}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
