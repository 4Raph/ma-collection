
import type { Attack } from "../types/Attaque";

interface AttackDetailsProps {
  attack: Attack;
  onClose: () => void;
}

function AttackDetails({ attack, onClose }: AttackDetailsProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        className="attack-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <span className="category-badge">
            {attack.categorie}
          </span>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer les détails"
          >
            ✕
          </button>
        </div>

        {attack.image_url && (
          <div className="modal-image">
            <img src={attack.image_url} alt="" />
          </div>
        )}

        <div className="eyebrow">
          FICHE ATTAQUE #{attack.id}
        </div>

        <h2 id="modal-title">{attack.titre}</h2>

        <p className="modal-description">
          {attack.description}
        </p>

        <div className="modal-details">
          <div>
            <span className="detail-label">ANNÉE</span>
            <strong>{attack.annee}</strong>
          </div>

          <div>
            <span className="detail-label">TYPE</span>
            <strong>{attack.type}</strong>
          </div>

          <div>
            <span className="detail-label">NIVEAU</span>
            <strong className="level-badge">{attack.niveau}</strong>
          </div>
        </div>

        <button
          className="primary-button modal-action"
          onClick={onClose}
        >
          Fermer la fiche <span>✕</span>
        </button>
      </section>
    </div>
  );
}

export default AttackDetails;