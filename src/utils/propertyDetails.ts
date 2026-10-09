export interface PropertyDetails {
  id: number;
  name: string;
  colorGroup?: string;
  colorHex?: string;
  cost: number;
  rentBase: number;
  rent1House: number;
  rent2House: number;
  rent3House: number;
  rent4House: number;
  rentHotel: number;
  costHouse: number;
  costHotel: number;
  mortgageValue: number;
  demortgageCost: number;
}

export interface RailwayDetails {
  id: number;
  name: string;
  cost: number;
  baseRent: number;
  mortgageValue: number;
  demortgageCost: number;
  rents: number[]; // [25, 50, 100, 200]
}

export interface UtilityDetails {
  id: number;
  name: string;
  cost: number;
  mortgageValue: number;
  demortgageCost: number;
  multiplier1: string; // "4x Dice Roll"
  multiplier2: string; // "10x Dice Roll"
}

export const PROPERTY_CONFIGS: Record<number, PropertyDetails> = {
  1: {
    id: 1, name: 'Old Harbor Road', colorGroup: 'Brown', colorHex: '#8B4513',
    cost: 60, rentBase: 2, rent1House: 10, rent2House: 30, rent3House: 90, rent4House: 160, rentHotel: 250,
    costHouse: 50, costHotel: 50, mortgageValue: 30, demortgageCost: 33,
  },
  3: {
    id: 3, name: "Fisherman's Wharf", colorGroup: 'Brown', colorHex: '#8B4513',
    cost: 60, rentBase: 4, rent1House: 20, rent2House: 60, rent3House: 180, rent4House: 320, rentHotel: 450,
    costHouse: 50, costHotel: 50, mortgageValue: 30, demortgageCost: 33,
  },
  6: {
    id: 6, name: 'Crescent Way', colorGroup: 'LightBlue', colorHex: '#87CEEB',
    cost: 100, rentBase: 6, rent1House: 30, rent2House: 90, rent3House: 270, rent4House: 400, rentHotel: 550,
    costHouse: 50, costHotel: 50, mortgageValue: 50, demortgageCost: 55,
  },
  8: {
    id: 8, name: 'Beacon Street', colorGroup: 'LightBlue', colorHex: '#87CEEB',
    cost: 100, rentBase: 6, rent1House: 30, rent2House: 90, rent3House: 270, rent4House: 400, rentHotel: 550,
    costHouse: 50, costHotel: 50, mortgageValue: 50, demortgageCost: 55,
  },
  9: {
    id: 9, name: 'Skyline Boulevard', colorGroup: 'LightBlue', colorHex: '#87CEEB',
    cost: 120, rentBase: 8, rent1House: 40, rent2House: 100, rent3House: 300, rent4House: 450, rentHotel: 600,
    costHouse: 50, costHotel: 50, mortgageValue: 60, demortgageCost: 66,
  },
  11: {
    id: 11, name: 'Grand Avenue', colorGroup: 'Pink', colorHex: '#FF69B4',
    cost: 140, rentBase: 10, rent1House: 50, rent2House: 150, rent3House: 450, rent4House: 625, rentHotel: 750,
    costHouse: 100, costHotel: 100, mortgageValue: 70, demortgageCost: 77,
  },
  13: {
    id: 13, name: 'Highland Park', colorGroup: 'Pink', colorHex: '#FF69B4',
    cost: 140, rentBase: 10, rent1House: 50, rent2House: 150, rent3House: 450, rent4House: 625, rentHotel: 750,
    costHouse: 100, costHotel: 100, mortgageValue: 70, demortgageCost: 77,
  },
  14: {
    id: 14, name: 'Lakeview Drive', colorGroup: 'Pink', colorHex: '#FF69B4',
    cost: 160, rentBase: 12, rent1House: 60, rent2House: 180, rent3House: 500, rent4House: 700, rentHotel: 900,
    costHouse: 100, costHotel: 100, mortgageValue: 80, demortgageCost: 88,
  },
  16: {
    id: 16, name: 'Market Street', colorGroup: 'Orange', colorHex: '#FFA500',
    cost: 180, rentBase: 14, rent1House: 70, rent2House: 200, rent3House: 550, rent4House: 750, rentHotel: 950,
    costHouse: 100, costHotel: 100, mortgageValue: 90, demortgageCost: 99,
  },
  18: {
    id: 18, name: 'Canal Street', colorGroup: 'Orange', colorHex: '#FFA500',
    cost: 180, rentBase: 14, rent1House: 70, rent2House: 200, rent3House: 550, rent4House: 750, rentHotel: 950,
    costHouse: 100, costHotel: 100, mortgageValue: 90, demortgageCost: 99,
  },
  19: {
    id: 19, name: 'Union Square', colorGroup: 'Orange', colorHex: '#FFA500',
    cost: 200, rentBase: 16, rent1House: 80, rent2House: 220, rent3House: 600, rent4House: 800, rentHotel: 1000,
    costHouse: 100, costHotel: 100, mortgageValue: 100, demortgageCost: 110,
  },
  21: {
    id: 21, name: 'Pioneer Plaza', colorGroup: 'Red', colorHex: '#DC2626',
    cost: 220, rentBase: 18, rent1House: 90, rent2House: 250, rent3House: 700, rent4House: 875, rentHotel: 1050,
    costHouse: 150, costHotel: 150, mortgageValue: 110, demortgageCost: 121,
  },
  23: {
    id: 23, name: 'Heritage Way', colorGroup: 'Red', colorHex: '#DC2626',
    cost: 220, rentBase: 18, rent1House: 90, rent2House: 250, rent3House: 700, rent4House: 875, rentHotel: 1050,
    costHouse: 150, costHotel: 150, mortgageValue: 110, demortgageCost: 121,
  },
  24: {
    id: 24, name: 'Capital Boulevard', colorGroup: 'Red', colorHex: '#DC2626',
    cost: 240, rentBase: 20, rent1House: 100, rent2House: 300, rent3House: 750, rent4House: 925, rentHotel: 1100,
    costHouse: 150, costHotel: 150, mortgageValue: 120, demortgageCost: 132,
  },
  26: {
    id: 26, name: 'Sterling Heights', colorGroup: 'Yellow', colorHex: '#EAB308',
    cost: 260, rentBase: 22, rent1House: 110, rent2House: 330, rent3House: 800, rent4House: 975, rentHotel: 1150,
    costHouse: 150, costHotel: 150, mortgageValue: 130, demortgageCost: 143,
  },
  27: {
    id: 27, name: 'Golden Gate Road', colorGroup: 'Yellow', colorHex: '#EAB308',
    cost: 260, rentBase: 22, rent1House: 110, rent2House: 330, rent3House: 800, rent4House: 975, rentHotel: 1150,
    costHouse: 150, costHotel: 150, mortgageValue: 130, demortgageCost: 143,
  },
  29: {
    id: 29, name: 'Diamond Parkway', colorGroup: 'Yellow', colorHex: '#EAB308',
    cost: 280, rentBase: 24, rent1House: 120, rent2House: 360, rent3House: 850, rent4House: 1025, rentHotel: 1200,
    costHouse: 150, costHotel: 150, mortgageValue: 140, demortgageCost: 154,
  },
  31: {
    id: 31, name: 'Royal Crescent', colorGroup: 'Green', colorHex: '#16A34A',
    cost: 300, rentBase: 26, rent1House: 130, rent2House: 390, rent3House: 900, rent4House: 1100, rentHotel: 1275,
    costHouse: 200, costHotel: 200, mortgageValue: 150, demortgageCost: 165,
  },
  32: {
    id: 32, name: 'Regal Row', colorGroup: 'Green', colorHex: '#16A34A',
    cost: 300, rentBase: 26, rent1House: 130, rent2House: 390, rent3House: 900, rent4House: 1100, rentHotel: 1275,
    costHouse: 200, costHotel: 200, mortgageValue: 150, demortgageCost: 165,
  },
  34: {
    id: 34, name: 'Embassy Gardens', colorGroup: 'Green', colorHex: '#16A34A',
    cost: 320, rentBase: 28, rent1House: 150, rent2House: 450, rent3House: 1000, rent4House: 1200, rentHotel: 1400,
    costHouse: 200, costHotel: 200, mortgageValue: 160, demortgageCost: 176,
  },
  37: {
    id: 37, name: 'Summit Ridge', colorGroup: 'DarkBlue', colorHex: '#1E3A8A',
    cost: 350, rentBase: 35, rent1House: 175, rent2House: 500, rent3House: 1100, rent4House: 1300, rentHotel: 1500,
    costHouse: 200, costHotel: 200, mortgageValue: 175, demortgageCost: 192,
  },
  39: {
    id: 39, name: 'Celestial Heights', colorGroup: 'DarkBlue', colorHex: '#1E3A8A',
    cost: 400, rentBase: 50, rent1House: 200, rent2House: 600, rent3House: 1400, rent4House: 1700, rentHotel: 2000,
    costHouse: 200, costHotel: 200, mortgageValue: 200, demortgageCost: 220,
  },
};

export const RAILWAY_CONFIGS: Record<number, RailwayDetails> = {
  5: { id: 5, name: 'Metro Central Station', cost: 200, baseRent: 25, mortgageValue: 100, demortgageCost: 110, rents: [25, 50, 100, 200] },
  15: { id: 15, name: 'North Shore Line', cost: 200, baseRent: 25, mortgageValue: 100, demortgageCost: 110, rents: [25, 50, 100, 200] },
  25: { id: 25, name: 'Western Express', cost: 200, baseRent: 25, mortgageValue: 100, demortgageCost: 110, rents: [25, 50, 100, 200] },
  35: { id: 35, name: 'South Coast Line', cost: 200, baseRent: 25, mortgageValue: 100, demortgageCost: 110, rents: [25, 50, 100, 200] },
};

export const UTILITY_CONFIGS: Record<number, UtilityDetails> = {
  12: { id: 12, name: 'Power Grid', cost: 150, mortgageValue: 75, demortgageCost: 82, multiplier1: '4x Dice Roll', multiplier2: '10x Dice Roll' },
  28: { id: 28, name: 'Water Works', cost: 150, mortgageValue: 75, demortgageCost: 82, multiplier1: '4x Dice Roll', multiplier2: '10x Dice Roll' },
};
