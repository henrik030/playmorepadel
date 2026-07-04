export type GameFormat = "americano" | "team_americano";

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  playerIds: [string, string];
}

export interface MatchSide {
  /** Player ids on this side of the match (length 2, doubles). */
  playerIds: string[];
  /** Present for team_americano: the fixed team this side belongs to. */
  teamId?: string;
  score: number | null;
}

export interface Match {
  id: string;
  court: number;
  sideA: MatchSide;
  sideB: MatchSide;
}

export interface Round {
  id: string;
  index: number;
  matches: Match[];
  /** Player ids sitting out this round (rotating bye). */
  sittingOutPlayerIds: string[];
}

export type EventStatus = "setup" | "in_progress" | "finished";

export interface GameEvent {
  id: string;
  format: GameFormat;
  players: Player[];
  teams: Team[];
  courtCount: number;
  rounds: Round[];
  status: EventStatus;
  createdAt: string;
}

export interface PlayerStanding {
  playerId: string;
  name: string;
  points: number;
  matchesPlayed: number;
}

export interface TeamStanding {
  teamId: string;
  playerNames: string[];
  points: number;
  matchesPlayed: number;
}
