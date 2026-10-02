import type { Attack } from "../types/Attaque";

interface AttackCardProps {
  attack: Attack;
  onDetails: (attack: Attack) => void;
  onAdd: (attack: Attack) => void;
  isAuthenticated: boolean;
}

function AttackCard({
  attack,
  onDetails,
  onAdd,
  isAuthenticated,
}: AttackCardProps) {
  return (
    <article className="attack-card">
      <h3>{attack.titre}</h3>

      <p>{attack.description}</p>

      <p>Catégorie : {attack.categorie}</p>
      <p>Année : {attack.annee}</p>
      <p>Type : {attack.type}</p>
      <p>Niveau : {attack.niveau}</p>

      <button onClick={() => onDetails(attack)}>
        Voir les détails
      </button>

      <button onClick={() => onAdd(attack)}>
        {isAuthenticated
          ? "+ Ajouter à ma collection"
          : "Se connecter pour ajouter"}
      </button>
    </article>
  );
}

export default AttackCard;