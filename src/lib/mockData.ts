
// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  leadTime: number; // in days
}

export interface HistoricalDemand {
  date: string;
  productId: string;
  quantity: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower?: number;
  upper?: number;
}

export interface ProductForecast {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  forecastedDemand: number;
  recommendedOrder: number;
  trend: 'increase' | 'decrease' | 'stable';
  confidence: number;
  historical: ForecastPoint[];
  forecast: ForecastPoint[];
}

// Mock dataset
export const products: Product[] = [
  { 
    id: "1", 
    name: "Ergonomic Chair", 
    category: "Furniture", 
    sku: "FRN-CH-001", 
    price: 249.99, 
    stock: 45, 
    reorderPoint: 15, 
    supplier: "Office Essentials", 
    leadTime: 14 
  },
  { 
    id: "2", 
    name: "Standing Desk", 
    category: "Furniture", 
    sku: "FRN-DSK-002", 
    price: 399.99, 
    stock: 23, 
    reorderPoint: 10, 
    supplier: "Office Essentials", 
    leadTime: 21 
  },
  { 
    id: "3", 
    name: "Wireless Keyboard", 
    category: "Electronics", 
    sku: "ELC-KB-003", 
    price: 89.99, 
    stock: 65, 
    reorderPoint: 30, 
    supplier: "TechGear Ltd", 
    leadTime: 7 
  },
  { 
    id: "4", 
    name: "Wireless Mouse", 
    category: "Electronics", 
    sku: "ELC-MS-004", 
    price: 49.99, 
    stock: 78, 
    reorderPoint: 35, 
    supplier: "TechGear Ltd", 
    leadTime: 7 
  },
  { 
    id: "5", 
    name: "27\" Monitor", 
    category: "Electronics", 
    sku: "ELC-MON-005", 
    price: 299.99, 
    stock: 32, 
    reorderPoint: 12, 
    supplier: "DisplayTech", 
    leadTime: 10 
  },
  { 
    id: "6", 
    name: "Desk Lamp", 
    category: "Accessories", 
    sku: "ACC-LMP-006", 
    price: 39.99, 
    stock: 54, 
    reorderPoint: 20, 
    supplier: "LightWorks", 
    leadTime: 5 
  },
  { 
    id: "7", 
    name: "Laptop Stand", 
    category: "Accessories", 
    sku: "ACC-STD-007", 
    price: 29.99, 
    stock: 42, 
    reorderPoint: 18, 
    supplier: "Office Essentials", 
    leadTime: 3 
  },
  { 
    id: "8", 
    name: "Docking Station", 
    category: "Electronics", 
    sku: "ELC-DOC-008", 
    price: 129.99, 
    stock: 19, 
    reorderPoint: 8, 
    supplier: "TechGear Ltd", 
    leadTime: 9 
  },
  { 
    id: "9", 
    name: "Office Chair Mat", 
    category: "Accessories", 
    sku: "ACC-MAT-009", 
    price: 49.99, 
    stock: 37, 
    reorderPoint: 15, 
    supplier: "Floor Solutions", 
    leadTime: 4 
  },
  { 
    id: "10", 
    name: "Desk Organizer", 
    category: "Accessories", 
    sku: "ACC-ORG-010", 
    price: 24.99, 
    stock: 61, 
    reorderPoint: 25, 
    supplier: "Office Essentials", 
    leadTime: 3 
  }
];

// Generate sample historical data for the past 6 months
export const generateHistoricalData = (productId: string): ForecastPoint[] => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  const data: ForecastPoint[] = [];
  const baseQuantity = Math.floor(Math.random() * 30) + 20;
  
  for (let i = 0; i < 180; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Create some seasonality and trends
    const dayOfWeek = currentDate.getDay();
    const weekMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.2;
    const trendFactor = 1 + (i * 0.001); // Small upward trend
    
    // Add some randomness
    const randomFactor = 0.7 + Math.random() * 0.6;
    
    const quantity = Math.round(baseQuantity * weekMultiplier * trendFactor * randomFactor);
    
    // Only include every 7th day to avoid too many data points
    if (i % 7 === 0) {
      data.push({
        date: currentDate.toISOString().split('T')[0],
        actual: quantity,
        forecast: quantity
      });
    }
  }
  
  return data;
};

export const getSummaryMetrics = () => {
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock <= p.reorderPoint).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const averageDemand = Math.floor(Math.random() * 200) + 300;
  
  return {
    totalProducts,
    lowStockItems,
    totalInventoryValue,
    averageDemand
  };
};
