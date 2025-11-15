import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

export const TextInput = ({ onSubmit, isProcessing }: TextInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="यहाँ टाइप करें या माइक पर क्लिक करें... (Type here or click mic...)"
        disabled={isProcessing}
        className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
      />
      <Button
        type="submit"
        disabled={!text.trim() || isProcessing}
        size="icon"
        className="bg-primary hover:bg-primary/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
