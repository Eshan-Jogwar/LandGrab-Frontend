import type { GameStatePayload } from './types';
import type { GameEventMessage } from './events';
import { TILE_DEFINITIONS } from '../utils/boardLayout';

export function detectGameEvents(
  prevState: GameStatePayload | null,
  currState: GameStatePayload
): GameEventMessage[] {
  if (!prevState) return [];

  const events: GameEventMessage[] = [];
  const now = Date.now();

  const prevPlayers = new Map(prevState.players.map((p) => [p.id, p]));
  const currPlayers = new Map(currState.players.map((p) => [p.id, p]));

  // Check each player's state diff
  for (const currP of currState.players) {
    const prevP = prevPlayers.get(currP.id);
    if (!prevP) continue;

    const deltaMoney = currP.balance - prevP.balance;
    const currTile = TILE_DEFINITIONS[currP.position];

    // 1. Sent to Jail / Incarceration
    if (!prevP.in_jail && currP.in_jail) {
      events.push({
        id: `jail-${currP.id}-${now}`,
        type: 'jail',
        title: 'Sent to Prison',
        description: `Player ${currP.id} was locked up in prison!`,
        playerId: currP.id,
        timestamp: now,
      });
    }

    // 2. Paid Bail
    if (prevP.in_jail && !currP.in_jail && deltaMoney === -50) {
      events.push({
        id: `bail-${currP.id}-${now}`,
        type: 'bail',
        title: 'Paid Bail',
        description: `Player ${currP.id} paid $50 bail to be released from jail.`,
        amount: 50,
        playerId: currP.id,
        timestamp: now,
      });
    }

    // 3. Bankruptcy
    if (!prevP.is_bankrupt && currP.is_bankrupt) {
      events.push({
        id: `bankrupt-${currP.id}-${now}`,
        type: 'bankrupt',
        title: 'Bankrupt!',
        description: `Player ${currP.id} has gone completely bankrupt and is eliminated!`,
        playerId: currP.id,
        timestamp: now,
      });
    }

    // 4. Passed Go (+$200 salary)
    // Position wrapped around 40, or delta is exactly +200 without trading
    if (
      currP.position < prevP.position &&
      prevP.position > 30 &&
      currP.position < 12 &&
      deltaMoney >= 200
    ) {
      events.push({
        id: `go-${currP.id}-${now}`,
        type: 'pass_go',
        title: 'Passed Go',
        description: `Player ${currP.id} passed Start and collected $200 salary!`,
        amount: 200,
        playerId: currP.id,
        timestamp: now,
      });
    }

    // 5. Landed on Tax Tile (Income Tax #4: $200, Wealth Tax #38: $100)
    if (currP.position !== prevP.position) {
      if (currP.position === 4 && deltaMoney === -200) {
        events.push({
          id: `tax-income-${currP.id}-${now}`,
          type: 'tax',
          title: 'Income Tax Paid',
          description: `Player ${currP.id} landed on Income Tax and paid $200 to the bank.`,
          amount: 200,
          playerId: currP.id,
          timestamp: now,
        });
      } else if (currP.position === 38 && deltaMoney === -100) {
        events.push({
          id: `tax-wealth-${currP.id}-${now}`,
          type: 'tax',
          title: 'Wealth Tax Paid',
          description: `Player ${currP.id} landed on Wealth Tax and paid $100 to the bank.`,
          amount: 100,
          playerId: currP.id,
          timestamp: now,
        });
      } else if (currTile.name === 'Fortune') {
        events.push({
          id: `chance-${currP.id}-${now}`,
          type: 'chance',
          title: 'Fortune Card',
          description: `Player ${currP.id} drew a Fortune card!`,
          playerId: currP.id,
          timestamp: now,
        });
      } else if (currTile.name === 'Community Fund') {
        events.push({
          id: `chest-${currP.id}-${now}`,
          type: 'chest',
          title: 'Community Fund',
          description: `Player ${currP.id} drew a Community Fund card!`,
          playerId: currP.id,
          timestamp: now,
        });
      }
    }

    // 6. Property Purchased
    const prevPropIDs = new Set(prevP.properties.map((pr) => pr.tile_id));
    const newlyBought = currP.properties.filter((pr) => !prevPropIDs.has(pr.tile_id));
    for (const bought of newlyBought) {
      events.push({
        id: `buy-${currP.id}-${bought.tile_id}-${now}`,
        type: 'buy',
        title: 'Property Acquired',
        description: `Player ${currP.id} purchased ${bought.tile_name}!`,
        playerId: currP.id,
        timestamp: now,
      });
    }

    // 7. Rent Paid between players
    // If player lost money and landed on an opponent's tile
    if (
      deltaMoney < 0 &&
      currP.position !== prevP.position &&
      currTile.type === 'property' ||
      currTile.type === 'railway' ||
      currTile.type === 'utility'
    ) {
      // Find who owned this tile in prev state
      let recipientId: number | null = null;
      for (const otherP of prevState.players) {
        if (otherP.id !== currP.id) {
          if (otherP.properties.some((pr) => pr.tile_id === currP.position && !pr.is_mortgaged)) {
            recipientId = otherP.id;
            break;
          }
        }
      }

      // Check if recipient gained money
      if (recipientId !== null) {
        const recipient = currPlayers.get(recipientId);
        const prevRecipient = prevPlayers.get(recipientId);
        const rentAmount = Math.abs(deltaMoney);

        if (
          recipient &&
          prevRecipient &&
          recipient.balance > prevRecipient.balance &&
          rentAmount > 0
        ) {
          events.push({
            id: `rent-${currP.id}-${recipientId}-${now}`,
            type: 'rent',
            title: 'Rent Paid',
            description: `Player ${currP.id} paid $${rentAmount} rent to Player ${recipientId} for ${currTile.name}.`,
            amount: rentAmount,
            playerId: currP.id,
            timestamp: now,
          });
        }
      }
    }
  }

  return events;
}
