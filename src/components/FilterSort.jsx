import { FaSearch, FaFilter, FaSortAmountDown, FaTimes } from "react-icons/fa";
import { useState } from "react";
import styles from "./FilterSort.module.css";

// Komponent til filtrering og sortering af produkter
function FilterSort({
  categories,
  category,
  setCategory,
  search,
  setSearch,
  sort,
  setSort,
  resultCount
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Nulstil alle filtre til standard
  const clearFilters = () => {
    setCategory('Alle');
    setSearch('');
    setSort('az');
    setPriceRange({ min: '', max: '' });
  };

  // Tjek om nogen filtre er aktive
  const hasActiveFilters =
    category !== 'Alle' || search || sort !== 'az' || priceRange.min || priceRange.max;

  return (
    <div className={styles.filterContainer}>
      {/* Hovedfilterbar */}
      <div className={styles.mainFilters}>
        {/* Søgning */}
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Søg efter produkter, kategorier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch('')}
              aria-label="Ryd søgning"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Kategorivælger */}
        <div className={styles.filterGroup}>
          <label htmlFor="category-select" className={styles.filterLabel}>
            <FaFilter /> Kategori
          </label>
          <select
            id="category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="Alle">Alle kategorier</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sortering */}
        <div className={styles.filterGroup}>
          <label htmlFor="sort-select" className={styles.filterLabel}>
            <FaSortAmountDown /> Sorter
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            className={styles.select}
          >
            <option value="az">A–Å</option>
            <option value="za">Å–A</option>
            <option value="price-asc">Pris stigende</option>
            <option value="price-desc">Pris faldende</option>
            <option value="rating">Bedste bedømmelse</option>
            <option value="newest">Nyeste først</option>
            <option value="popular">Mest populære</option>
          </select>
        </div>

        {/* Avanceret toggle */}
        <button
          className={`${styles.advancedToggle} ${isAdvancedOpen ? styles.active : ''}`}
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          Avancerede filtre
          <span className={styles.toggleIcon}>
            {isAdvancedOpen ? '−' : '+'}
          </span>
        </button>

        {/* Ryd filtre */}
        {hasActiveFilters && (
          <button className={styles.clearFilters} onClick={clearFilters}>
            <FaTimes />
            Ryd filtre
          </button>
        )}
      </div>

      {/* Resultatoversigt */}
      <div className={styles.resultsSummary}>
        <span className={styles.resultsCount}>
          {resultCount ? `${resultCount} produkter fundet` : 'Indlæser produkter...'}
        </span>

        {/* Aktive filtre vises som mærker */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            {category !== 'Alle' && (
              <span className={styles.filterTag}>
                Kategori: {category}
                <button onClick={() => setCategory('Alle')} aria-label="Fjern kategori filter">
                  <FaTimes />
                </button>
              </span>
            )}
            {search && (
              <span className={styles.filterTag}>
                Søgning: "{search}"
                <button onClick={() => setSearch('')} aria-label="Fjern søgning">
                  <FaTimes />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Avanceret filterpanel */}
      {isAdvancedOpen && (
        <div className={styles.advancedFilters}>
          <div className={styles.advancedGrid}>
            {/* Prisinterval */}
            <div className={styles.filterSection}>
              <h4>Prisinterval</h4>
              <div className={styles.priceRange}>
                <input
                  type="number"
                  placeholder="Min pris"
                  value={priceRange.min}
                  onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className={styles.priceInput}
                />
                <span>til</span>
                <input
                  type="number"
                  placeholder="Maks pris"
                  value={priceRange.max}
                  onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className={styles.priceInput}
                />
                <span>DKK</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterSort;