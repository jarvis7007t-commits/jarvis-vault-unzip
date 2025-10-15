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
    <ScrollArea className="flex-1 w-full px-4 relative">
      <div className="max-w-3xl mx-auto space-y-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 items-start animate-fade-in",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 border-2 border-primary/50">
                <Bot className="h-6 w-6 text-background" />
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
              </div>
            )}
            
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[80%] backdrop-blur-sm border-2 transition-all hover:scale-[1.02]",
                message.role === 'user'
                  ? "bg-primary/20 text-foreground border-primary shadow-neon"
                  : "bg-card/50 border-primary/30"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>

            {message.role === 'user' && (
              <div className="relative h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0 border-2 border-secondary">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        ))}

        {isListening && (
          <div className="flex gap-3 items-start justify-start animate-fade-in">
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 animate-pulse-neon border-2 border-primary">
              <Bot className="h-6 w-6 text-background" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card/50 border-2 border-primary/30 backdrop-blur-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-neon" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-neon" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-neon" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationDisplay;
