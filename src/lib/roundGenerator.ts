import type { Match, MatchSide, Player, Round, Team } from "../types/event";
import { createId } from "./id";

/**
 * Standard circle-method 1-factorization: for n items (n even), produces
 * n-1 rounds, each a perfect matching, such that every pair of items is
 * matched together in exactly one round. `null` entries (padding for odd
 * counts) represent a bye for whoever is paired with them that round.
 */
function circleRoundRobin<T>(itemsInput: T[]): Array<Array<[T | null, T | null]>> {
  const items: (T | null)[] = itemsInput.length % 2 === 0 ? [...itemsInput] : [...itemsInput, null];
  const n = items.length;
  const rounds: Array<Array<[T | null, T | null]>> = [];
  let arr = items;

  for (let r = 0; r < n - 1; r++) {
    const pairs: Array<[T | null, T | null]> = [];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([arr[i], arr[n - 1 - i]]);
    }
    rounds.push(pairs);

    const fixed = arr[0];
    const rest = arr.slice(1);
    arr = [fixed, rest[rest.length - 1], ...rest.slice(0, -1)];
  }

  return rounds;
}

function pairKey(idA: string, idB: string): string {
  return [idA, idB].sort().join("|");
}

function incrementPairCount(counts: Map<string, number>, idA: string, idB: string) {
  const key = pairKey(idA, idB);
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function sharesPlayer(a: [Player, Player], b: [Player, Player]): boolean {
  return a.some((pa) => b.some((pb) => pa.id === pb.id));
}

/**
 * Greedily pairs partnerships into matches, minimizing repeated opponents.
 * Never pairs two partnerships that share a player - that can happen when
 * combining partnerships banked from different rounds (the same player can
 * end up benched more than once, with a different partner each time).
 * Returns the matches, the total "repeat cost" incurred (sum of how often
 * each chosen opponent-pair had already faced each other - used to compare
 * alternative scheduling choices), and any partnerships that couldn't find
 * a valid (disjoint) opponent at all.
 */
function pairPartnershipsIntoMatches(
  partnerships: [Player, Player][],
  opponentCounts: Map<string, number>,
): { matches: [Player, Player][][]; totalCost: number; leftover: [Player, Player][] } {
  const remaining = [...partnerships];
  const matches: [Player, Player][][] = [];
  const leftover: [Player, Player][] = [];
  let totalCost = 0;

  while (remaining.length >= 1) {
    const a = remaining.shift()!;
    let bestIdx = -1;
    let bestScore = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const b = remaining[i];
      if (sharesPlayer(a, b)) continue;

      let score = 0;
      for (const pa of a) {
        for (const pb of b) {
          score += opponentCounts.get(pairKey(pa.id, pb.id)) ?? 0;
        }
      }
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) {
      leftover.push(a);
      continue;
    }

    const b = remaining.splice(bestIdx, 1)[0];
    matches.push([a, b]);
    totalCost += bestScore;
    for (const pa of a) {
      for (const pb of b) {
        incrementPairCount(opponentCounts, pa.id, pb.id);
      }
    }
  }

  return { matches, totalCost, leftover };
}

/**
 * When an odd number of partnerships can't all find an opponent, picks
 * which one to bench. Whoever has been benched least so far gets priority
 * to be benched now - otherwise the same player could end up benched every
 * round, and since all of their banked partnerships would then share that
 * one player, none of them could ever be combined into a bonus match.
 * Among equally-fair options, prefers whichever leaves the remaining
 * partnerships with the least-repeated opponent matchups.
 */
function chooseBenchIndex(
  partnerships: [Player, Player][],
  opponentCounts: Map<string, number>,
  benchedCounts: Map<string, number>,
): number {
  let bestIdx = 0;
  let bestFairness = Infinity;
  let bestCost = Infinity;

  for (let i = 0; i < partnerships.length; i++) {
    const [p1, p2] = partnerships[i];
    const fairness = (benchedCounts.get(p1.id) ?? 0) + (benchedCounts.get(p2.id) ?? 0);
    const candidate = partnerships.filter((_, idx) => idx !== i);
    const { totalCost } = pairPartnershipsIntoMatches(candidate, new Map(opponentCounts));

    if (fairness < bestFairness || (fairness === bestFairness && totalCost < bestCost)) {
      bestFairness = fairness;
      bestCost = totalCost;
      bestIdx = i;
    }
  }

  return bestIdx;
}

function emptySide(playerIds: string[], teamId?: string): MatchSide {
  return { playerIds, teamId, score: null };
}

function buildRounds(
  matchChunks: Array<{ sideAPlayerIds: string[]; sideBPlayerIds: string[]; sideATeamId?: string; sideBTeamId?: string }[]>,
  allPlayerIds: string[],
  courtCount: number,
): Round[] {
  const rounds: Round[] = [];
  let roundIndex = 1;

  for (const logicalRoundMatches of matchChunks) {
    for (let i = 0; i < logicalRoundMatches.length; i += courtCount) {
      const chunk = logicalRoundMatches.slice(i, i + courtCount);
      const matches: Match[] = chunk.map((m, idx) => ({
        id: createId(),
        court: idx + 1,
        sideA: emptySide(m.sideAPlayerIds, m.sideATeamId),
        sideB: emptySide(m.sideBPlayerIds, m.sideBTeamId),
      }));

      const playingIds = new Set(matches.flatMap((m) => [...m.sideA.playerIds, ...m.sideB.playerIds]));
      const sittingOutPlayerIds = allPlayerIds.filter((id) => !playingIds.has(id));

      rounds.push({ id: createId(), index: roundIndex++, matches, sittingOutPlayerIds });
    }
  }

  return rounds;
}

/**
 * Generates Americano rounds so that every player partners with every other
 * player at most once, getting as close to "exactly once" as the player
 * count allows.
 *
 * The partner-rotation schedule (circleRoundRobin) guarantees every pair of
 * players is assigned as partners in exactly one round - that part is always
 * optimal. The only source of waste: if a round's partnerships don't pair up
 * evenly into matches (one partnership left without an opponent), that
 * partnership doesn't have to be lost - it's "banked" and combined with
 * another round's leftover partnership into a bonus match appended at the
 * end. Only if the bank ends up with a single odd one out does exactly one
 * partnership across the whole event never get to play - which is
 * mathematically unavoidable whenever the total number of unique pairs
 * (n * (n-1) / 2) is odd.
 */
export function generateAmericanoRounds(players: Player[], courtCount: number): Round[] {
  if (players.length < 4) return [];

  const partnerRounds = circleRoundRobin(players);
  const opponentCounts = new Map<string, number>();
  const benchedCounts = new Map<string, number>(players.map((p) => [p.id, 0]));
  const bankedPartnerships: [Player, Player][] = [];

  const matchChunks = partnerRounds.map((partnerships) => {
    const realPartnerships: [Player, Player][] = [];
    for (const pair of partnerships) {
      // pair[0]/pair[1] === null only happens for the bye placeholder when
      // the player count is odd - that player simply has no game this round.
      if (pair[0] !== null && pair[1] !== null) {
        realPartnerships.push(pair);
      }
    }

    // Odd number of partnerships this round: one can't find an opponent
    // here. Bank it instead of throwing the partnership away - it'll get
    // matched against another round's leftover later. Pick whichever one
    // to bench so the remaining matchups repeat as few past opponents as
    // possible, while spreading out who gets benched.
    if (realPartnerships.length % 2 === 1) {
      const benchIdx = chooseBenchIndex(realPartnerships, opponentCounts, benchedCounts);
      const [benched] = realPartnerships.splice(benchIdx, 1);
      bankedPartnerships.push(benched);
      for (const p of benched) {
        benchedCounts.set(p.id, (benchedCounts.get(p.id) ?? 0) + 1);
      }
    }

    const { matches: pairedMatches } = pairPartnershipsIntoMatches(realPartnerships, opponentCounts);
    return pairedMatches.map(([sideA, sideB]) => ({
      sideAPlayerIds: sideA.map((p) => p.id),
      sideBPlayerIds: sideB.map((p) => p.id),
    }));
  });

  if (bankedPartnerships.length > 0) {
    const { matches: bonusMatches } = pairPartnershipsIntoMatches(bankedPartnerships, opponentCounts);
    matchChunks.push(
      bonusMatches.map(([sideA, sideB]) => ({
        sideAPlayerIds: sideA.map((p) => p.id),
        sideBPlayerIds: sideB.map((p) => p.id),
      })),
    );
  }

  return buildRounds(matchChunks, players.map((p) => p.id), courtCount);
}

export function generateTeamAmericanoRounds(teams: Team[], courtCount: number): Round[] {
  if (teams.length < 2) return [];

  const teamRounds = circleRoundRobin(teams);
  const matchChunks = teamRounds.map((pairs) =>
    pairs
      .filter((p): p is [Team, Team] => p[0] !== null && p[1] !== null)
      .map(([teamA, teamB]) => ({
        sideAPlayerIds: [...teamA.playerIds],
        sideBPlayerIds: [...teamB.playerIds],
        sideATeamId: teamA.id,
        sideBTeamId: teamB.id,
      })),
  );

  const allPlayerIds = teams.flatMap((t) => t.playerIds);
  return buildRounds(matchChunks, allPlayerIds, courtCount);
}
