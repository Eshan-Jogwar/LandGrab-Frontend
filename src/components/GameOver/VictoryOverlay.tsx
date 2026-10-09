import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { Trophy, RotateCcw } from 'lucide-react';

export const VictoryOverlay: React.FC = () => {
  const gameOver = useGameStore((s) => s.gameOverData);
  const myPlayerID = useGameStore((s) => s.myPlayerID);
  const resetGame = useGameStore((s) => s.resetGame);

  if (!gameOver) return null;

  const isMeWinner = gameOver.winner_id === myPlayerID;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl" />

        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
          <Trophy className="w-10 h-10 text-slate-950" />
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
          {isMeWinner ? 'VICTORY!' : 'GAME OVER'}
        </h2>

        <p className="text-slate-300 font-medium mt-2">
          {isMeWinner
            ? 'Congratulations! You bankrupted all opponents and won LandGrab!'
            : `Player ${gameOver.winner_id} emerged victorious as the sole solvent tycoon.`}
        </p>

        <button
          onClick={resetGame}
          className="mt-8 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>RETURN TO LOBBY</span>
        </button>
      </div>
    </div>
  );
};
