
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SideNav } from "@/components/SideNav";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCards } from "@/components/MetricsCards";
import { ForecastChart } from "@/components/ForecastChart";
import { InventoryTable } from "@/components/InventoryTable";
import { DataUploadForm } from "@/components/DataUploadForm";
import { products, ProductForecast, getSummaryMetrics } from "@/lib/mockData";
import { getForecastsForAllProducts } from "@/lib/mockForecasting";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [forecasts, setForecasts] = useState<ProductForecast[]>([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalInventoryValue: 0,
    averageDemand: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  const loadData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const forecasts = getForecastsForAllProducts(products);
      const metrics = getSummaryMetrics();
      
      setForecasts(forecasts);
      setMetrics(metrics);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SideNav />
        <div className="flex-1 overflow-y-auto">
          <div className="container py-6 space-y-8">
            <DashboardHeader onRefresh={loadData} />

            {loading ? (
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center space-y-4">
                  <div className="animate-pulse-subtle inline-block p-4 rounded-full bg-blue-100">
                    <svg
                      className="h-12 w-12 text-blue-600 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-muted-foreground">Loading forecast data...</p>
                </div>
              </div>
            ) : (
              <>
                <MetricsCards
                  totalProducts={metrics.totalProducts}
                  lowStockItems={metrics.lowStockItems}
                  totalInventoryValue={metrics.totalInventoryValue}
                  averageDemand={metrics.averageDemand}
                />
                
                <div className="grid grid-cols-12 gap-6">
                  <ForecastChart forecasts={forecasts} />
                  <DataUploadForm />
                </div>
                
                <InventoryTable forecasts={forecasts} topForecastsOnly={false} />
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
