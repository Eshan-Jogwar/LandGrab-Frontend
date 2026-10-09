export interface TileDefinition {
  id: number;
  name: string;
  type: 'property' | 'railway' | 'utility' | 'tax' | 'corner' | 'special';
  colorGroup?: string;
  colorHex?: string;
  cost?: number;
}

export const TILE_DEFINITIONS: TileDefinition[] = [
  { id: 0, name: 'Start', type: 'corner' },
  { id: 1, name: 'Old Harbor Road', type: 'property', colorGroup: 'Brown', colorHex: '#8B4513', cost: 60 },
  { id: 2, name: 'Community Fund', type: 'special' },
  { id: 3, name: "Fisherman's Wharf", type: 'property', colorGroup: 'Brown', colorHex: '#8B4513', cost: 60 },
  { id: 4, name: 'Income Tax', type: 'tax', cost: 200 },
  { id: 5, name: 'Metro Central Station', type: 'railway', cost: 200 },
  { id: 6, name: 'Crescent Way', type: 'property', colorGroup: 'LightBlue', colorHex: '#87CEEB', cost: 100 },
  { id: 7, name: 'Fortune', type: 'special' },
  { id: 8, name: 'Beacon Street', type: 'property', colorGroup: 'LightBlue', colorHex: '#87CEEB', cost: 100 },
  { id: 9, name: 'Skyline Boulevard', type: 'property', colorGroup: 'LightBlue', colorHex: '#87CEEB', cost: 120 },
  { id: 10, name: 'Prison / Visiting', type: 'corner' },
  { id: 11, name: 'Grand Avenue', type: 'property', colorGroup: 'Pink', colorHex: '#FF69B4', cost: 140 },
  { id: 12, name: 'Power Grid', type: 'utility', cost: 150 },
  { id: 13, name: 'Highland Park', type: 'property', colorGroup: 'Pink', colorHex: '#FF69B4', cost: 140 },
  { id: 14, name: 'Lakeview Drive', type: 'property', colorGroup: 'Pink', colorHex: '#FF69B4', cost: 160 },
  { id: 15, name: 'North Shore Line', type: 'railway', cost: 200 },
  { id: 16, name: 'Market Street', type: 'property', colorGroup: 'Orange', colorHex: '#FFA500', cost: 180 },
  { id: 17, name: 'Community Fund', type: 'special' },
  { id: 18, name: 'Canal Street', type: 'property', colorGroup: 'Orange', colorHex: '#FFA500', cost: 180 },
  { id: 19, name: 'Union Square', type: 'property', colorGroup: 'Orange', colorHex: '#FFA500', cost: 200 },
  { id: 20, name: 'Free Parking', type: 'corner' },
  { id: 21, name: 'Pioneer Plaza', type: 'property', colorGroup: 'Red', colorHex: '#DC2626', cost: 220 },
  { id: 22, name: 'Fortune', type: 'special' },
  { id: 23, name: 'Heritage Way', type: 'property', colorGroup: 'Red', colorHex: '#DC2626', cost: 220 },
  { id: 24, name: 'Capital Boulevard', type: 'property', colorGroup: 'Red', colorHex: '#DC2626', cost: 240 },
  { id: 25, name: 'Western Express', type: 'railway', cost: 200 },
  { id: 26, name: 'Sterling Heights', type: 'property', colorGroup: 'Yellow', colorHex: '#EAB308', cost: 260 },
  { id: 27, name: 'Golden Gate Road', type: 'property', colorGroup: 'Yellow', colorHex: '#EAB308', cost: 260 },
  { id: 28, name: 'Water Works', type: 'utility', cost: 150 },
  { id: 29, name: 'Diamond Parkway', type: 'property', colorGroup: 'Yellow', colorHex: '#EAB308', cost: 280 },
  { id: 30, name: 'Go To Prison', type: 'corner' },
  { id: 31, name: 'Royal Crescent', type: 'property', colorGroup: 'Green', colorHex: '#16A34A', cost: 300 },
  { id: 32, name: 'Regal Row', type: 'property', colorGroup: 'Green', colorHex: '#16A34A', cost: 300 },
  { id: 33, name: 'Community Fund', type: 'special' },
  { id: 34, name: 'Embassy Gardens', type: 'property', colorGroup: 'Green', colorHex: '#16A34A', cost: 320 },
  { id: 35, name: 'South Coast Line', type: 'railway', cost: 200 },
  { id: 36, name: 'Fortune', type: 'special' },
  { id: 37, name: 'Summit Ridge', type: 'property', colorGroup: 'DarkBlue', colorHex: '#1E3A8A', cost: 350 },
  { id: 38, name: 'Wealth Tax', type: 'tax', cost: 100 },
  { id: 39, name: 'Celestial Heights', type: 'property', colorGroup: 'DarkBlue', colorHex: '#1E3A8A', cost: 400 },
];

export const BOARD_SIZE = 1200; // Board width & height in px
export const CORNER_SIZE = 130; // Corner square width/height in px
export const NORMAL_WIDTH = 104; // Property width in px
export const NORMAL_HEIGHT = 130; // Property depth in px

export interface TileCoords {
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'bottom' | 'left' | 'top' | 'right';
  centerX: number;
  centerY: number;
}

export function getTileCoordinates(tileId: number): TileCoords {
  const normId = ((tileId % 40) + 40) % 40;

  // Bottom edge: Tile 0 (corner) to 9 (moving right to left)
  if (normId === 0) {
    const x = BOARD_SIZE - CORNER_SIZE;
    const y = BOARD_SIZE - CORNER_SIZE;
    return { x, y, width: CORNER_SIZE, height: CORNER_SIZE, orientation: 'bottom', centerX: x + CORNER_SIZE / 2, centerY: y + CORNER_SIZE / 2 };
  }
  if (normId >= 1 && normId <= 9) {
    const x = BOARD_SIZE - CORNER_SIZE - normId * NORMAL_WIDTH;
    const y = BOARD_SIZE - NORMAL_HEIGHT;
    return { x, y, width: NORMAL_WIDTH, height: NORMAL_HEIGHT, orientation: 'bottom', centerX: x + NORMAL_WIDTH / 2, centerY: y + NORMAL_HEIGHT / 2 };
  }

  // Left edge: Tile 10 (corner) to 19 (moving bottom to top)
  if (normId === 10) {
    const x = 0;
    const y = BOARD_SIZE - CORNER_SIZE;
    return { x, y, width: CORNER_SIZE, height: CORNER_SIZE, orientation: 'left', centerX: x + CORNER_SIZE / 2, centerY: y + CORNER_SIZE / 2 };
  }
  if (normId >= 11 && normId <= 19) {
    const step = normId - 10;
    const x = 0;
    const y = BOARD_SIZE - CORNER_SIZE - step * NORMAL_WIDTH;
    return { x, y, width: NORMAL_HEIGHT, height: NORMAL_WIDTH, orientation: 'left', centerX: x + NORMAL_HEIGHT / 2, centerY: y + NORMAL_WIDTH / 2 };
  }

  // Top edge: Tile 20 (corner) to 29 (moving left to right)
  if (normId === 20) {
    return { x: 0, y: 0, width: CORNER_SIZE, height: CORNER_SIZE, orientation: 'top', centerX: CORNER_SIZE / 2, centerY: CORNER_SIZE / 2 };
  }
  if (normId >= 21 && normId <= 29) {
    const step = normId - 20;
    const x = CORNER_SIZE + (step - 1) * NORMAL_WIDTH;
    const y = 0;
    return { x, y, width: NORMAL_WIDTH, height: NORMAL_HEIGHT, orientation: 'top', centerX: x + NORMAL_WIDTH / 2, centerY: y + NORMAL_HEIGHT / 2 };
  }

  // Right edge: Tile 30 (corner) to 39 (moving top to bottom)
  if (normId === 30) {
    const x = BOARD_SIZE - CORNER_SIZE;
    return { x, y: 0, width: CORNER_SIZE, height: CORNER_SIZE, orientation: 'right', centerX: x + CORNER_SIZE / 2, centerY: CORNER_SIZE / 2 };
  }
  const step = normId - 30;
  const x = BOARD_SIZE - NORMAL_HEIGHT;
  const y = CORNER_SIZE + (step - 1) * NORMAL_WIDTH;
  return { x, y, width: NORMAL_HEIGHT, height: NORMAL_WIDTH, orientation: 'right', centerX: x + NORMAL_HEIGHT / 2, centerY: y + NORMAL_WIDTH / 2 };
}
