import { useState, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'jarvis_conversations';

export const useConversationHistory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount only
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        // Set the most recent conversation as current if no conversation is selected
        if (!currentConversationId && parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []); // Empty dependency array - run only on mount

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    setConversations(convs);
  };

  // Create a new conversation
  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newConv, ...conversations];
    saveConversations(updated);
    setCurrentConversationId(newConv.id);
    return newConv.id;
  };

  // Update conversation messages
  const updateConversationMessages = (conversationId: string, messages: Message[]) => {
    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        // Generate title from first user message
        let title = conv.title;
        if (messages.length > 0 && conv.title === 'New Chat') {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
          }
        }
        
        return {
          ...conv,
          messages,
          title,
          updatedAt: Date.now(),
        };
      }
      return conv;
    });
    
    // Sort by updatedAt
    updated.sort((a, b) => b.updatedAt - a.updatedAt);
    saveConversations(updated);
  };

  // Get current conversation
  const getCurrentConversation = () => {
    return conversations.find(c => c.id === currentConversationId) || null;
  };

  // Delete a conversation
  const deleteConversation = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    saveConversations(updated);
    
    // If we deleted the current conversation, switch to another one
    if (conversationId === currentConversationId) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
      } else {
        setCurrentConversationId(null);
      }
    }
  };

  // Switch to a conversation
  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    updateConversationMessages,
    deleteConversation,
    switchConversation,
  };
};
