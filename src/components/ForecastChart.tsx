
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  TooltipProps
} from "recharts";
import { ProductForecast } from "@/lib/mockData";

interface ForecastChartProps {
  forecasts: ProductForecast[];
}

export function ForecastChart({ forecasts }: ForecastChartProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    forecasts.length > 0 ? forecasts[0].productId : ""
  );
  
  const [chartData, setChartData] = useState<any[]>([]);
  const selectedForecast = forecasts.find(f => f.productId === selectedProductId);
  
  useEffect(() => {
    if (selectedForecast) {
      // Combine historical and forecast data
      const historical = selectedForecast.historical.map(h => ({
        ...h,
        date: formatDate(h.date),
        type: 'Historical'
      }));
      
      const forecast = selectedForecast.forecast.map(f => ({
        ...f,
        date: formatDate(f.date),
        type: 'Forecast'
      }));
      
      // Ensure no duplicate dates
      const combined = [...historical, ...forecast];
      const uniqueDates = Array.from(new Set(combined.map(item => item.date)));
      
      // Create final chart data with consistent dates
      const chartData = uniqueDates.map(date => {
        const histPoint = historical.find(h => h.date === date);
        const forecastPoint = forecast.find(f => f.date === date);
        
        return {
          date,
          actual: histPoint?.actual || null,
          forecast: histPoint?.forecast || forecastPoint?.forecast || null,
          lower: forecastPoint?.lower || null,
          upper: forecastPoint?.upper || null,
          type: forecastPoint ? 'Forecast' : 'Historical'
        };
      });
      
      // Sort by date
      chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setChartData(chartData);
    }
  }, [selectedForecast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increase') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'decrease') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-blue-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'increase') return 'text-green-500';
    if (trend === 'decrease') return 'text-red-500';
    return 'text-blue-500';
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          {data.actual !== null && (
            <p className="text-gray-700">
              <span className="font-medium">Actual: </span>
              {data.actual}
            </p>
          )}
          {data.forecast !== null && (
            <p className="text-blue-600">
              <span className="font-medium">Forecast: </span>
              {data.forecast}
            </p>
          )}
          {data.lower !== null && (
            <p className="text-gray-500 text-sm">
              <span className="font-medium">Range: </span>
              {data.lower} - {data.upper}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!selectedForecast) {
    return (
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>No forecast data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-7">
      <CardHeader className="flex-row justify-between items-end">
        <div>
          <CardTitle>Demand Forecast</CardTitle>
          <CardDescription>
            Historical and predicted demand for selected product
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <span className="flex items-center mr-2">
              {getTrendIcon(selectedForecast.trend)}
            </span>
            <span className={`text-sm font-medium ${getTrendColor(selectedForecast.trend)}`}>
              {selectedForecast.trend === 'increase' ? 'Increasing trend' : 
              selectedForecast.trend === 'decrease' ? 'Decreasing trend' : 
              'Stable trend'}
            </span>
          </div>
          
          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {forecasts.map(forecast => (
                <SelectItem key={forecast.productId} value={forecast.productId}>
                  {forecast.productName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              padding={{ left: 20, right: 20 }}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#4f46e5" 
              strokeWidth={2}
              fill="#4f46e5" 
              fillOpacity={0.2}
              name="Actual"
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stroke="#3b82f6" 
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="#3b82f6"
              fillOpacity={0.1}
              name="Forecast"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="transparent"
              fill="#3b82f6"
              fillOpacity={0.1}
              name="Confidence Range"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fill="#3b82f6"
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
