import type { TeamRoster } from "../data/types";

type TeamRosterCardProps = {
  roster: TeamRoster;
};

const roleOrder = ["P", "D", "C", "A"];

export function TeamRosterCard({ roster }: TeamRosterCardProps) {
  const roleStats = roleOrder
    .filter((role) => roster.playersByRole[role])
    .map((role) => `${role}: ${roster.playersByRole[role]}`)
    .join(" · ");

  return (
    <article className="roster-card">
      <header className="roster-card__header">
        <div>
          <p>Rosa</p>
          <h3>{roster.teamName}</h3>
        </div>

        <span>{roster.players.length} giocatori</span>
      </header>

      <div className="roster-card__stats">
        <div>
          <small>Spesa</small>
          <strong>{roster.totalCost}</strong>
        </div>

        <div>
          <small>Crediti residui</small>
          <strong>{roster.residualCredits ?? "—"}</strong>
        </div>

        <div>
          <small>Ruoli</small>
          <strong>{roleStats || "—"}</strong>
        </div>
      </div>

      <div className="roster-card__table-wrap">
        <table className="roster-card__table">
          <thead>
            <tr>
              <th>R</th>
              <th>Calciatore</th>
              <th>Squadra</th>
              <th>Costo</th>
            </tr>
          </thead>

          <tbody>
            {roster.players.map((player, index) => (
              <tr key={`${player.role}-${player.name}-${index}`}>
                <td>{player.role}</td>
                <td>{player.name}</td>
                <td>{player.club}</td>
                <td>{player.cost ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
