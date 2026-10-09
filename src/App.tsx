import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from './state/gameStore';
import { BOARD_SIZE, TILE_DEFINITIONS } from './utils/boardLayout';
import { TileRenderer } from './engine/renderers/TileRenderer';
import { TokenRenderer } from './engine/renderers/TokenRenderer';
import { LightRenderer } from './engine/renderers/LightRenderer';
import { DiceRenderer } from './engine/renderers/DiceRenderer';

// UI Overlays
import { LobbyScreen } from './components/Lobby/LobbyScreen';
import { ActionPanel } from './components/Overlays/ActionPanel';
import { Scoreboard } from './components/Overlays/Scoreboard';
import { TurnTimer } from './components/Overlays/TurnTimer';
import { EventNotificationBox } from './components/Overlays/EventNotificationBox';
import { TileCardModal } from './components/Modals/TileCardModal';
import { VictoryOverlay } from './components/GameOver/VictoryOverlay';
import { ZoomIn, ZoomOut, Maximize2, Volume2, VolumeX, Music } from 'lucide-react';
import { audioManager } from './utils/audioManager';

const PLAYER_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#3B82F6',
  3: '#10B981',
  4: '#F59E0B',
};

export const App: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);

  // Audio mute & BGM state
  const [audioState, setAudioState] = useState({
    isMuted: audioManager.isMuted,
    bgmPlaying: audioManager.isBgmPlaying,
  });

  useEffect(() => {
    return audioManager.subscribe((muted, bgmPlaying) => {
      setAudioState({ isMuted: muted, bgmPlaying });
    });
  }, []);

  // Camera Pan and Zoom state
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    zoom: 0.75,
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraStart = useRef({ x: 0, y: 0 });

  // Reset/Center camera
  const centerCamera = () => {
    setCamera({ x: 0, y: 0, zoom: 0.75 });
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setCamera((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + delta, 0.4), 1.6),
    }));
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    handleZoom(delta);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return; // Left or middle click
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    cameraStart.current = { x: camera.x, y: camera.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setCamera((prev) => ({
      ...prev,
      x: cameraStart.current.x + dx,
      y: cameraStart.current.y + dy,
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // If no match is in progress, display LobbyScreen
  if (!gameState) {
    return <LobbyScreen />;
  }

  // Map tile ownership and property status from gameState
  const tileOwners: Record<number, number> = {};
  const propertySnapshots: Record<number, any> = {};

  for (const player of gameState.players) {
    for (const prop of player.properties) {
      tileOwners[prop.tile_id] = player.id;
      propertySnapshots[prop.tile_id] = prop;
    }
  }

  const activePlayer = gameState.players.find((p) => p.id === gameState.current_player_id);
  const activePos = activePlayer ? activePlayer.position : 0;

  return (
    <div
      className="w-screen h-screen relative overflow-hidden bg-slate-950 select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 2D/3D Board World Viewport */}
      <div
        className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          style={{
            width: `${BOARD_SIZE}px`,
            height: `${BOARD_SIZE}px`,
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom}) rotateX(16deg)`,
            transformOrigin: 'center center',
            transition: isDragging.current ? 'none' : 'transform 0.15s ease-out',
            boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.8), 0 0 100px rgba(15, 23, 42, 0.9)',
          }}
          className="relative rounded-3xl bg-slate-950 border-4 border-slate-700/80"
        >
          {/* Dynamic Spotlight & Ambient Lighting Layer */}
          <LightRenderer activePlayerPos={activePos} width={BOARD_SIZE} height={BOARD_SIZE} />

          {/* Board Center Area */}
          <div className="absolute inset-[130px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-8 border border-slate-800/80 rounded-2xl shadow-inner pointer-events-none">
            {/* Center Logo */}
            <h1 className="text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 drop-shadow-lg">
              LANDGRAB
            </h1>
            <p className="text-sm font-semibold tracking-widest text-slate-400 mt-2 uppercase">
              Classic Monopoly Arena
            </p>

            {/* Current Turn Status Banner */}
            <div className="mt-8 px-8 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl backdrop-blur-md flex items-center gap-8 shadow-xl">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Turn</span>
                <span className="text-lg font-black text-amber-400">
                  Player {gameState.current_player_id}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Phase</span>
                <span className="text-sm font-bold text-emerald-400 uppercase">
                  {gameState.phase.replace('_', ' ')}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Last Roll</span>
                <span className="text-base font-black text-white font-mono">
                  {gameState.dice_roll[0]} + {gameState.dice_roll[1]} ={' '}
                  {gameState.dice_roll[0] + gameState.dice_roll[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Render All 40 Tiles */}
          {TILE_DEFINITIONS.map((tile) => (
            <TileRenderer
              key={tile.id}
              id={tile.id}
              ownerId={tileOwners[tile.id]}
              propertyData={propertySnapshots[tile.id]}
              onClick={() => setSelectedTileId(tile.id)}
            />
          ))}

          {/* Render All 4 Player Pawns */}
          {gameState.players.map((p) => (
            <TokenRenderer
              key={p.id}
              id={p.id}
              position={p.position}
              color={PLAYER_COLORS[p.id] || '#ffffff'}
              name={`Player ${p.id}`}
              inJail={p.in_jail}
            />
          ))}
        </div>
      </div>

      {/* Camera Navigation Control Bar */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-700 mx-0.5" />
        <button
          onClick={centerCamera}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          title="Center Board"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-700 mx-0.5" />
        <button
          onClick={() => audioManager.toggleMute()}
          className={`p-2 rounded-lg transition cursor-pointer ${
            audioState.isMuted
              ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={audioState.isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {audioState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={() => audioManager.toggleBgm()}
          className={`p-2 rounded-lg transition cursor-pointer ${
            !audioState.bgmPlaying || audioState.isMuted
              ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
          }`}
          title={audioState.bgmPlaying ? 'Pause Music' : 'Play Music'}
        >
          <Music className="w-4 h-4" />
        </button>
      </div>

      {/* Floating 3D Dice Display */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900/90 border border-slate-700/80 px-5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
        <DiceRenderer
          die1={gameState.dice_roll[0]}
          die2={gameState.dice_roll[1]}
          rolling={gameState.phase === 'ready_to_roll'}
        />
      </div>

      {/* UI Overlays */}
      <Scoreboard />
      <TurnTimer />
      <ActionPanel />
      <EventNotificationBox />
      <VictoryOverlay />

      {/* Title Deed Card Modal */}
      {selectedTileId !== null && (
        <TileCardModal
          tileId={selectedTileId}
          ownerId={tileOwners[selectedTileId]}
          propertyData={propertySnapshots[selectedTileId]}
          onClose={() => setSelectedTileId(null)}
        />
      )}
    </div>
  );
};

export default App;
