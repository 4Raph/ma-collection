
interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

function SearchBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: SearchBarProps) {
  return (
    <div className="filters">
      <div className="search-box">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Rechercher une attaque..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <kbd>CTRL K</kbd>
      </div>

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filtrer par catégorie"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;