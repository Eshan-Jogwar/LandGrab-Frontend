import React from 'react';
import { getTileCoordinates } from '../../utils/boardLayout';

interface TokenRendererProps {
  id: number;
  position: number;
  color: string;
  name: string;
  inJail?: boolean;
}

export const TokenRenderer: React.FC<TokenRendererProps> = ({
  id,
  position,
  color,
  inJail,
}) => {
  const coords = getTileCoordinates(position);

  // Offset multiple tokens on the same tile so they don't completely overlap
  const offsets: Record<number, { dx: number; dy: number }> = {
    1: { dx: -12, dy: -12 },
    2: { dx: 12, dy: -12 },
    3: { dx: -12, dy: 12 },
    4: { dx: 12, dy: 12 },
  };

  const offset = offsets[id] || { dx: 0, dy: 0 };
  const left = coords.centerX + offset.dx;
  const top = coords.centerY + offset.dy;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 40,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className="pointer-events-none flex flex-col items-center"
    >
      {/* 3D Pawn Shape */}
      <div
        style={{
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}80, 0 4px 6px -1px rgba(0, 0, 0, 0.5)`,
        }}
        className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-black select-none relative"
      >
        P{id}
        {inJail && (
          <span className="absolute -top-1 -right-1 bg-neutral-900 border border-red-500 text-[8px] rounded px-0.5 text-red-400">
            J
          </span>
        )}
      </div>
      {/* Drop Shadow */}
      <div className="w-5 h-1.5 bg-black/50 rounded-full blur-[1px] mt-0.5" />
    </div>
  );
};
