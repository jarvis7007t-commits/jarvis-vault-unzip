import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversationHistory } from '@/hooks/useConversationHistory';

export function AppSidebar() {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
  } = useConversationHistory();

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  return (
    <Sidebar className="border-r border-primary/20 bg-card/10 backdrop-blur-md">
      <SidebarHeader className="border-b border-primary/20 p-4">
        <Button
          onClick={handleNewChat}
          className="w-full gradient-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-mono text-xs">
            CONVERSATION HISTORY
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-180px)]">
              <SidebarMenu>
                {conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      isActive={conversation.id === currentConversationId}
                      onClick={() => switchConversation(conversation.id)}
                      className="group relative"
                    >
                      <MessageSquare className="h-4 w-4 text-primary/70" />
                      <span className="truncate text-primary/90">{conversation.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="text-primary/50 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
                
                {conversations.length === 0 && (
                  <div className="p-4 text-center text-primary/50 text-sm font-mono">
                    No conversations yet
                  </div>
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
