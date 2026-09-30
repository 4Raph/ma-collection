
import { useEffect, useState } from "react";
import "./App.css";

interface Attack {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  image_url: string;
  annee: number;
  type: string;
  niveau: string;
}

interface ItemResponse {
  total: number;
  page: number;
  limit: number;
  results: Attack[];
}

function App() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAttacks() {
      try {
        const response = await fetch(
          "http://localhost:8000/items?page=1&limit=50"
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer le catalogue.");
        }

        const data: ItemResponse = await response.json();
        setAttacks(data.results);
      } catch {
        setError(
          "Impossible de contacter l'API. Vérifie que FastAPI est démarré."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAttacks();
  }, []);

  const categories = [
    "Toutes",
    ...new Set(attacks.map((attack) => attack.categorie)),
  ];

  const filteredAttacks = attacks.filter((attack) => {
    const matchesSearch =
      attack.titre.toLowerCase().includes(search.toLowerCase()) ||
      attack.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Toutes" || attack.categorie === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">⌘</span>
          Cyber<span>Collection</span>
        </a>

        <nav>
          <a className="nav-link active" href="#catalogue">
            Catalogue
          </a>
          <a className="nav-link" href="#collection">
            Ma collection
          </a>
        </nav>

        <button className="login-button">Connexion</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              CYBERSECURITY DATABASE
            </div>

            <h1>
              Explore les
              <br />
              <span>cyberattaques.</span>
            </h1>

            <p>
              Découvre les attaques informatiques, comprends leur
              fonctionnement et construis ta propre collection.
            </p>

            <a className="primary-button" href="#catalogue">
              Explorer le catalogue <span>↗</span>
            </a>
          </div>

          <div className="hero-decoration" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">
              <span>01</span>
              <strong>CYBER</strong>
              <small>THREAT DATABASE</small>
            </div>
            <span className="floating-tag tag-one">SQL INJECTION</span>
            <span className="floating-tag tag-two">XSS ATTACK</span>
          </div>
        </section>

        <section className="catalogue" id="catalogue">
          <div className="section-heading">
            <div>
              <div className="eyebrow">BASE DE CONNAISSANCES</div>
              <h2>Catalogue des attaques</h2>
              <p>Explore les techniques et leurs caractéristiques.</p>
            </div>

            <div className="total-badge">
              <span>{attacks.length}</span> attaques référencées
            </div>
          </div>

          <div className="filters">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Rechercher une attaque..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>CTRL K</kbd>
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filtrer par catégorie"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading && <p className="message">Chargement du catalogue...</p>}

          {!loading && error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && !error && filteredAttacks.length === 0 && (
            <p className="message">Aucune attaque trouvée.</p>
          )}

          {!loading && !error && (
            <div className="attack-grid">
              {filteredAttacks.map((attack) => (
                <article className="attack-card" key={attack.id}>
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
                    onClick={() =>
                      alert(`Attaque sélectionnée : ${attack.titre}`)
                    }
                  >
                    Voir les détails <span>↗</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          <a className="brand footer-brand" href="#">
            Cyber<span>Collection</span>
          </a>
          <p>Apprendre. Comprendre. Collectionner.</p>
          <span className="footer-status">
            <span className="status-dot" /> API CONNECTÉE
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;