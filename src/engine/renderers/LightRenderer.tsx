import React from 'react';
import { getTileCoordinates } from '../../utils/boardLayout';

interface LightRendererProps {
  activePlayerPos?: number;
  width: number;
  height: number;
}

export const LightRenderer: React.FC<LightRendererProps> = ({
  activePlayerPos = 0,
  width,
  height,
}) => {
  const coords = getTileCoordinates(activePlayerPos);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 35,
      }}
    >
      <svg width={width} height={height} className="w-full h-full">
        <defs>
          {/* Radial spotlight on active player */}
          <radialGradient id="playerSpotlight" cx={coords.centerX} cy={coords.centerY} r="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#fef08a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Mask to illuminate board beneath ambient darkness */}
          <mask id="ambientMask">
            <rect width={width} height={height} fill="#ffffff" />
            <circle cx={coords.centerX} cy={coords.centerY} r="220" fill="#666666" />
          </mask>
        </defs>

        {/* Ambient Darkened Layer */}
        <rect
          width={width}
          height={height}
          fill="rgba(11, 15, 25, 0.35)"
          mask="url(#ambientMask)"
        />

        {/* Active Player Glow Cone */}
        <circle
          cx={coords.centerX}
          cy={coords.centerY}
          r="260"
          fill="url(#playerSpotlight)"
          style={{ mixBlendMode: 'screen' }}
        />
      </svg>
    </div>
  );
};
