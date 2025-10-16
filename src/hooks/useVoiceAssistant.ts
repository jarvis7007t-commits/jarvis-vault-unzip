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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const processVoiceInput = async (voiceBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Convert speech to text
      console.log('Converting speech to text...');
      const base64Audio = await blobToBase64(voiceBlob);
      
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptError) {
        console.error('Transcription error:', transcriptError, transcriptData);
        // Handle specific errors
        if (transcriptData?.errorCode === 'QUOTA_EXCEEDED') {
          throw new Error('⚠️ OpenAI API क्रेडिट खत्म हो गए हैं। कृपया अपने OpenAI खाते में क्रेडिट जोड़ें: https://platform.openai.com/account/billing');
        }
        throw new Error(transcriptData?.error || transcriptError.message || 'Voice recognition failed');
      }

      const userMessage = transcriptData.text;
      console.log('Transcription:', userMessage);

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

      // Convert text to speech
      console.log('Converting text to speech...');
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
        body: { text: assistantMessage, voice: 'alloy' }
      });

      if (ttsError) throw ttsError;

      // Play audio
      const audioData = atob(ttsData.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const responseAudioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(responseAudioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsListening(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      console.log('Playing audio response');

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
