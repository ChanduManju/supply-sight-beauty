
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Download, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export has been initiated.",
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Forecast Dashboard</h1>
          {user && (
            <div className="ml-2 flex items-center text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4 mr-1" />
              <span>{user.name}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          Track inventory levels and predict future demand
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            onRefresh();
            toast({
              title: "Dashboard Refreshed",
              description: "Latest data has been loaded.",
            });
          }}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExportData}
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
}
