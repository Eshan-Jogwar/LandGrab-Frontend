export interface ClientMessage {
  type: string;
  tile_id?: number;
  to_player_id?: number;
  cash?: number;
}

export interface ServerMessage<T = any> {
  type: string;
  payload?: T;
  error?: string;
}

export interface ConnectedPayload {
  temp_id: string;
}

export interface QueuedPayload {
  temp_id: string;
  position: number;
  total_queued: number;
  required_size: number;
}

export interface PlayerInfoSummary {
  id: number;
  temp_id: string;
}

export interface GameStartPayload {
  game_id: string;
  assigned_id: number;
  temp_id: string;
  total_players: number;
  starting_money: number;
  players: PlayerInfoSummary[];
}

export interface PropertySnapshot {
  tile_id: number;
  tile_name: string;
  is_mortgaged: boolean;
  houses: number;
  has_hotel: boolean;
}

export interface PlayerSnapshot {
  id: number;
  temp_id: string;
  balance: number;
  position: number;
  in_jail: boolean;
  is_bankrupt: boolean;
  properties: PropertySnapshot[];
}

export interface GameStatePayload {
  game_id: string;
  current_player_id: number;
  phase: string;
  dice_roll: [number, number];
  consecutive_doubles: number;
  can_roll_again: boolean;
  pending_decision?: string;
  decision_target_tile?: number;
  players: PlayerSnapshot[];
}

export interface YourTurnPayload {
  current_player_id: number;
  phase: string;
  pending_decision?: string;
  timeout_seconds: number;
}

export interface ActionResultPayload {
  action: string;
  success: boolean;
  message?: string;
}

export interface GameOverPayload {
  game_id: string;
  winner_id: number;
  winner_temp_id: string;
}

export interface ServerStatus {
  status: string;
  uptime_seconds: number;
  queue: {
    players_waiting: number;
  };
  active_sessions: {
    total_games: number;
  };
}
