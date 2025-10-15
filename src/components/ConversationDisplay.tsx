import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationDisplayProps {
  messages: Message[];
  isListening?: boolean;
}

const ConversationDisplay = ({ messages, isListening }: ConversationDisplayProps) => {
  return (
    <ScrollArea className="flex-1 w-full px-4">
      <div className="max-w-3xl mx-auto space-y-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 items-start",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}
            
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[80%]",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>

            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}

        {isListening && (
          <div className="flex gap-3 items-start justify-start">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="h-5 w-5" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationDisplay;
