export type Coach = {
  id: number;
  name: string;
  teamName: string;
  nickname: string;
  style: string;
  strength: string;
  weakness: string;
  quote: string;
};

export type Rating = {
  id: number;
  coachName: string;
  teamName: string;
  vote: string;
  title: string;
  comment: string;
  award: string;
};

export type RosterPlayer = {
  role: string;
  name: string;
  club: string;
  cost: number | null;
};

export type TeamRoster = {
  id: string;
  teamName: string;
  residualCredits: number | null;
  players: RosterPlayer[];
  totalCost: number;
  playersByRole: Record<string, number>;
};

export type HonorBoardEntry = {
  id: number;
  season: string;
  winnerTeam: string;
  coachName?: string;
  description?: string;
  points?: number | string;
  position?: number;
  tag?: string;
};

export type AppData = {
  coaches: Coach[];
  ratings: Rating[];
  rosters: TeamRoster[];
  honorBoard: HonorBoardEntry[];
};

export type AppDataConfig = {
  coachesFile: string;
  ratingsFile: string;
  rostersFile: string;
  honorBoardFile: string;
};
