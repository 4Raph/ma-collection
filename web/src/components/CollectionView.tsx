
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import type { Attack } from "../types/Attaque";

export type CollectionStatus = "a_decouvrir" | "en_cours" | "termine";
type CollectionFilter = "tous" | CollectionStatus;

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
  termine: "Terminée",
};

function CollectionView({ token }: CollectionViewProps) {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [filter, setFilter] = useState<CollectionFilter>("tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

  const filteredEntries = useMemo(() => {
    if (filter === "tous") return entries;
    return entries.filter((entry) => entry.statut === filter);
  }, [entries, filter]);

  async function updateStatus(
    entryId: number,
    statut: CollectionStatus
  ) {
    setActionLoading(entryId);
    setError("");

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
    } finally {
      setActionLoading(null);
    }
  }

  async function removeEntry(entryId: number) {
    if (!window.confirm("Retirer cette attaque de ta collection ?")) {
      return;
    }

    setActionLoading(entryId);
    setError("");

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
    } finally {
      setActionLoading(null);
    }
  }

  if (loading && entries.length === 0) {
    return (
      <main className="collection-page">
        <p className="message">Chargement de ta collection...</p>
      </main>
    );
  }

  return (
    <main className="collection-page">
      <section className="collection-hero">
        <div className="eyebrow">ESPACE PERSONNEL</div>
        <h1>Ma collection</h1>
        <p>
          Retrouve les attaques que tu as enregistrées et suis ta progression
          dans ta découverte de la cybersécurité.
        </p>

        <button
          className="login-button"
          onClick={() => void loadCollection()}
          disabled={loading}
        >
          {loading ? "Actualisation..." : "Actualiser"}
        </button>
      </section>

      {stats && (
        <section className="collection-stats">
          <article className="stat-card">
            <span className="detail-label">TOTAL</span>
            <strong>{stats.total}</strong>
            <span>attaques enregistrées</span>
          </article>

          <article className="stat-card">
            <span className="detail-label">À DÉCOUVRIR</span>
            <strong>{stats.par_statut?.a_decouvrir ?? 0}</strong>
            <span>à explorer</span>
          </article>

          <article className="stat-card">
            <span className="detail-label">EN COURS</span>
            <strong>{stats.par_statut?.en_cours ?? 0}</strong>
            <span>en apprentissage</span>
          </article>

          <article className="stat-card">
            <span className="detail-label">TERMINÉES</span>
            <strong>{stats.par_statut?.termine ?? 0}</strong>
            <span>déjà découvertes</span>
          </article>
        </section>
      )}

      {stats && stats.note_moyenne !== null && (
        <p className="collection-average">
          Note moyenne : <strong>{stats.note_moyenne}/10</strong>
        </p>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <section className="collection-content">
        <div className="section-heading">
          <div>
            <div className="eyebrow">TES ÉLÉMENTS</div>
            <h2>Mes attaques</h2>
          </div>

          <label className="collection-filter">
            <span>Filtrer :</span>
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as CollectionFilter)
              }
            >
              <option value="tous">Toutes</option>
              <option value="a_decouvrir">À découvrir</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminées</option>
            </select>
          </label>
        </div>

        {!error && entries.length === 0 && (
          <div className="collection-empty">
            <div className="collection-empty-icon">⌕</div>
            <h3>Ta collection est vide</h3>
            <p>
              Parcours le catalogue et ajoute tes premières attaques pour
              commencer ta collection.
            </p>
          </div>
        )}

        {entries.length > 0 && filteredEntries.length === 0 && (
          <div className="collection-empty">
            <h3>Aucune attaque dans cette catégorie</h3>
            <p>Choisis un autre filtre pour voir tes autres attaques.</p>
          </div>
        )}

        <div className="collection-list">
          {filteredEntries.map((entry) => (
            <article className="collection-entry" key={entry.id}>
              {entry.item.image_url ? (
                <img
                  className="collection-entry-image"
                  src={entry.item.image_url}
                  alt={entry.item.titre}
                  loading="lazy"
                />
              ) : (
                <div className="collection-entry-placeholder">
                  <span>CYBER</span>
                </div>
              )}

              <div className="collection-entry-info">
                <span className="category-badge">
                  {entry.item.categorie}
                </span>

                <h3>{entry.item.titre}</h3>
                <p>{entry.item.description}</p>

                <div className="collection-entry-meta">
                  <span>Année : {entry.item.annee}</span>
                  <span>Niveau : {entry.item.niveau}</span>
                  <span>Type : {entry.item.type}</span>
                </div>

                {entry.note !== null && (
                  <p className="collection-note">
                    Note : <strong>{entry.note}/10</strong>
                  </p>
                )}

                {entry.commentaire && (
                  <p className="collection-comment">
                    {entry.commentaire}
                  </p>
                )}
              </div>

              <div className="collection-entry-actions">
                <label>
                  <span className="detail-label">PROGRESSION</span>
                  <select
                    value={entry.statut}
                    disabled={actionLoading === entry.id}
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
                  disabled={actionLoading === entry.id}
                  onClick={() => void removeEntry(entry.id)}
                >
                  {actionLoading === entry.id ? "Patiente..." : "Retirer"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CollectionView;