import React from 'react';
import { getTileCoordinates, TILE_DEFINITIONS } from '../../utils/boardLayout';
import type { PropertySnapshot } from '../../state/types';

interface TileRendererProps {
  id: number;
  ownerId?: number;
  propertyData?: PropertySnapshot;
  isHovered?: boolean;
  onClick?: () => void;
}

const PLAYER_COLORS: Record<number, string> = {
  1: '#EF4444', // Red
  2: '#3B82F6', // Blue
  3: '#10B981', // Green
  4: '#F59E0B', // Amber
};

export const TileRenderer: React.FC<TileRendererProps> = ({
  id,
  ownerId,
  propertyData,
  onClick,
}) => {
  const def = TILE_DEFINITIONS[id];
  const coords = getTileCoordinates(id);

  const ownerColor = ownerId ? PLAYER_COLORS[ownerId] : null;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${coords.width}px`,
        height: `${coords.height}px`,
        boxSizing: 'border-box',
      }}
      className={`border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 transition-colors cursor-pointer select-none overflow-hidden relative flex ${
        coords.orientation === 'left' || coords.orientation === 'right' ? 'flex-row' : 'flex-col'
      } justify-between ${
        propertyData?.is_mortgaged ? 'opacity-60 saturate-50' : ''
      }`}
    >
      {/* Property Color Bar */}
      {def.colorHex && (
        <div
          style={{
            backgroundColor: def.colorHex,
            height: coords.orientation === 'bottom' || coords.orientation === 'top' ? '22px' : '100%',
            width: coords.orientation === 'left' || coords.orientation === 'right' ? '22px' : '100%',
          }}
          className={`flex-shrink-0 flex items-center justify-center font-bold text-[10px] text-white shadow-sm ${
            coords.orientation === 'left' || coords.orientation === 'right' ? 'flex-col gap-0.5 py-1' : 'flex-row gap-0.5 px-1'
          } ${
            coords.orientation === 'bottom' ? 'order-first' : ''
          } ${coords.orientation === 'top' ? 'order-last' : ''} ${
            coords.orientation === 'left' ? 'order-last' : ''
          } ${coords.orientation === 'right' ? 'order-first' : ''}`}
        >
          {/* Houses / Hotel badges */}
          {propertyData?.has_hotel && (
            <span className="bg-red-600 px-1 rounded text-[9px] text-white shadow">H</span>
          )}
          {!propertyData?.has_hotel && propertyData && propertyData.houses > 0 && (
            <div className={`flex ${coords.orientation === 'left' || coords.orientation === 'right' ? 'flex-col' : 'flex-row'} gap-0.5`}>
              {Array.from({ length: propertyData.houses }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block shadow" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tile Center Title & Info */}
      <div className="p-1 flex flex-col items-center justify-center text-center flex-grow overflow-hidden">
        <span className="text-[10px] font-bold text-slate-200 leading-tight line-clamp-2">
          {def.name}
        </span>
        {def.cost && (
          <span className="text-[9px] font-semibold text-emerald-400 mt-0.5">
            ${def.cost}
          </span>
        )}
      </div>

      {/* Owner Badge */}
      {ownerColor && (
        <div
          style={{ backgroundColor: ownerColor }}
          className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] font-black text-white rounded shadow"
        >
          P{ownerId}
        </div>
      )}

      {/* Mortgaged Warning Stamp */}
      {propertyData?.is_mortgaged && (
        <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center transform -rotate-12 pointer-events-none">
          <span className="text-[10px] font-black text-red-400 border border-red-500 px-1 py-0.5 rounded tracking-wider">
            MORTGAGED
          </span>
        </div>
      )}
    </div>
  );
};
