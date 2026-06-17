import type { Coach } from "../data/types";

type CoachCardProps = {
  coach: Coach;
};

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <article className="coach-card">
      <div className="coach-card__header">
        <div>
          <h3>{coach.name}</h3>
          <p>{coach.teamName}</p>
        </div>

        <span>{coach.nickname}</span>
      </div>

      <div className="coach-card__body">
        <p>
          <strong>Stile:</strong> {coach.style}
        </p>

        <p>
          <strong>Pregio:</strong> {coach.strength}
        </p>

        <p>
          <strong>Difetto:</strong> {coach.weakness}
        </p>
      </div>

    </article>
  );
}