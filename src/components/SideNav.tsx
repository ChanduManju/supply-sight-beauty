
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
  BarChart as BarChartIcon, 
  Database as DatabaseIcon, 
  Settings as SettingsIcon, 
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  BarChart2 as BarChart2Icon,
  UserCircle as UserCircleIcon
} from "lucide-react";

export function SideNav() {
  const sidebar = useSidebar();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: BarChartIcon },
    { id: "inventory", title: "Inventory", icon: DatabaseIcon },
    { id: "forecasting", title: "Forecasting", icon: BarChart2Icon },
    { id: "settings", title: "Settings", icon: SettingsIcon }
  ];

  return (
    <Sidebar className={sidebar.collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarTrigger className="m-2 self-end">
        {sidebar.collapsed ? <ArrowRightIcon className="h-4 w-4" /> : <ArrowLeftIcon className="h-4 w-4" />}
      </SidebarTrigger>

      <SidebarContent className="mt-2">
        <div className={`mb-8 pl-4 ${sidebar.collapsed ? "text-center pl-0" : ""}`}>
          {!sidebar.collapsed && <h2 className="text-lg font-bold text-primary">SupplySight</h2>}
          {sidebar.collapsed && <span className="text-lg font-bold text-primary">SS</span>}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={sidebar.collapsed ? "sr-only" : ""}>
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
                    {!sidebar.collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="mt-auto text-red-500 hover:bg-sidebar-accent/50"
                  onClick={() => window.location.href = '/login'}
                >
                  <UserCircleIcon className="mr-2 h-5 w-5" />
                  {!sidebar.collapsed && <span>Log Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
