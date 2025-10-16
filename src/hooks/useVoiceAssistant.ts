import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useVoiceAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const processVoiceInput = async (userMessage: string) => {
    setIsProcessing(true);

    try {
      console.log('User message:', userMessage);

      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      // Get AI response
      setIsListening(true);
      console.log('Getting AI response...');
      
      const { data: chatData, error: chatError } = await supabase.functions.invoke('chat', {
        body: { message: userMessage }
      });

      if (chatError) throw chatError;

      const assistantMessage = chatData.reply;
      console.log('AI response:', assistantMessage);

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Convert text to speech using browser's Speech Synthesis
      console.log('Converting text to speech...');
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage);
        utterance.lang = 'en-IN'; // English (India)
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
          setIsListening(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsListening(false);
        };
        
        window.speechSynthesis.speak(utterance);
        console.log('Speaking response...');
      } else {
        // Fallback: just end the listening state
        setIsListening(false);
        toast({
          title: "ℹ️ Info",
          description: "Text-to-speech not supported in this browser",
          variant: "default",
        });
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "❌ एरर / Error",
        description: error.message || "Failed to process voice input",
        variant: "destructive",
        duration: 10000,
      });
      setIsListening(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    messages,
    isProcessing,
    isListening,
    processVoiceInput
  };
};
