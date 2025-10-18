import { Settings, Plus, MessageSquare, Trash2, LogIn, LogOut } from 'lucide-react';
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
import { useState } from 'react';

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
}

export function AppSidebar({ 
  conversations, 
  currentConversationId, 
  onNewChat, 
  onSwitchConversation,
  onDeleteConversation 
}: AppSidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <span>New Chat</span>
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

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-muted-foreground hover:text-foreground hover:bg-muted">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Login/Logout at Bottom */}
      <SidebarFooter className="border-t border-border bg-background p-3">
        <Button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          {isLoggedIn ? (
            <>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
