import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import type { ServerStatus } from '../../state/types';
import { Play, Loader2, Trophy, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

export const LobbyScreen: React.FC = () => {
  const isConnecting = useGameStore((s) => s.isConnecting);
  const isQueued = useGameStore((s) => s.isQueued);
  const queuePos = useGameStore((s) => s.queuePosition);
  const totalQueued = useGameStore((s) => s.totalQueued);
  const connect = useGameStore((s) => s.connect);

  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  useEffect(() => {
    return audioManager.subscribe((muted) => setIsMuted(muted));
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:8080/status');
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Backend might be offline
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-radial from-slate-900 to-slate-950 p-6 relative overflow-hidden select-none">
      {/* Decorative Background Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Audio Mute Button Top Right */}
      <button
        onClick={() => audioManager.toggleMute()}
        className={`absolute top-6 right-6 z-20 p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer flex items-center gap-2 shadow-lg ${
          isMuted
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900/80'
            : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        <span className="text-xs font-bold uppercase tracking-wider">{isMuted ? 'Muted' : 'Audio On'}</span>
      </button>

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center max-w-md w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center">
        {/* Title */}
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
          <Trophy className="w-8 h-8 text-slate-950" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
          LANDGRAB
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
          Multiplayer Monopoly Arena
        </p>

        {/* Live Server Stats */}
        <div className="w-full mt-6 grid grid-cols-2 gap-3">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Queue Waiting</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {status?.queue.players_waiting ?? (isQueued ? totalQueued : 0)} Players
            </span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Live Games</span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              {status?.active_sessions.total_games ?? 0}
            </span>
          </div>
        </div>

        {/* Action Button: Find Match vs Waiting */}
        <div className="w-full mt-8">
          {!isQueued ? (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl shadow-xl hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>CONNECTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>FIND 4-PLAYER MATCH</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-4 bg-slate-800/90 border border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching for Players...</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {queuePos}/4 players ready (Passes every 30s)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
