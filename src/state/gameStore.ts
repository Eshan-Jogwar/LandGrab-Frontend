import { create } from 'zustand';
import type {
  ClientMessage,
  GameOverPayload,
  GameStartPayload,
  GameStatePayload,
  ServerMessage,
  YourTurnPayload,
} from './types';
import type { GameEventMessage } from './events';
import { detectGameEvents } from './eventDetector';
import { audioManager } from '../utils/audioManager';

export interface GameStore {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  tempID: string;
  gameID: string;
  myPlayerID: number;

  // Lobby & queue
  isQueued: boolean;
  queuePosition: number;
  totalQueued: number;

  // Active game
  gameState: GameStatePayload | null;
  activePlayerID: number;
  isMyTurn: boolean;
  turnTimeoutSeconds: number;
  gameOverData: GameOverPayload | null;
  recentEvents: GameEventMessage[];
  actionLog: string[];

  // WebSocket instance
  socket: WebSocket | null;

  // Actions
  connect: () => void;
  disconnect: () => void;
  dismissEvent: (id: string) => void;
  sendAction: (msg: ClientMessage) => void;
  rollDice: () => void;
  buyProperty: () => void;
  declineBuy: () => void;
  buildHouse: (tileId: number) => void;
  sellHouse: (tileId: number) => void;
  mortgage: (tileId: number) => void;
  demortgage: (tileId: number) => void;
  trade: (toPlayerId: number, tileId: number, cash: number) => void;
  payBail: () => void;
  addLog: (text: string) => void;
  resetGame: () => void;
}

const WS_BASE_URL = window.location.hostname === 'localhost'
  ? 'ws://localhost:8080/ws'
  : `ws://${window.location.host}/ws`;

export const useGameStore = create<GameStore>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  tempID: sessionStorage.getItem('temp_id') || '',
  gameID: sessionStorage.getItem('game_id') || '',
  myPlayerID: 0,

  isQueued: false,
  queuePosition: 0,
  totalQueued: 0,

  gameState: null,
  activePlayerID: 0,
  isMyTurn: false,
  turnTimeoutSeconds: 45,
  gameOverData: null,
  recentEvents: [],
  actionLog: [],

  socket: null,

  connect: () => {
    const { isConnected, isConnecting, socket } = get();
    if (isConnected || isConnecting) return;

    if (socket) {
      socket.close();
    }

    set({ isConnecting: true });

    const savedTemp = sessionStorage.getItem('temp_id');
    const savedGame = sessionStorage.getItem('game_id');

    let url = WS_BASE_URL;
    if (savedTemp && savedGame) {
      url += `?reconnect_id=${savedTemp}&game_id=${savedGame}`;
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      set({ isConnected: true, isConnecting: false, socket: ws });
      get().addLog('Connected to LandGrab server.');
    };

    ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data);
        handleServerMessage(msg, set, get);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      set({ isConnected: false, isConnecting: false, socket: null });
      get().addLog('Disconnected from server.');
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      set({ isConnecting: false });
    };
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
    }
    set({ isConnected: false, isConnecting: false, isQueued: false, socket: null });
  },

  dismissEvent: (id: string) => {
    set((state) => ({
      recentEvents: state.recentEvents.filter((e) => e.id !== id),
    }));
  },

  sendAction: (msg: ClientMessage) => {
    const { socket, isConnected } = get();
    if (!socket || !isConnected) {
      console.warn('Cannot send action, socket is not connected');
      return;
    }
    socket.send(JSON.stringify(msg));
  },

  rollDice: () => {
    audioManager.playDice();
    get().sendAction({ type: 'roll_dice' });
  },
  buyProperty: () => {
    audioManager.playMoney();
    get().sendAction({ type: 'buy_property' });
  },
  declineBuy: () => get().sendAction({ type: 'decline_buy' }),
  buildHouse: (tileId: number) => {
    audioManager.playMoney();
    get().sendAction({ type: 'build_house', tile_id: tileId });
  },
  sellHouse: (tileId: number) => {
    audioManager.playMoney();
    get().sendAction({ type: 'sell_house', tile_id: tileId });
  },
  mortgage: (tileId: number) => {
    audioManager.playMoney();
    get().sendAction({ type: 'mortgage', tile_id: tileId });
  },
  demortgage: (tileId: number) => {
    audioManager.playMoney();
    get().sendAction({ type: 'demortgage', tile_id: tileId });
  },
  trade: (toPlayerId: number, tileId: number, cash: number) => {
    audioManager.playMoney();
    get().sendAction({ type: 'trade', to_player_id: toPlayerId, tile_id: tileId, cash });
  },
  payBail: () => {
    audioManager.playMoney();
    get().sendAction({ type: 'pay_bail' });
  },

  addLog: (text: string) => {
    set((state) => ({
      actionLog: [
        `[${new Date().toLocaleTimeString()}] ${text}`,
        ...state.actionLog.slice(0, 49),
      ],
    }));
  },

  resetGame: () => {
    sessionStorage.removeItem('game_id');
    set({
      gameID: '',
      gameState: null,
      myPlayerID: 0,
      activePlayerID: 0,
      isMyTurn: false,
      gameOverData: null,
      isQueued: false,
    });
  },
}));

function handleServerMessage(
  msg: ServerMessage,
  set: (partial: Partial<GameStore> | ((state: GameStore) => Partial<GameStore>)) => void,
  get: () => GameStore
) {
  const store = get();

  switch (msg.type) {
    case 'connected': {
      const tempId = msg.payload?.temp_id;
      if (tempId) {
        sessionStorage.setItem('temp_id', tempId);
        set({ tempID: tempId });
        store.addLog(`Assigned ID: ${tempId}`);
      }
      break;
    }

    case 'queued': {
      set({
        isQueued: true,
        queuePosition: msg.payload?.position || 1,
        totalQueued: msg.payload?.total_queued || 1,
      });
      store.addLog(`Waiting in queue (${msg.payload?.position}/4 players)...`);
      break;
    }

    case 'game_start': {
      const payload: GameStartPayload = msg.payload;
      sessionStorage.setItem('game_id', payload.game_id);
      set({
        isQueued: false,
        gameID: payload.game_id,
        myPlayerID: payload.assigned_id,
      });
      store.addLog(`Match started! You are Player ${payload.assigned_id}.`);
      audioManager.startBgm();
      break;
    }

    case 'game_state': {
      const state: GameStatePayload = msg.payload;
      const isMyTurn = state.current_player_id === store.myPlayerID;
      const detectedEvents = detectGameEvents(store.gameState, state);

      if (store.gameState) {
        // Dice roll sound
        if (
          state.dice_roll[0] !== store.gameState.dice_roll[0] ||
          state.dice_roll[1] !== store.gameState.dice_roll[1]
        ) {
          audioManager.playDice();
        }

        // Token movement sound
        const moved = state.players.some((p) => {
          const oldP = store.gameState?.players.find((op) => op.id === p.id);
          return oldP && oldP.position !== p.position;
        });
        if (moved) {
          audioManager.playMove();
        }

        // Event-specific sounds
        for (const evt of detectedEvents) {
          if (
            evt.type === 'tax' ||
            evt.type === 'rent' ||
            evt.type === 'buy' ||
            evt.type === 'pass_go' ||
            evt.type === 'bail'
          ) {
            audioManager.playMoney();
          } else if (evt.type === 'chance') {
            audioManager.playChance();
          } else if (evt.type === 'chest') {
            audioManager.playChest();
          }
        }
      }

      set((prev) => ({
        gameState: state,
        activePlayerID: state.current_player_id,
        isMyTurn,
        recentEvents: [...detectedEvents, ...prev.recentEvents].slice(0, 10),
      }));
      break;
    }

    case 'your_turn': {
      const payload: YourTurnPayload = msg.payload;
      set({
        isMyTurn: true,
        turnTimeoutSeconds: payload.timeout_seconds || 45,
      });
      store.addLog(`It's your turn! (${payload.phase})`);
      break;
    }

    case 'action_result': {
      if (msg.payload?.success) {
        store.addLog(`Action '${msg.payload.action}' succeeded.`);
      }
      break;
    }

    case 'error': {
      store.addLog(`Error: ${msg.error}`);
      break;
    }

    case 'player_disconnected': {
      store.addLog(`Player disconnected: ${msg.payload?.temp_id}`);
      break;
    }

    case 'game_over': {
      const gameOver: GameOverPayload = msg.payload;
      set({ gameOverData: gameOver });
      store.addLog(`Game Over! Player ${gameOver.winner_id} won!`);
      break;
    }
  }
}
