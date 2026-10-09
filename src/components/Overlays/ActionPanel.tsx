import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { Dices, ShoppingCart, Ban, ShieldAlert } from 'lucide-react';

export const ActionPanel: React.FC = () => {
  const isMyTurn = useGameStore((s) => s.isMyTurn);
  const gameState = useGameStore((s) => s.gameState);
  const rollDice = useGameStore((s) => s.rollDice);
  const buyProperty = useGameStore((s) => s.buyProperty);
  const declineBuy = useGameStore((s) => s.declineBuy);
  const payBail = useGameStore((s) => s.payBail);
  const myPlayerID = useGameStore((s) => s.myPlayerID);

  if (!gameState) return null;

  const myPlayer = gameState.players.find((p) => p.id === myPlayerID);
  const isReadyToRoll = gameState.phase === 'ready_to_roll' && isMyTurn;
  const isAwaitingBuy =
    gameState.phase === 'awaiting_decision' &&
    gameState.pending_decision === 'buy' &&
    isMyTurn;

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 border border-slate-700/80 px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* Roll Dice Button */}
      {isReadyToRoll && (
        <button
          onClick={rollDice}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Dices className="w-5 h-5" />
          <span>ROLL DICE</span>
        </button>
      )}

      {/* Pay Bail Option if in Jail */}
      {isMyTurn && myPlayer?.in_jail && (
        <button
          onClick={payBail}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pay $50 Bail</span>
        </button>
      )}

      {/* Buy Property or Pass Buttons */}
      {isAwaitingBuy && (
        <>
          <button
            onClick={buyProperty}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>BUY TILE</span>
          </button>
          <button
            onClick={declineBuy}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            <span>PASS</span>
          </button>
        </>
      )}

      {/* Waiting Indicator if not my turn */}
      {!isMyTurn && (
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium px-4 py-1">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Waiting for Player {gameState.current_player_id}'s move...</span>
        </div>
      )}
    </div>
  );
};
