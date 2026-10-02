
import { useState } from "react";
import { apiRequest } from "../services/api";

interface AuthFormProps {
  onAuth: (token: string, email: string) => void;
  onClose: () => void;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: number;
  email: string;
}

function AuthForm({ onAuth, onClose }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await apiRequest<UserResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await apiRequest<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      onAuth(data.access_token, email);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <span className="category-badge">ESPACE UTILISATEUR</span>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <h2 id="auth-title">
          {mode === "login" ? "Content de te revoir." : "Créer un compte."}
        </h2>

        <p className="auth-description">
          {mode === "login"
            ? "Connecte-toi pour retrouver ta collection."
            : "Inscris-toi pour créer ta collection personnelle."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Adresse e-mail</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="toi@exemple.fr"
            required
          />

          <label htmlFor="auth-password">Mot de passe</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ton mot de passe"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-button auth-submit" disabled={loading}>
            {loading
              ? "Chargement..."
              : mode === "login"
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </section>
    </div>
  );
}

export default AuthForm;