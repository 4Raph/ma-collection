
import type { Attack } from "../types/Attaque";

interface AttackCardProps {
  attack: Attack;
  onDetails: (attack: Attack) => void;
}

function AttackCard({ attack, onDetails }: AttackCardProps) {
  return (
    <article className="attack-card">
      <div className="card-top">
        <span className="category-badge">
          {attack.categorie}
        </span>
        <span className="card-id">
          #{String(attack.id).padStart(3, "0")}
        </span>
      </div>

      {attack.image_url && (
        <div className="attack-image">
          <img
            src={attack.image_url}
            alt=""
            loading="lazy"
          />
        </div>
      )}

      <h3>{attack.titre}</h3>

      <p className="attack-description">
        {attack.description}
      </p>

      <div className="card-details">
        <div>
          <span className="detail-label">ANNÉE</span>
          <span>{attack.annee}</span>
        </div>

        <div>
          <span className="detail-label">TYPE</span>
          <span>{attack.type}</span>
        </div>

        <div>
          <span className="detail-label">NIVEAU</span>
          <span className="level-badge">{attack.niveau}</span>
        </div>
      </div>

      <button
        className="card-button"
        onClick={() => onDetails(attack)}
      >
        Voir les détails <span>↗</span>
      </button>
    </article>
  );
}

export default AttackCard;