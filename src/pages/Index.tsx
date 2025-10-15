import { Bot } from 'lucide-react';
import VoiceRecorder from '@/components/VoiceRecorder';
import ConversationDisplay from '@/components/ConversationDisplay';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

const Index = () => {
  const { messages, isProcessing, isListening, processVoiceInput } = useVoiceAssistant();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Voice Assistant</h1>
              <p className="text-xs text-muted-foreground">
                {isListening ? 'Speaking...' : isProcessing ? 'Processing...' : 'Ready to help'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conversation Display */}
      <ConversationDisplay messages={messages} isListening={isListening} />

      {/* Voice Recorder */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
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
