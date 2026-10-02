
interface NavbarProps {
  isAuthenticated: boolean;
  email: string;
  onLogin: () => void;
  onLogout: () => void;
  onShowCatalogue: () => void;
  onShowCollection: () => void;
}

function Navbar({
  isAuthenticated,
  email,
  onLogin,
  onLogout,
  onShowCatalogue,
  onShowCollection,
}: NavbarProps) {
  return (
    <header className="navbar">
      <a className="brand" href="#" onClick={onShowCatalogue}>
        <span className="brand-icon">⌘</span>
        Cyber<span>Collection</span>
      </a>

      <nav>
        <button className="nav-link active" onClick={onShowCatalogue}>
          Catalogue
        </button>
        {isAuthenticated && (
          <button className="nav-link" onClick={onShowCollection}>
            Ma collection
          </button>
        )}
      </nav>

      {isAuthenticated ? (
        <div className="user-actions">
          <span className="user-email">{email}</span>
          <button className="login-button" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      ) : (
        <button className="login-button" onClick={onLogin}>
          Connexion
        </button>
      )}
    </header>
  );
}

export default Navbar;