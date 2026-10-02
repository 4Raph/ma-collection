import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import AttackCard from "./components/AttaqueCard";
import AttackDetails from "./components/AttaqueDetails";
import AuthForm from "./components/AuthForm";
import CollectionView from "./components/CollectionView";

import { apiRequest } from "./services/api";
import type { Attack, ItemResponse } from "./types/Attaque";

function App() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  const [email, setEmail] = useState(
    localStorage.getItem("user_email") ?? ""
  );

  const [showAuth, setShowAuth] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttacks() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest<ItemResponse>(
          "/items?page=1&limit=50"
        );

        setAttacks(data.results);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les attaques."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttacks();
  }, []);

  // Filtre
  const filteredAttacks = attacks.filter((attack) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      attack.titre.toLowerCase().includes(searchLower) ||
      attack.description.toLowerCase().includes(searchLower);

    const matchesCategory =
      category === "Toutes" || attack.categorie === category;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Toutes",
    ...Array.from(new Set(attacks.map((attack) => attack.categorie))),
  ];

  // Connexion ou inscription réussie
  function handleAuth(newToken: string, newEmail: string) {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_email", newEmail);

    setToken(newToken);
    setEmail(newEmail);
    setShowAuth(false);
  }

  // Déconnexion
  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");

    setToken(null);
    setEmail("");
    setShowCollection(false);
  }

  // Afficher le catalogue
  function handleShowCatalogue() {
    setShowCollection(false);
  }

  // Afficher la collection personnelle
  function handleShowCollection() {
    setShowCollection(true);
  }

  // Ajouter une attaque à la collection
  async function addToCollection(attack: Attack) {
    if (!token) {
      setShowAuth(true);
      return;
    }

    try {
      await apiRequest(
        "/me/collection",
        {
          method: "POST",
          body: JSON.stringify({
            item_id: attack.id,
            statut: "a_decouvrir",
          }),
        },
        token
      );

      alert(`"${attack.titre}" a été ajoutée à ta collection !`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter cette attaque.";

      alert(message);
    }
  }

  return (
    <div className="app">
      <Navbar
        isAuthenticated={!!token}
        email={email}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
        onShowCatalogue={handleShowCatalogue}
        onShowCollection={handleShowCollection}
      />

      {showCollection && token ? (
        <CollectionView token={token} />
      ) : (
        <>
          <header className="hero">
            <h1>CyberCollection</h1>
            <p>
              Explore les attaques informatiques, découvre leur fonctionnement
              et construis ta collection personnelle.
            </p>
          </header>

          <main className="catalogue">
            <h2>Catalogue des attaques</h2>

            <SearchBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              categories={categories}
            />

            {loading && <p>Chargement des attaques...</p>}

            {error && (
              <p className="error-message">
                Erreur lors du chargement : {error}
              </p>
            )}

            {!loading && !error && filteredAttacks.length === 0 && (
              <p>Aucune attaque trouvée.</p>
            )}

            {!loading && !error && (
              <div className="attacks-grid">
                {filteredAttacks.map((attack) => (
                  <AttackCard
                    key={attack.id}
                    attack={attack}
                    onDetails={setSelectedAttack}
                    onAdd={addToCollection}
                    isAuthenticated={!!token}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {selectedAttack && (
        <AttackDetails
          attack={selectedAttack}
          onClose={() => setSelectedAttack(null)}
        />
      )}

      {showAuth && (
        <AuthForm
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      <footer className="footer">
        <p>CyberCollection — Projet B2</p>
      </footer>
    </div>
  );
}

export default App;