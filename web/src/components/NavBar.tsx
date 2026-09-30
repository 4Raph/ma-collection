
function Navbar() {
  return (
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

      <button className="login-button">
        Connexion
      </button>
    </header>
  );
}

export default Navbar;