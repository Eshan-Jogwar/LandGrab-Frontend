import React from 'react';
import {
  PROPERTY_CONFIGS,
  RAILWAY_CONFIGS,
  UTILITY_CONFIGS,
} from '../../utils/propertyDetails';
import type { PropertySnapshot } from '../../state/types';
import { X, Home, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';

interface TileCardModalProps {
  tileId: number;
  ownerId?: number;
  propertyData?: PropertySnapshot;
  onClose: () => void;
}

export const TileCardModal: React.FC<TileCardModalProps> = ({
  tileId,
  ownerId,
  propertyData,
  onClose,
}) => {
  const myPlayerID = useGameStore((s) => s.myPlayerID);
  const isMyTurn = useGameStore((s) => s.isMyTurn);
  const buildHouse = useGameStore((s) => s.buildHouse);
  const sellHouse = useGameStore((s) => s.sellHouse);
  const mortgage = useGameStore((s) => s.mortgage);
  const demortgage = useGameStore((s) => s.demortgage);

  const isMyProperty = ownerId === myPlayerID;

  // Check if street property
  const prop = PROPERTY_CONFIGS[tileId];
  const rail = RAILWAY_CONFIGS[tileId];
  const util = UTILITY_CONFIGS[tileId];

  if (!prop && !rail && !util) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-80 bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col transform transition-all"
      >
        {/* Close Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. STREET PROPERTY CARD */}
        {prop && (
          <div>
            {/* Header Color Banner */}
            <div
              style={{ backgroundColor: prop.colorHex }}
              className="p-5 text-center text-white relative shadow-md"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest block opacity-90">
                Title Deed
              </span>
              <h3 className="text-xl font-black tracking-wide mt-0.5">{prop.name}</h3>
              <span className="text-xs font-semibold opacity-90 mt-1 block">
                Cost: ${prop.cost}
              </span>
            </div>

            {/* Rent Table */}
            <div className="p-5 text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-100 pb-1 border-b border-slate-800">
                <span>Rent Site Only</span>
                <span className="text-emerald-400 font-mono">${prop.rentBase}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>With 1 House</span>
                <span className="text-slate-100 font-mono">${prop.rent1House}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>With 2 Houses</span>
                <span className="text-slate-100 font-mono">${prop.rent2House}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>With 3 Houses</span>
                <span className="text-slate-100 font-mono">${prop.rent3House}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>With 4 Houses</span>
                <span className="text-slate-100 font-mono">${prop.rent4House}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 pt-1 border-t border-slate-800">
                <span className="text-red-400">With HOTEL</span>
                <span className="text-emerald-400 font-mono">${prop.rentHotel}</span>
              </div>

              {/* Building Costs */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Houses cost</span>
                <span className="text-slate-200 font-semibold">${prop.costHouse} each</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Hotels cost</span>
                <span className="text-slate-200 font-semibold">${prop.costHotel} plus 4 houses</span>
              </div>

              {/* Mortgage Values */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex justify-between text-[11px] text-slate-400">
                <span>Mortgage Value</span>
                <span className="text-amber-400 font-mono font-bold">${prop.mortgageValue}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Demortgage (+10%)</span>
                <span className="text-rose-400 font-mono font-bold">${prop.demortgageCost}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. RAILWAY CARD */}
        {rail && (
          <div>
            <div className="bg-slate-800 p-5 text-center text-white relative shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Railway Station
              </span>
              <h3 className="text-xl font-black text-amber-400 mt-0.5">{rail.name}</h3>
              <span className="text-xs font-semibold text-slate-300 mt-1 block">Cost: ${rail.cost}</span>
            </div>
            <div className="p-5 text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Rent with 1 Railway</span>
                <span className="text-slate-100 font-mono">${rail.rents[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Rent with 2 Railways</span>
                <span className="text-slate-100 font-mono">${rail.rents[1]}</span>
              </div>
              <div className="flex justify-between">
                <span>Rent with 3 Railways</span>
                <span className="text-slate-100 font-mono">${rail.rents[2]}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 border-t border-slate-800 pt-1">
                <span>Rent with 4 Railways</span>
                <span className="text-emerald-400 font-mono">${rail.rents[3]}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Mortgage Value</span>
                <span className="text-amber-400 font-mono font-bold">${rail.mortgageValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. UTILITY CARD */}
        {util && (
          <div>
            <div className="bg-slate-800 p-5 text-center text-white relative shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Utility Service
              </span>
              <h3 className="text-xl font-black text-amber-400 mt-0.5">{util.name}</h3>
              <span className="text-xs font-semibold text-slate-300 mt-1 block">Cost: ${util.cost}</span>
            </div>
            <div className="p-5 text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex justify-between">
                <span>If 1 Utility owned</span>
                <span className="text-slate-100 font-semibold">{util.multiplier1}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 border-t border-slate-800 pt-1">
                <span>If 2 Utilities owned</span>
                <span className="text-emerald-400 font-semibold">{util.multiplier2}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Mortgage Value</span>
                <span className="text-amber-400 font-mono font-bold">${util.mortgageValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Ownership Status & In-Game Action Buttons */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Owner:</span>
            {ownerId ? (
              <span
                className={`font-bold ${isMyProperty ? 'text-amber-400' : 'text-slate-200'}`}
              >
                {isMyProperty ? 'You (Player ' + myPlayerID + ')' : `Player ${ownerId}`}
              </span>
            ) : (
              <span className="text-emerald-400 font-bold uppercase text-[11px]">Unowned</span>
            )}
          </div>

          {/* Interactive Property Management if owned by current player */}
          {isMyProperty && (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Property Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Build House */}
                {prop && (
                  <button
                    disabled={!isMyTurn || propertyData?.is_mortgaged}
                    onClick={() => buildHouse(tileId)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>+ House (${prop.costHouse})</span>
                  </button>
                )}

                {/* Sell House */}
                {prop && propertyData && (propertyData.houses > 0 || propertyData.has_hotel) && (
                  <button
                    disabled={!isMyTurn}
                    onClick={() => sellHouse(tileId)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-amber-600/90 hover:bg-amber-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <span>- House (+${prop.costHouse / 2})</span>
                  </button>
                )}

                {/* Mortgage or Demortgage */}
                {!propertyData?.is_mortgaged ? (
                  <button
                    disabled={!isMyTurn || (propertyData && propertyData.houses > 0)}
                    onClick={() => mortgage(tileId)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-rose-600/90 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Mortgage</span>
                  </button>
                ) : (
                  <button
                    disabled={!isMyTurn}
                    onClick={() => demortgage(tileId)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-teal-600/90 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Demortgage</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
