export type EventType =
  | 'tax'
  | 'rent'
  | 'buy'
  | 'pass_go'
  | 'jail'
  | 'bail'
  | 'house'
  | 'mortgage'
  | 'chance'
  | 'chest'
  | 'bankrupt';

export interface GameEventMessage {
  id: string;
  type: EventType;
  title: string;
  description: string;
  amount?: number;
  playerId: number;
  timestamp: number;
}
