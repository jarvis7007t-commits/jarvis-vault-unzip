import { Settings, Info } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AppSidebar() {

  return (
    <Sidebar className="border-r border-primary/20 bg-card/10 backdrop-blur-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-mono text-xs px-4 py-3">
            JARVIS MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-primary/90">
                    <Settings className="h-4 w-4 text-primary/70" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-primary/90">
                    <Info className="h-4 w-4 text-primary/70" />
                    <span>About</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
