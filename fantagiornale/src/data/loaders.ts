import * as XLSX from "xlsx";

import type {
  AppData,
  AppDataConfig,
  Coach,
  HonorBoardEntry,
  Rating,
  RosterPlayer,
  TeamRoster
} from "./types";

const DATA_BASE_URL = `${import.meta.env.BASE_URL}data/`;

function resolveDataUrl(fileNameOrUrl: string) {
  if (/^https?:\/\//i.test(fileNameOrUrl) || fileNameOrUrl.startsWith("/")) {
    return fileNameOrUrl;
  }

  return `${DATA_BASE_URL}${fileNameOrUrl}`;
}

async function fetchJson<T>(fileNameOrUrl: string): Promise<T> {
  const response = await fetch(resolveDataUrl(fileNameOrUrl), {
    cache: "no-cache"
  });

  if (!response.ok) {
    throw new Error(`Impossibile caricare ${fileNameOrUrl}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function cell(row: unknown[] | undefined, index: number) {
  const value = row?.[index];
  return value === undefined || value === null ? "" : String(value).trim();
}

function parseNumber(value: string) {
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getPlayersByRole(players: RosterPlayer[]) {
  return players.reduce<Record<string, number>>((acc, player) => {
    acc[player.role] = (acc[player.role] ?? 0) + 1;
    return acc;
  }, {});
}

function parseRosterBlock(
  rows: unknown[][],
  teamRowIndex: number,
  startColumn: number
): TeamRoster | null {
  const teamName = cell(rows[teamRowIndex], startColumn);
  const headerRowIndex = teamRowIndex + 1;

  if (
    !teamName ||
    cell(rows[headerRowIndex], startColumn).toLowerCase() !== "ruolo" ||
    cell(rows[headerRowIndex], startColumn + 1).toLowerCase() !== "calciatore"
  ) {
    return null;
  }

  const players: RosterPlayer[] = [];
  let residualCredits: number | null = null;

  for (let rowIndex = headerRowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const role = cell(rows[rowIndex], startColumn);
    const name = cell(rows[rowIndex], startColumn + 1);
    const club = cell(rows[rowIndex], startColumn + 2);
    const costValue = cell(rows[rowIndex], startColumn + 3);

    if (!role && !name && !club && !costValue) {
      break;
    }

    if (/crediti\s+residui/i.test(role)) {
      residualCredits = parseNumber(role);
      break;
    }

    if (role && name) {
      players.push({
        role,
        name,
        club,
        cost: parseNumber(costValue)
      });
    }
  }

  return {
    id: slugify(teamName),
    teamName,
    residualCredits,
    players,
    totalCost: players.reduce((sum, player) => sum + (player.cost ?? 0), 0),
    playersByRole: getPlayersByRole(players)
  };
}

export function parseRosterRows(rows: unknown[][]): TeamRoster[] {
  const rosters: TeamRoster[] = [];
  const seen = new Set<string>();
  const maxColumns = Math.max(...rows.map((row) => row.length), 0);

  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < maxColumns - 1; columnIndex += 1) {
      const roster = parseRosterBlock(rows, rowIndex, columnIndex);

      if (roster && !seen.has(`${rowIndex}-${columnIndex}`)) {
        rosters.push(roster);
        seen.add(`${rowIndex}-${columnIndex}`);
      }
    }
  }

  return rosters;
}

export async function loadRostersFromXlsx(fileNameOrUrl: string) {
  const response = await fetch(resolveDataUrl(fileNameOrUrl), {
    cache: "no-cache"
  });

  if (!response.ok) {
    throw new Error(`Impossibile caricare ${fileNameOrUrl}: ${response.status}`);
  }

  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    raw: false
  });

  return parseRosterRows(rows);
}

export async function loadAppData(): Promise<AppData> {
  const config = await fetchJson<AppDataConfig>("app-data.json");

  const [coaches, ratings, rosters, honorBoard] = await Promise.all([
    fetchJson<Coach[]>(config.coachesFile),
    fetchJson<Rating[]>(config.ratingsFile),
    loadRostersFromXlsx(config.rostersFile),
    fetchJson<HonorBoardEntry[]>(config.honorBoardFile)
  ]);

  return {
    coaches,
    ratings,
    rosters,
    honorBoard
  };
}
