import type { HonorBoardEntry } from "../data/types";

type HonorBoardProps = {
  entries: HonorBoardEntry[];
};

function formatPosition(position?: number) {
  return position ? `${position}°` : null;
}

export function HonorBoard({ entries }: HonorBoardProps) {
  if (!entries.length) {
    return (
      <div className="honor-board honor-board--empty">
        <p>Nessun dato disponibile per l'Albo d'Oro.</p>
      </div>
    );
  }

  return (
    <div className="honor-board">
      {entries.map((entry) => (
        <article key={entry.id} className="honor-board__card">
          <div className="honor-board__top">
            <span className="honor-board__season">{entry.season}</span>

            {entry.tag && <span className="honor-board__tag">{entry.tag}</span>}
          </div>

          <h3>{entry.winnerTeam}</h3>

          {entry.coachName && (
            <p className="honor-board__coach">
              Allenatore: <strong>{entry.coachName}</strong>
            </p>
          )}

          {(entry.position || entry.points) && (
            <div className="honor-board__meta">
              {entry.position && (
                <span>
                  Posizione: <strong>{formatPosition(entry.position)}</strong>
                </span>
              )}

              {entry.points && (
                <span>
                  Punti: <strong>{entry.points}</strong>
                </span>
              )}
            </div>
          )}

          {entry.description && <p>{entry.description}</p>}
        </article>
      ))}
    </div>
  );
}
