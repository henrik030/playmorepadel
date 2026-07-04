import type { GameEvent, PlayerStanding, TeamStanding } from "../types/event";

export function computePlayerStandings(event: GameEvent): PlayerStanding[] {
  const points = new Map<string, number>();
  const matchesPlayed = new Map<string, number>();

  for (const round of event.rounds) {
    for (const match of round.matches) {
      for (const side of [match.sideA, match.sideB]) {
        for (const playerId of side.playerIds) {
          if (side.score !== null) {
            points.set(playerId, (points.get(playerId) ?? 0) + side.score);
            matchesPlayed.set(playerId, (matchesPlayed.get(playerId) ?? 0) + 1);
          } else {
            matchesPlayed.set(playerId, matchesPlayed.get(playerId) ?? 0);
          }
        }
      }
    }
  }

  return event.players
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      points: points.get(player.id) ?? 0,
      matchesPlayed: matchesPlayed.get(player.id) ?? 0,
    }))
    .sort((a, b) => b.points - a.points);
}

export function computeTeamStandings(event: GameEvent): TeamStanding[] {
  const points = new Map<string, number>();
  const matchesPlayed = new Map<string, number>();

  for (const round of event.rounds) {
    for (const match of round.matches) {
      for (const side of [match.sideA, match.sideB]) {
        if (!side.teamId) continue;
        if (side.score !== null) {
          points.set(side.teamId, (points.get(side.teamId) ?? 0) + side.score);
          matchesPlayed.set(side.teamId, (matchesPlayed.get(side.teamId) ?? 0) + 1);
        } else {
          matchesPlayed.set(side.teamId, matchesPlayed.get(side.teamId) ?? 0);
        }
      }
    }
  }

  const playerNameById = new Map(event.players.map((p) => [p.id, p.name]));

  return event.teams
    .map((team) => ({
      teamId: team.id,
      playerNames: team.playerIds.map((id) => playerNameById.get(id) ?? "?"),
      points: points.get(team.id) ?? 0,
      matchesPlayed: matchesPlayed.get(team.id) ?? 0,
    }))
    .sort((a, b) => b.points - a.points);
}
