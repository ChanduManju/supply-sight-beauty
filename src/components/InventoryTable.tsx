
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForecast } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";

interface InventoryTableProps {
  forecasts: ProductForecast[];
  topForecastsOnly?: boolean;
}

export function InventoryTable({ forecasts, topForecastsOnly = false }: InventoryTableProps) {
  const { toast } = useToast();

  // Get top items requiring attention (low stock or high demand forecast)
  const displayedForecasts = topForecastsOnly 
    ? forecasts
      .filter(f => f.currentStock < f.reorderPoint || f.recommendedOrder > 0)
      .sort((a, b) => b.recommendedOrder - a.recommendedOrder)
      .slice(0, 5)
    : forecasts;

  const handleGeneratePO = (productName: string) => {
    toast({
      title: "Purchase Order Generated",
      description: `A purchase order for ${productName} has been created.`,
    });
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'increase':
        return (
          <div className="forecast-badge increase flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Increasing</span>
          </div>
        );
      case 'decrease':
        return (
          <div className="forecast-badge decrease flex items-center">
            <TrendingDown className="h-3 w-3 mr-1" />
            <span>Decreasing</span>
          </div>
        );
      default:
        return (
          <div className="forecast-badge stable flex items-center">
            <Minus className="h-3 w-3 mr-1" />
            <span>Stable</span>
          </div>
        );
    }
  };

  return (
    <Card className={topForecastsOnly ? "" : "col-span-full"}>
      <CardHeader>
        <CardTitle>{topForecastsOnly ? "Inventory Alerts" : "Inventory Forecast"}</CardTitle>
        <CardDescription>
          {topForecastsOnly 
            ? "Products that need attention based on forecast"
            : "Current stock levels and forecasted demand for all products"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Current Stock</TableHead>
              <TableHead className="text-center">Reorder Point</TableHead>
              <TableHead className="text-center">Forecasted Demand</TableHead>
              <TableHead className="text-center">Recommended Order</TableHead>
              <TableHead className="text-center">Trend</TableHead>
              <TableHead className="text-center">Confidence</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedForecasts.length > 0 ? (
              displayedForecasts.map((forecast) => (
                <TableRow key={forecast.productId}>
                  <TableCell className="font-medium">{forecast.productName}</TableCell>
                  <TableCell className={`text-center ${forecast.currentStock <= forecast.reorderPoint ? "text-red-600 font-medium" : ""}`}>
                    {forecast.currentStock}
                  </TableCell>
                  <TableCell className="text-center">{forecast.reorderPoint}</TableCell>
                  <TableCell className="text-center">{forecast.forecastedDemand.toFixed(0)}</TableCell>
                  <TableCell className="text-center">
                    {forecast.recommendedOrder > 0 ? (
                      <span className="font-medium">{forecast.recommendedOrder.toFixed(0)}</span>
                    ) : (
                      <span className="text-green-600 font-medium">In Stock</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {getTrendBadge(forecast.trend)}
                  </TableCell>
                  <TableCell className="text-center">{forecast.confidence}%</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={forecast.recommendedOrder <= 0}
                      onClick={() => handleGeneratePO(forecast.productName)}
                    >
                      {forecast.recommendedOrder > 0 ? "Create PO" : "No Action"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No forecast data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
