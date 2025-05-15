
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Database, AlertTriangle } from "lucide-react";

interface MetricsCardsProps {
  totalProducts: number;
  lowStockItems: number;
  totalInventoryValue: number;
  averageDemand: number;
}

export function MetricsCards({ 
  totalProducts, 
  lowStockItems, 
  totalInventoryValue,
  averageDemand
}: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Items in your inventory
          </p>
        </CardContent>
      </Card>
      
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Items
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">
            Items below reorder point
          </p>
        </CardContent>
      </Card>
      
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Inventory Value
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalInventoryValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total value of current inventory
          </p>
        </CardContent>
      </Card>
      
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Monthly Demand
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDemand}</div>
          <p className="text-xs text-muted-foreground">
            Units sold per month (avg)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
