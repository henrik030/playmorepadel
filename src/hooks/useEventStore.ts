import { useCallback } from "react";
import type { GameEvent, Player, Team } from "../types/event";
import { createId } from "../lib/id";
import { generateAmericanoRounds, generateTeamAmericanoRounds } from "../lib/roundGenerator";
import { useLocalStorage } from "./useLocalStorage";

export interface CreateAmericanoEventInput {
  format: "americano";
  playerNames: string[];
  courtCount: number;
}

export interface CreateTeamAmericanoEventInput {
  format: "team_americano";
  teamPlayerNamePairs: [string, string][];
  courtCount: number;
}

export type CreateEventInput = CreateAmericanoEventInput | CreateTeamAmericanoEventInput;

export function useEventStore() {
  const [event, setEvent] = useLocalStorage<GameEvent | null>("padel-event", null);

  const createEvent = useCallback(
    (input: CreateEventInput) => {
      if (input.format === "americano") {
        const players: Player[] = input.playerNames.map((name) => ({ id: createId(), name }));
        const rounds = generateAmericanoRounds(players, input.courtCount);
        const newEvent: GameEvent = {
          id: createId(),
          format: "americano",
          players,
          teams: [],
          courtCount: input.courtCount,
          rounds,
          status: "in_progress",
          createdAt: new Date().toISOString(),
        };
        setEvent(newEvent);
        return newEvent;
      }

      const players: Player[] = [];
      const teams: Team[] = input.teamPlayerNamePairs.map(([nameA, nameB]) => {
        const playerA: Player = { id: createId(), name: nameA };
        const playerB: Player = { id: createId(), name: nameB };
        players.push(playerA, playerB);
        return { id: createId(), playerIds: [playerA.id, playerB.id] };
      });
      const rounds = generateTeamAmericanoRounds(teams, input.courtCount);
      const newEvent: GameEvent = {
        id: createId(),
        format: "team_americano",
        players,
        teams,
        courtCount: input.courtCount,
        rounds,
        status: "in_progress",
        createdAt: new Date().toISOString(),
      };
      setEvent(newEvent);
      return newEvent;
    },
    [setEvent],
  );

  const setMatchScore = useCallback(
    (roundId: string, matchId: string, side: "sideA" | "sideB", score: number | null) => {
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rounds: prev.rounds.map((round) =>
            round.id !== roundId
              ? round
              : {
                  ...round,
                  matches: round.matches.map((match) =>
                    match.id !== matchId ? match : { ...match, [side]: { ...match[side], score } },
                  ),
                },
          ),
        };
      });
    },
    [setEvent],
  );

  const finishEvent = useCallback(() => {
    setEvent((prev) => (prev ? { ...prev, status: "finished" } : prev));
  }, [setEvent]);

  const resetEvent = useCallback(() => {
    setEvent(null);
  }, [setEvent]);

  return { event, createEvent, setMatchScore, finishEvent, resetEvent };
}
