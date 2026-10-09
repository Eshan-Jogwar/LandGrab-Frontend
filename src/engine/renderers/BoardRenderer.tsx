import React from 'react';
import { BOARD_SIZE, TILE_DEFINITIONS } from '../../utils/boardLayout';
import { TileRenderer } from './TileRenderer';
import { useGameStore } from '../../state/gameStore';

export const BoardRenderer: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);

  // Map tile ownership and property status from gameState
  const tileOwners: Record<number, number> = {};
  const propertySnapshots: Record<number, any> = {};

  if (gameState) {
    for (const player of gameState.players) {
      for (const prop of player.properties) {
        tileOwners[prop.tile_id] = player.id;
        propertySnapshots[prop.tile_id] = prop;
      }
    }
  }

  return (
    <div
      style={{
        width: `${BOARD_SIZE}px`,
        height: `${BOARD_SIZE}px`,
        position: 'relative',
      }}
      className="bg-slate-950 border-4 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden select-none"
    >
      {/* Board Center Area */}
      <div className="absolute inset-[130px] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 border border-slate-800/80 rounded-lg shadow-inner pointer-events-none">
        <h1 className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 drop-shadow-md">
          LANDGRAB
        </h1>
        <p className="text-sm font-semibold tracking-wider text-slate-400 mt-2 uppercase">
          Real-Time Monopoly Engine
        </p>

        {/* Current Turn & Phase Info */}
        {gameState && (
          <div className="mt-8 px-6 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl backdrop-blur-sm flex items-center gap-6">
            <div className="text-center">
              <span className="text-xs text-slate-400 block uppercase">Active Player</span>
              <span className="text-lg font-bold text-amber-400">
                Player {gameState.current_player_id}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block uppercase">Phase</span>
              <span className="text-sm font-semibold text-emerald-400 uppercase">
                {gameState.phase.replace('_', ' ')}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block uppercase">Dice Roll</span>
              <span className="text-base font-bold text-white">
                {gameState.dice_roll[0]} + {gameState.dice_roll[1]} ={' '}
                {gameState.dice_roll[0] + gameState.dice_roll[1]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Render All 40 Tiles */}
      {TILE_DEFINITIONS.map((tile) => (
        <TileRenderer
          key={tile.id}
          id={tile.id}
          ownerId={tileOwners[tile.id]}
          propertyData={propertySnapshots[tile.id]}
        />
      ))}
    </div>
  );
};
