import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../state/gameStore';

export const TurnTimer: React.FC = () => {
  const isMyTurn = useGameStore((s) => s.isMyTurn);
  const turnTimeout = useGameStore((s) => s.turnTimeoutSeconds);
  const [secondsLeft, setSecondsLeft] = useState(turnTimeout);

  useEffect(() => {
    setSecondsLeft(turnTimeout);
    if (!isMyTurn) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isMyTurn, turnTimeout]);

  if (!isMyTurn) return null;

  const progressPct = (secondsLeft / 45) * 100;
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="14" stroke="#334155" strokeWidth="3" fill="none" />
          <circle
            cx="18"
            cy="18"
            r="14"
            stroke={isUrgent ? '#EF4444' : '#F59E0B'}
            strokeWidth="3"
            strokeDasharray="88"
            strokeDashoffset={88 - (88 * progressPct) / 100}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000"
          />
        </svg>
        <span
          className={`absolute text-xs font-black font-mono ${
            isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-200'
          }`}
        >
          {secondsLeft}
        </span>
      </div>
      <div>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Your Turn</span>
        <span className="text-[10px] text-slate-400 block">45s Time Limit</span>
      </div>
    </div>
  );
};
