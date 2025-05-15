
import { Product, ForecastPoint, ProductForecast, generateHistoricalData } from './mockData';

// Mock ML integration for forecasting
export const generateForecast = (product: Product): ProductForecast => {
  // Get historical data
  const historical = generateHistoricalData(product.id);
  
  // Generate forecast for next 30 days
  const lastDate = new Date(historical[historical.length - 1].date);
  const forecast: ForecastPoint[] = [];
  
  // Calculate trend from historical data
  const first5avg = historical.slice(0, 5).reduce((sum, point) => sum + (point.actual || 0), 0) / 5;
  const last5avg = historical.slice(-5).reduce((sum, point) => sum + (point.actual || 0), 0) / 5;
  const trendPercent = ((last5avg - first5avg) / first5avg) * 100;
  
  let trend: 'increase' | 'decrease' | 'stable';
  if (trendPercent > 5) trend = 'increase';
  else if (trendPercent < -5) trend = 'decrease';
  else trend = 'stable';
  
  // Generate mock forecast points
  for (let i = 1; i <= 30; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(lastDate.getDate() + i);
    
    // Base the forecast on the last actual value with some trend
    const lastActual = historical[historical.length - 1].actual || 0;
    const trendFactor = 1 + (trendPercent / 100) * (i / 30);
    
    // Add some randomness
    const randomFactor = 0.9 + Math.random() * 0.2;
    const forecastValue = Math.round(lastActual * trendFactor * randomFactor);
    
    // Add confidence interval
    const confidenceFactor = 0.05 + (i * 0.01); // Increases with time
    const lower = Math.round(forecastValue * (1 - confidenceFactor));
    const upper = Math.round(forecastValue * (1 + confidenceFactor));
    
    // Only include every 3rd day to avoid too many data points
    if (i % 3 === 0) {
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        forecast: forecastValue,
        lower,
        upper
      });
    }
  }
  
  // Calculate total forecasted demand
  const forecastedDemand = forecast.reduce((sum, point) => sum + point.forecast, 0);
  
  // Calculate recommended order quantity
  const daysUntilReorder = product.stock > product.reorderPoint ? 
    Math.floor((product.stock - product.reorderPoint) / (forecastedDemand / forecast.length)) : 0;
  
  const recommendedOrder = Math.max(
    0,
    forecastedDemand - product.stock + product.reorderPoint
  );
  
  return {
    productId: product.id,
    productName: product.name,
    currentStock: product.stock,
    reorderPoint: product.reorderPoint,
    forecastedDemand,
    recommendedOrder,
    trend,
    confidence: 85 + Math.floor(Math.random() * 10), // Random confidence between 85-94%
    historical,
    forecast
  };
};

export const getForecastsForAllProducts = (products: Product[]): ProductForecast[] => {
  return products.map(product => generateForecast(product));
};
