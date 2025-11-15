import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSavedApps } from './useSavedApps';
import { useConversationHistory } from './useConversationHistory';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useVoiceAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const { findAppByName } = useSavedApps();
  const { 
    conversations, 
    currentConversationId, 
    createNewConversation, 
    updateConversationMessages,
    getCurrentConversation,
    deleteConversation,
    switchConversation
  } = useConversationHistory();

  // Load current conversation messages
  useEffect(() => {
    const current = getCurrentConversation();
    if (current) {
      setMessages(current.messages);
    }
  }, [currentConversationId]);

  // Save messages to current conversation
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      updateConversationMessages(currentConversationId, messages);
    }
  }, [messages, currentConversationId]);

  const processVoiceInput = async (userMessage: string) => {
    setIsProcessing(true);

    try {
      const lowerMessage = userMessage.toLowerCase();

      // Handle "call" commands
      if (lowerMessage.includes('call ')) {
        const contactName = lowerMessage.replace(/call|कॉल|फोन|phone/gi, '').trim();
        const app = findAppByName(contactName);
        
        if (app && app.url.startsWith('tel:')) {
          window.open(app.url, '_self');
          setMessages(prev => [...prev, 
            { role: 'user', content: userMessage },
            { role: 'assistant', content: `Calling ${app.displayName}...` }
          ]);
          setIsProcessing(false);
          return;
        } else {
          setMessages(prev => [...prev, 
            { role: 'user', content: userMessage },
            { role: 'assistant', content: `No phone number saved for ${contactName}` }
          ]);
          setIsProcessing(false);
          return;
        }
      }

      // Handle "send whatsapp message" commands
      if (lowerMessage.includes('whatsapp message') || lowerMessage.includes('message on whatsapp')) {
        const parts = userMessage.split(':');
        if (parts.length >= 2) {
          const contactPart = parts[0].toLowerCase();
          const messagePart = parts.slice(1).join(':').trim();
          const contactName = contactPart
            .replace(/send|whatsapp|message|to|on|भेजो|मैसेज/gi, '')
            .trim();
          
          const app = findAppByName(contactName);
          
          if (app && (app.url.includes('wa.me') || app.url.includes('whatsapp'))) {
            const waUrl = `${app.url}${app.url.includes('?') ? '&' : '?'}text=${encodeURIComponent(messagePart)}`;
            window.open(waUrl, '_blank');
            setMessages(prev => [...prev, 
              { role: 'user', content: userMessage },
              { role: 'assistant', content: `Sending WhatsApp message to ${app.displayName}...` }
            ]);
            setIsProcessing(false);
            return;
          } else {
            setMessages(prev => [...prev, 
              { role: 'user', content: userMessage },
              { role: 'assistant', content: `No WhatsApp link saved for ${contactName}` }
            ]);
            setIsProcessing(false);
            return;
          }
        }
      }

      // Handle "open" commands for saved apps
      if (lowerMessage.includes('open ') || lowerMessage.includes('खोलो') || lowerMessage.includes('खोल')) {
        const appName = lowerMessage
          .replace(/open|खोलो|खोल/gi, '')
          .trim();
        
        const app = findAppByName(appName);
        
        if (app) {
          window.open(app.url, '_blank');
          setMessages(prev => [...prev, 
            { role: 'user', content: userMessage },
            { role: 'assistant', content: `Opening ${app.displayName}...` }
          ]);
          setIsProcessing(false);
          return;
        }
      }
      
      // Handle voice commands for opening applications
      
      // Google Search - now with real-time search
      if (lowerMessage.includes('google search') || lowerMessage.includes('गूगल सर्च') || 
          lowerMessage.includes('search on google') || lowerMessage.includes('गूगल पर सर्च') ||
          lowerMessage.includes('search for') || lowerMessage.includes('सर्च करो')) {
        const searchQuery = userMessage.replace(/google search|गूगल सर्च|search on google|गूगल पर सर्च|search for|सर्च करो/gi, '').trim();
        if (searchQuery) {
          setMessages(prev => [...prev, 
            { role: 'user', content: userMessage },
            { role: 'assistant', content: `इंटरनेट पर सर्च कर रहा हूं: ${searchQuery}...` }
          ]);
          
          try {
            const { data: searchData, error: searchError } = await supabase.functions.invoke('web-search', {
              body: { query: searchQuery }
            });

            if (searchError) throw searchError;

            const searchResults = searchData.results || 'कोई परिणाम नहीं मिला';
            setMessages(prev => [...prev, 
              { role: 'assistant', content: searchResults }
            ]);
          } catch (error: any) {
            console.error('Search error:', error);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
            setMessages(prev => [...prev, 
              { role: 'assistant', content: `Google search खोल रहा हूं: ${searchQuery}` }
            ]);
          }
          setIsProcessing(false);
          return;
        }
      }

      // News command
      if (lowerMessage.includes('news') || lowerMessage.includes('खबर') || 
          lowerMessage.includes('समाचार') || lowerMessage.includes('न्यूज')) {
        setMessages(prev => [...prev, 
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'ताज़ा खबरें ला रहा हूं...' }
        ]);
        
        try {
          const { data: newsData, error: newsError } = await supabase.functions.invoke('get-news', {
            body: { category: 'general' }
          });

          if (newsError) throw newsError;

          const newsResults = newsData.news || 'कोई खबर नहीं मिली';
          setMessages(prev => [...prev, 
            { role: 'assistant', content: newsResults }
          ]);
        } catch (error: any) {
          console.error('News error:', error);
          setMessages(prev => [...prev, 
            { role: 'assistant', content: 'खबरें लाने में समस्या हुई' }
          ]);
        }
        setIsProcessing(false);
        return;
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

      // Convert text to speech using browser's built-in API (no external API needed)
      console.log('Converting text to speech...');
      
      if ('speechSynthesis' in window) {
        try {
          // Get user preferences from localStorage
          const selectedVoiceLang = localStorage.getItem('hindiVoice') || 'hi-IN';
          const speechRate = parseFloat(localStorage.getItem('speechRate') || '0.9');
          
          const utterance = new SpeechSynthesisUtterance(assistantMessage);
          utterance.lang = selectedVoiceLang;
          utterance.rate = speechRate;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          utterance.onend = () => setIsListening(false);
          utterance.onerror = () => setIsListening(false);
          
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Speech synthesis error:', error);
          setIsListening(false);
        }
      } else {
        console.log('Speech synthesis not supported');
        setIsListening(false);
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

  const handleNewChat = () => {
    createNewConversation();
    setMessages([]);
  };

  const handleSwitchConversation = (id: string) => {
    switchConversation(id);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (id === currentConversationId) {
      setMessages([]);
    }
  };

  return {
    messages,
    isProcessing,
    isListening,
    processVoiceInput,
    conversations,
    currentConversationId,
    handleNewChat,
    handleSwitchConversation,
    handleDeleteConversation,
  };
};
