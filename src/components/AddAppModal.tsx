import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSavedApps } from '@/hooks/useSavedApps';
import { useToast } from '@/hooks/use-toast';

interface AddAppModalProps {
  open: boolean;
  onClose: () => void;
}

const AddAppModal = ({ open, onClose }: AddAppModalProps) => {
  const [displayName, setDisplayName] = useState('');
  const [url, setUrl] = useState('');
  const [aliases, setAliases] = useState('');
  const { apps, addApp, deleteApp } = useSavedApps();
  const { toast } = useToast();

  const handleAdd = () => {
    if (!displayName.trim() || !url.trim()) {
      toast({
        title: "⚠️ Error",
        description: "Please fill in both display name and URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/|tel:|mailto:|wa\.me|[a-z]+:\/\/)/i;
    if (!urlPattern.test(url.trim())) {
      toast({
        title: "⚠️ Invalid URL",
        description: "Please enter a valid URL or deep link",
        variant: "destructive",
      });
      return;
    }

    const aliasArray = aliases
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    addApp(displayName.trim(), url.trim(), aliasArray);
    
    toast({
      title: "✓ App Added",
      description: `${displayName} has been saved`,
    });

    setDisplayName('');
    setUrl('');
    setAliases('');
  };

  const handleDelete = (id: string, name: string) => {
    deleteApp(id);
    toast({
      title: "✓ App Deleted",
      description: `${name} has been removed`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Applications</DialogTitle>
          <DialogDescription>
            Add application URLs and deep links to launch with voice commands
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="e.g., YouTube, Gmail, Contact Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL / Deep Link *</Label>
            <Input
              id="url"
              placeholder="e.g., https://youtube.com, tel:+919876543210, https://wa.me/919876543210"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aliases">Aliases (optional, comma-separated)</Label>
            <Input
              id="aliases"
              placeholder="e.g., yt, tube, video site"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
            />
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>

        <div className="space-y-2 flex-shrink-0">
          <Label>Saved Applications ({apps.length})</Label>
          <ScrollArea className="h-[180px] rounded border">
            <div className="p-3 space-y-2">
              {apps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved applications yet
                </p>
              ) : (
                apps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{app.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.url}</p>
                      {app.aliases && app.aliases.length > 0 && (
                        <p className="text-xs text-primary/60 mt-1">
                          Aliases: {app.aliases.join(', ')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(app.id, app.displayName)}
                      className="ml-2 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppModal;
