
import { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

import { 
  ChartBarIcon, 
  Database as DatabaseIcon, 
  Settings as SettingsIcon, 
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  BarChart as BarChartIcon
} from "lucide-react";

export function SideNav() {
  const { collapsed } = useSidebar();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: ChartBarIcon },
    { id: "inventory", title: "Inventory", icon: DatabaseIcon },
    { id: "forecasting", title: "Forecasting", icon: BarChartIcon },
    { id: "settings", title: "Settings", icon: SettingsIcon }
  ];

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarTrigger className="m-2 self-end">
        {collapsed ? <ArrowRightIcon className="h-4 w-4" /> : <ArrowLeftIcon className="h-4 w-4" />}
      </SidebarTrigger>

      <SidebarContent className="mt-2">
        <div className={`mb-8 pl-4 ${collapsed ? "text-center pl-0" : ""}`}>
          {!collapsed && <h2 className="text-lg font-bold text-primary">SupplySight</h2>}
          {collapsed && <span className="text-lg font-bold text-primary">SS</span>}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    className={`${activeItem === item.id ? "bg-sidebar-accent text-primary font-medium" : "hover:bg-sidebar-accent/50"}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
