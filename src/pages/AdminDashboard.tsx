
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminNav } from "@/components/AdminNav";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Upload, Download, Settings, RefreshCw } from "lucide-react";
import { ForecastModelManager } from "@/components/ForecastModelManager";
import { DatasetManager } from "@/components/DatasetManager";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("datasets");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "All datasets and models are up to date.",
      });
    }, 800);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminNav />
        <div className="flex-1 overflow-y-auto">
          <div className="container py-6 space-y-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage datasets and forecasting models
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>System Settings</span>
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-[400px] mb-8">
                <TabsTrigger value="datasets" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Datasets</span>
                </TabsTrigger>
                <TabsTrigger value="models" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Forecasting Models</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="datasets" className="mt-0">
                <DatasetManager />
              </TabsContent>
              
              <TabsContent value="models" className="mt-0">
                <ForecastModelManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
