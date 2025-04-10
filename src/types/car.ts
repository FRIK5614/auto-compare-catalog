
export interface CarImage {
  id: string;
  url: string;
  alt: string;
}

export interface CarPrice {
  base: number;
  withOptions?: number;
  discount?: number;
  special?: number;
}

export interface CarEngine {
  type: string;
  displacement: number;
  power: number;
  torque: number;
  fuelType: string;
}

export interface CarTransmission {
  type: string;
  gears: number;
}

export interface CarDimensions {
  length: number;
  width: number;
  height: number;
  wheelbase: number;
  weight: number;
  trunkVolume: number;
}

export interface CarPerformance {
  acceleration: number; // 0-100 km/h in seconds
  topSpeed: number; // km/h
  fuelConsumption: {
    city: number;
    highway: number;
    combined: number;
  };
}

export interface CarFeature {
  id: string;
  name: string;
  category: string;
  isStandard: boolean;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  bodyType: string;
  colors: string[];
  price: CarPrice;
  engine: CarEngine;
  transmission: CarTransmission;
  drivetrain: string;
  dimensions: CarDimensions;
  performance: CarPerformance;
  features: CarFeature[];
  images: CarImage[];
  description: string;
  isNew: boolean;
  isPopular?: boolean;
  country?: string; // Country field for car origin
  viewCount?: number; // Track number of views
}

export interface CarFilter {
  // Original properties
  brands?: string[];
  models?: string[];
  years?: number[];
  bodyTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  engineTypes?: string[];
  drivetrains?: string[];
  isNew?: boolean;
  countries?: string[]; // Countries filter
  
  // Extended properties for simpler filtering
  brand?: string;         // Single brand filter
  bodyType?: string;      // Single body type filter
  minPrice?: number;      // Min price range
  maxPrice?: number;      // Max price range
  minYear?: number;       // Min year range
  maxYear?: number;       // Max year range
  fuelType?: string;      // Engine fuel type
  transmissionType?: string | string[]; // Transmission type - can be string or string[]
  country?: string;       // Single country filter
  onlyNew?: boolean;      // New cars only flag
  search?: string;        // Search term
  sortBy?: 'popularity' | 'priceAsc' | 'priceDesc' | 'yearDesc' | 'yearAsc' | 'nameAsc' | 'nameDesc'; // Sort option
  limit?: number;         // Limit number of results
  discount?: boolean;     // Flag to filter cars with discounts
}

export interface Order {
  id: string;
  carId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message?: string;
  status: 'new' | 'processing' | 'completed' | 'canceled';
  createdAt: string;
}
