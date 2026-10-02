import type { Attack } from "../types/Attaque";

interface AttackDetailsProps {
  attack: Attack;
  onClose: () => void;
}

function AttackDetails({ attack, onClose }: AttackDetailsProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{attack.titre}</h2>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {attack.image_url && (
          <img
            src={attack.image_url}
            alt={attack.titre}
            className="attack-detail-image"
          />
        )}

        <div className="attack-detail-content">
          <p>
            <strong>Catégorie :</strong> {attack.categorie}
          </p>

          <p>
            <strong>Description :</strong> {attack.description}
          </p>

          <p>
            <strong>Année :</strong> {attack.annee}
          </p>

          <p>
            <strong>Type :</strong> {attack.type}
          </p>

          <p>
            <strong>Niveau :</strong> {attack.niveau}
          </p>
        </div>

        <button className="modal-close-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

export default AttackDetails;