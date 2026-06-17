import type { Rating } from "../data/types";

type RatingCardProps = {
  rating: Rating;
};

export function RatingCard({ rating }: RatingCardProps) {
  return (
    <article className="rating-card">
      <div className="rating-card__vote">
        <span>{rating.vote}</span>
        <small>voto</small>
      </div>

      <div className="rating-card__content">
        <p className="rating-card__team">{rating.teamName}</p>
        <h3>{rating.coachName}</h3>
        <h4>{rating.title}</h4>
        <p>{rating.comment}</p>

        <div className="rating-card__award">
          Premio speciale: <strong>{rating.award}</strong>
        </div>
      </div>
    </article>
  );
}