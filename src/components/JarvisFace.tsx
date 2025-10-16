import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

interface JarvisFaceProps {
  isListening?: boolean;
  isProcessing?: boolean;
}

const JarvisFace = ({ isListening, isProcessing }: JarvisFaceProps) => {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (isListening || isProcessing) {
      const interval = setInterval(() => {
        setPulseScale(prev => (prev === 1 ? 1.1 : 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isListening, isProcessing]);

  return (
    <div className="relative flex items-center justify-center h-64 w-64">
      {/* Outer rotating rings */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-4 rounded-full border-2 border-primary/40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
      <div className="absolute inset-8 rounded-full border-2 border-primary/50 animate-spin" style={{ animationDuration: '4s' }} />
      
      {/* Energy waves */}
      {(isListening || isProcessing) && (
        <>
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        </>
      )}
      
      {/* Central core */}
      <div 
        className="absolute inset-16 rounded-full gradient-primary shadow-neon transition-transform duration-500"
        style={{ transform: `scale(${pulseScale})` }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/60 animate-pulse" />
        
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 blur-xl" />
        
        {/* Bot icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="h-20 w-20 text-background drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
        </div>
        
        {/* Scanning line */}
        {(isListening || isProcessing) && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          </div>
        )}
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary animate-pulse" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.25s' }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary animate-pulse" style={{ animationDelay: '0.75s' }} />
      
      {/* Status indicator */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-primary font-mono text-sm tracking-widest animate-pulse">
          {isProcessing ? 'PROCESSING' : isListening ? 'LISTENING' : 'STANDBY'}
        </p>
        <div className="flex gap-1 justify-center mt-2">
          <div className={`w-2 h-2 rounded-full ${isProcessing || isListening ? 'bg-primary' : 'bg-primary/30'} animate-pulse`} />
          <div className={`w-2 h-2 rounded-full ${isProcessing || isListening ? 'bg-primary' : 'bg-primary/30'} animate-pulse`} style={{ animationDelay: '0.2s' }} />
          <div className={`w-2 h-2 rounded-full ${isProcessing || isListening ? 'bg-primary' : 'bg-primary/30'} animate-pulse`} style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default JarvisFace;
