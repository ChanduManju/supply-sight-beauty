
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
  Upload as UploadIcon, 
  Settings as SettingsIcon, 
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Users as UsersIcon,
  LogOut as LogOutIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function AdminNav() {
  const sidebar = useSidebar();
  const [activeItem, setActiveItem] = useState("datasets");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: "datasets", title: "Datasets", icon: UploadIcon },
    { id: "models", title: "Models", icon: BarChartIcon },
    { id: "users", title: "Users", icon: UsersIcon },
    { id: "settings", title: "Settings", icon: SettingsIcon }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar className={sidebar.collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarTrigger className="m-2 self-end">
        {sidebar.collapsed ? <ArrowRightIcon className="h-4 w-4" /> : <ArrowLeftIcon className="h-4 w-4" />}
      </SidebarTrigger>

      <SidebarContent className="mt-2">
        <div className={`mb-8 pl-4 ${sidebar.collapsed ? "text-center pl-0" : ""}`}>
          {!sidebar.collapsed && <h2 className="text-lg font-bold text-primary">Admin Panel</h2>}
          {sidebar.collapsed && <span className="text-lg font-bold text-primary">AP</span>}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={sidebar.collapsed ? "sr-only" : ""}>
            Administration
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto border-t pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="text-red-500 hover:bg-sidebar-accent/50"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
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
