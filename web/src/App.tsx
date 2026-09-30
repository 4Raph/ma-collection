
import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import AttackCard from "./components/AttaqueCard";
import AttackDetails from "./components/AttaqueDetails";

import type { Attack, ItemResponse } from "./types/Attaque";

function App() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
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
    const searchText = search.toLowerCase();

    const matchesSearch =
      attack.titre.toLowerCase().includes(searchText) ||
      attack.description.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "Toutes" || attack.categorie === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <Navbar />

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

            <span className="floating-tag tag-one">
              SQL INJECTION
            </span>

            <span className="floating-tag tag-two">
              XSS ATTACK
            </span>
          </div>
        </section>

        <section className="catalogue" id="catalogue">
          <div className="section-heading">
            <div>
              <div className="eyebrow">BASE DE CONNAISSANCES</div>
              <h2>Catalogue des attaques</h2>
              <p>
                Explore les techniques et leurs caractéristiques.
              </p>
            </div>

            <div className="total-badge">
              <span>{attacks.length}</span> attaques référencées
            </div>
          </div>

          <SearchBar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
          />

          {loading && (
            <p className="message">Chargement du catalogue...</p>
          )}

          {!loading && error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && !error && filteredAttacks.length === 0 && (
            <p className="message">Aucune attaque trouvée.</p>
          )}

          {!loading && !error && filteredAttacks.length > 0 && (
            <div className="attack-grid">
              {filteredAttacks.map((attack) => (
                <AttackCard
                  key={attack.id}
                  attack={attack}
                  onDetails={setSelectedAttack}
                />
              ))}
            </div>
          )}
        </section>

        {selectedAttack && (
          <AttackDetails
            attack={selectedAttack}
            onClose={() => setSelectedAttack(null)}
          />
        )}

        <footer>
          <a className="brand footer-brand" href="#">
            Cyber<span>Collection</span>
          </a>

          <p>Apprendre. Comprendre. Collectionner.</p>

          <span className="footer-status">
            <span className="status-dot" />
            API CONNECTÉE
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;