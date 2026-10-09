import React from 'react';
import { useGameStore } from '../../state/gameStore';

const PLAYER_THEMES: Record<number, { bg: string; border: string; name: string }> = {
  1: { bg: 'bg-red-950/40', border: 'border-red-500/50', name: 'Player 1' },
  2: { bg: 'bg-blue-950/40', border: 'border-blue-500/50', name: 'Player 2' },
  3: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/50', name: 'Player 3' },
  4: { bg: 'bg-amber-950/40', border: 'border-amber-500/50', name: 'Player 4' },
};

export const Scoreboard: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const myPlayerID = useGameStore((s) => s.myPlayerID);

  if (!gameState) return null;

  return (
    <div className="absolute top-6 left-6 z-50 flex flex-col gap-2.5 pointer-events-auto">
      {gameState.players.map((p) => {
        const isCurrent = gameState.current_player_id === p.id;
        const isMe = myPlayerID === p.id;
        const theme = PLAYER_THEMES[p.id] || { bg: 'bg-slate-900', border: 'border-slate-700', name: `P${p.id}` };

        return (
          <div
            key={p.id}
            className={`w-64 px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${theme.bg} ${
              isCurrent ? 'ring-2 ring-amber-400 shadow-lg scale-102' : theme.border
            } ${p.is_bankrupt ? 'opacity-40 grayscale' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">
                  {theme.name} {isMe && <span className="text-xs text-amber-400 font-normal">(You)</span>}
                </span>
                {p.in_jail && (
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/40">
                    JAIL
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">Pos: #{p.position}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${p.balance}
              </span>
              <span className="text-xs text-slate-400">
                {p.properties.length} {p.properties.length === 1 ? 'Property' : 'Properties'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
