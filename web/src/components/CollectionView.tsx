
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { Attack } from "../types/Attaque";

export type CollectionStatus = "a_decouvrir" | "en_cours" | "termine";

interface CollectionEntry {
  id: number;
  item: Attack;
  statut: CollectionStatus;
  note: number | null;
  commentaire: string | null;
  date_ajout: string;
}

interface CollectionStats {
  total: number;
  par_statut: Record<string, number>;
  note_moyenne: number | null;
}

interface CollectionViewProps {
  token: string;
}

const statusLabels: Record<CollectionStatus, string> = {
  a_decouvrir: "À découvrir",
  en_cours: "En cours",
  termine: "Terminé",
};

function CollectionView({ token }: CollectionViewProps) {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [collection, statistics] = await Promise.all([
        apiRequest<CollectionEntry[]>("/me/collection", {}, token),
        apiRequest<CollectionStats>("/me/stats", {}, token),
      ]);

      setEntries(collection);
      setStats(statistics);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger ta collection."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadCollection();
  }, [loadCollection]);

  async function updateStatus(
    entryId: number,
    statut: CollectionStatus
  ) {
    try {
      await apiRequest(
        `/me/collection/${entryId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ statut }),
        },
        token
      );

      await loadCollection();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Modification impossible."
      );
    }
  }

  async function removeEntry(entryId: number) {
    if (!window.confirm("Retirer cette attaque de ta collection ?")) {
      return;
    }

    try {
      await apiRequest(
        `/me/collection/${entryId}`,
        { method: "DELETE" },
        token
      );

      await loadCollection();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Suppression impossible."
      );
    }
  }

  if (loading) {
    return <p className="message">Chargement de ta collection...</p>;
  }

  return (
    <section className="catalogue" id="collection">
      <div className="section-heading">
        <div>
          <div className="eyebrow">ESPACE PERSONNEL</div>
          <h2>Ma collection</h2>
          <p>Retrouve et organise tes attaques informatiques.</p>
        </div>

        <button className="login-button" onClick={() => void loadCollection()}>
          Actualiser
        </button>
      </div>

      {stats && (
        <div className="collection-stats">
          <div className="stat-card">
            <span className="detail-label">TOTAL</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span className="detail-label">À DÉCOUVRIR</span>
            <strong>{stats.par_statut?.a_decouvrir ?? 0}</strong>
          </div>
          <div className="stat-card">
            <span className="detail-label">EN COURS</span>
            <strong>{stats.par_statut?.en_cours ?? 0}</strong>
          </div>
          <div className="stat-card">
            <span className="detail-label">TERMINÉES</span>
            <strong>{stats.par_statut?.termine ?? 0}</strong>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!error && entries.length === 0 && (
        <div className="message">
          Ta collection est vide. Ajoute des attaques depuis le catalogue !
        </div>
      )}

      <div className="collection-list">
        {entries.map((entry) => (
          <article className="collection-entry" key={entry.id}>
            <div className="collection-entry-info">
              <span className="category-badge">{entry.item.categorie}</span>
              <h3>{entry.item.titre}</h3>
              <p>{entry.item.description}</p>
            </div>

            <div className="collection-entry-actions">
              <label>
                <span className="detail-label">STATUT</span>
                <select
                  value={entry.statut}
                  onChange={(event) =>
                    void updateStatus(
                      entry.id,
                      event.target.value as CollectionStatus
                    )
                  }
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="remove-button"
                onClick={() => void removeEntry(entry.id)}
              >
                Retirer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CollectionView;