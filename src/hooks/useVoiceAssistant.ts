import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
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
      // Handle voice commands for opening applications
      const lowerMessage = userMessage.toLowerCase();
      
      // Google Search
      if (lowerMessage.includes('google search') || lowerMessage.includes('गूगल सर्च') || 
          lowerMessage.includes('search on google') || lowerMessage.includes('गूगल पर सर्च')) {
        const searchQuery = userMessage.replace(/google search|गूगल सर्च|search on google|गूगल पर सर्च/gi, '').trim();
        if (searchQuery) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
          setMessages(prev => [...prev, 
            { role: 'user', content: userMessage },
            { role: 'assistant', content: `Google search खोल रहा हूं: ${searchQuery}` }
          ]);
          setIsProcessing(false);
          return;
        }
      }
      
      // YouTube
      if (lowerMessage.includes('open youtube') || lowerMessage.includes('youtube खोलो') || 
          lowerMessage.includes('youtube खोल') || lowerMessage.includes('youtube open')) {
        window.open('https://www.youtube.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'YouTube खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }
      
      // WhatsApp Web
      if (lowerMessage.includes('open whatsapp') || lowerMessage.includes('whatsapp खोलो') || 
          lowerMessage.includes('whatsapp खोल') || lowerMessage.includes('whatsapp open')) {
        window.open('https://web.whatsapp.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'WhatsApp Web खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }
      
      // Instagram
      if (lowerMessage.includes('open instagram') || lowerMessage.includes('instagram खोलो') || 
          lowerMessage.includes('instagram खोल') || lowerMessage.includes('instagram open')) {
        window.open('https://www.instagram.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Instagram खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // ChatGPT
      if (lowerMessage.includes('open chatgpt') || lowerMessage.includes('chatgpt खोलो') || 
          lowerMessage.includes('chatgpt खोल') || lowerMessage.includes('chat gpt')) {
        window.open('https://chat.openai.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'ChatGPT खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // Canva
      if (lowerMessage.includes('open canva') || lowerMessage.includes('canva खोलो') || 
          lowerMessage.includes('canva खोल')) {
        window.open('https://www.canva.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Canva खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // VS Code Web
      if (lowerMessage.includes('open vscode') || lowerMessage.includes('visual studio code') || 
          lowerMessage.includes('vs code') || lowerMessage.includes('वीएस कोड')) {
        window.open('https://vscode.dev', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'VS Code Web खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // Gmail
      if (lowerMessage.includes('open gmail') || lowerMessage.includes('gmail खोलो') || 
          lowerMessage.includes('gmail खोल') || lowerMessage.includes('email')) {
        window.open('https://mail.google.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Gmail खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // Facebook
      if (lowerMessage.includes('open facebook') || lowerMessage.includes('facebook खोलो') || 
          lowerMessage.includes('facebook खोल')) {
        window.open('https://www.facebook.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Facebook खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // Twitter/X
      if (lowerMessage.includes('open twitter') || lowerMessage.includes('twitter खोलो') || 
          lowerMessage.includes('open x') || lowerMessage.includes('twitter खोल')) {
        window.open('https://x.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Twitter/X खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // LinkedIn
      if (lowerMessage.includes('open linkedin') || lowerMessage.includes('linkedin खोलो') || 
          lowerMessage.includes('linkedin खोल')) {
        window.open('https://www.linkedin.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'LinkedIn खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

      // GitHub
      if (lowerMessage.includes('open github') || lowerMessage.includes('github खोलो') || 
          lowerMessage.includes('github खोल')) {
        window.open('https://github.com', '_blank');
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'GitHub खोल रहा हूं...' }
        ]);
        setIsProcessing(false);
        return;
      }

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
