import { Settings, Plus, MessageSquare, Trash2, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import type { User } from '@supabase/supabase-js';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: number;
  updatedAt: number;
}

interface AppSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenImagenAI?: () => void;
}

export function AppSidebar({ 
  conversations, 
  currentConversationId, 
  onNewChat, 
  onSwitchConversation,
  onDeleteConversation,
  onOpenImagenAI
}: AppSidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "✅ " + t('common.success'),
      description: t('nav.logout'),
    });
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarContent className="bg-background">
        {/* New Chat Button */}
        <div className="p-3 border-b border-border">
          <Button 
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>{t('nav.newChat')}</span>
          </Button>
        </div>

        {/* Conversation History */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-mono text-xs px-4 py-3">
            CHAT HISTORY
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <SidebarMenu>
                {conversations.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  conversations
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((conversation) => (
                      <SidebarMenuItem key={conversation.id}>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted group">
                          <SidebarMenuButton
                            onClick={() => onSwitchConversation(conversation.id)}
                            className={`flex-1 justify-start ${
                              currentConversationId === conversation.id
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <MessageSquare className="h-4 w-4 shrink-0" />
                            <span className="truncate text-sm">{conversation.title}</span>
                          </SidebarMenuButton>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Imagen AI */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/settings')}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('nav.settings')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onOpenImagenAI?.()}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Imagen AI</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Login/Logout at Bottom */}
      <SidebarFooter className="border-t border-border bg-background p-3">
        {user ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('nav.logout')}</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>{t('nav.login')}</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
