import { useState, useEffect } from 'react';
import { Bot, Plus, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import AddAppModal from './AddAppModal';

const NavigationBar = ({ isListening, isProcessing }: { isListening: boolean; isProcessing: boolean }) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const { toggleSidebar } = useSidebar();
  const { t } = useLanguage();

  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        } catch (error) {
          console.log('Battery API not available');
        }
      }
    };

    updateBattery();
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="h-5 w-5" />;
    if (batteryLevel === null) return <Battery className="h-5 w-5" />;
    if (batteryLevel > 80) return <BatteryFull className="h-5 w-5" />;
    if (batteryLevel > 40) return <BatteryMedium className="h-5 w-5" />;
    return <BatteryLow className="h-5 w-5" />;
  };

  return (
    <>
      <header className="relative border-b border-border bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="relative h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="h-7 w-7 text-background" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground tracking-wider">JARVIS</h1>
                <p className="text-xs text-muted-foreground font-mono">
                  {isListening ? '⚡ ' + t('voice.processing').toUpperCase() : isProcessing ? '⚙ ' + t('voice.processing').toUpperCase() : '● ' + t('voice.jarvisReady').toUpperCase()}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-4">
              {batteryLevel !== null && (
                <div className="flex items-center gap-2 text-foreground">
                  {getBatteryIcon()}
                  <span className="text-sm font-mono">{batteryLevel}%</span>
                </div>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddAppModal(true)}
                className="rounded-full border-border hover:bg-muted"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AddAppModal 
        open={showAddAppModal} 
        onClose={() => setShowAddAppModal(false)} 
      />
    </>
  );
};

export default NavigationBar;
