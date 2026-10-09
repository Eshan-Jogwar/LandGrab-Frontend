import React from 'react';
import { BoardRenderer } from './renderers/BoardRenderer';
import { TokenRenderer } from './renderers/TokenRenderer';
import { LightRenderer } from './renderers/LightRenderer';
import { BOARD_SIZE } from '../utils/boardLayout';

export interface CameraEntity {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  renderer: React.FC<any>;
}

export interface GameEntities {
  camera: CameraEntity;
  board: {
    renderer: React.FC;
  };
  light: {
    activePos: number;
    renderer: React.FC<any>;
  };
  player1: { id: number; position: number; color: string; inJail: boolean; renderer: React.FC<any> };
  player2: { id: number; position: number; color: string; inJail: boolean; renderer: React.FC<any> };
  player3: { id: number; position: number; color: string; inJail: boolean; renderer: React.FC<any> };
  player4: { id: number; position: number; color: string; inJail: boolean; renderer: React.FC<any> };
}

// Camera Viewport Wrapper Renderer
const CameraRenderer: React.FC<{ x: number; y: number; zoom: number; children?: React.ReactNode }> = ({
  x,
  y,
  zoom,
  children,
}) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#090d16',
      }}
    >
      <div
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: 'none',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: `-${BOARD_SIZE / 2}px`,
          marginTop: `-${BOARD_SIZE / 2}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export function createInitialEntities(): GameEntities {
  return {
    camera: {
      x: 0,
      y: 0,
      zoom: 0.85,
      targetX: 0,
      targetY: 0,
      targetZoom: 0.85,
      renderer: CameraRenderer,
    },
    board: {
      renderer: BoardRenderer,
    },
    light: {
      activePos: 0,
      renderer: ({ activePos }: any) => (
        <LightRenderer activePlayerPos={activePos} width={BOARD_SIZE} height={BOARD_SIZE} />
      ),
    },
    player1: {
      id: 1,
      position: 0,
      color: '#EF4444',
      inJail: false,
      renderer: ({ id, position, color, inJail }: any) => (
        <TokenRenderer id={id} position={position} color={color} name="Player 1" inJail={inJail} />
      ),
    },
    player2: {
      id: 2,
      position: 0,
      color: '#3B82F6',
      inJail: false,
      renderer: ({ id, position, color, inJail }: any) => (
        <TokenRenderer id={id} position={position} color={color} name="Player 2" inJail={inJail} />
      ),
    },
    player3: {
      id: 3,
      position: 0,
      color: '#10B981',
      inJail: false,
      renderer: ({ id, position, color, inJail }: any) => (
        <TokenRenderer id={id} position={position} color={color} name="Player 3" inJail={inJail} />
      ),
    },
    player4: {
      id: 4,
      position: 0,
      color: '#F59E0B',
      inJail: false,
      renderer: ({ id, position, color, inJail }: any) => (
        <TokenRenderer id={id} position={position} color={color} name="Player 4" inJail={inJail} />
      ),
    },
  };
}
