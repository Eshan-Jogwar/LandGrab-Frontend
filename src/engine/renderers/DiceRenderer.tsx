import React from 'react';

interface DiceRendererProps {
  die1: number;
  die2: number;
  rolling: boolean;
}

export const DiceRenderer: React.FC<DiceRendererProps> = ({ die1, die2, rolling }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <DiceFace value={die1} rolling={rolling} />
      <DiceFace value={die2} rolling={rolling} />
    </div>
  );
};

const DiceFace: React.FC<{ value: number; rolling: boolean }> = ({ value, rolling }) => {
  // Dot pip positions for standard 6-sided dice
  const pips: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  };

  const currentPips = pips[value] || pips[1];

  return (
    <div
      className={`w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-300 p-2 grid grid-cols-3 grid-rows-3 gap-0.5 items-center justify-items-center transition-transform ${
        rolling ? 'animate-bounce rotate-12 scale-110' : 'scale-100'
      }`}
    >
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 3 }).map((_, c) => {
          const isPip = currentPips.some(([pr, pc]) => pr === r && pc === c);
          return (
            <div
              key={`${r}-${c}`}
              className={`w-2 h-2 rounded-full ${isPip ? 'bg-slate-900 shadow-sm' : 'bg-transparent'}`}
            />
          );
        })
      )}
    </div>
  );
};
