// Importerer nødvendige hooks, komponenter og styling
import { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";
import useLocalStorage from "../hooks/useLocalStorage";
import styles from "./Products.module.css";

// Hjælpefunktion: henter unikke kategorier fra produktlisten
function uniqueCategories(products) {
  return Array.from(new Set(products.map(p => p.category)));
}

function Products() {
  // States til produkter, filtrering og sidevisning
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [category, setCategory] = useState("Alle");
  const [page, setPage] = useState(1);

  // Bruger localStorage til kurven
  const [, setCart] = useLocalStorage("cart", []);

  const pageSize = 12; // Hvor mange produkter per side

  // Reference til toppen af produkterne (til scroll)
  const productsTopRef = useRef(null);

  // Henter alle produkter ved første load
  useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      setProducts(data);
    })();
  }, []);

  // Filtrerer, søger og sorterer produkterne
  useEffect(() => {
    let data = products;

    // Filtrer efter kategori (hvis ikke "Alle")
    if (category !== "Alle") {
      data = data.filter((p) => p.category === category);
    }

    // Filtrer efter søgning
    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sortering
    if (sort === "az") data = [...data].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "za") data = [...data].sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "price-asc") data = [...data].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") data = [...data].sort((a, b) => b.price - a.price);
    if (sort === "rating") data = [...data].sort((a, b) => b.rating - a.rating);

    setFiltered(data);
    setPage(1); // Går tilbage til side 1, når filtrering ændres
  }, [search, sort, category, products]);

  // Scroller til toppen når siden ændres
  useEffect(() => {
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [page]);

  // Pagination beregning
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Lægger et produkt i kurven
  function handleAddToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  }

  // Når brugeren klikker på en anden side
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className={styles.productsPage}>
      {/* Top ref til scroll-to-top ved sideskift */}
      <div ref={productsTopRef}></div>

      <h1 className={styles.heading}>Alle produkter</h1>

      {/* Filtreringsbar */}
      <div className={styles.filterRow}>
        {/* Søgning */}
        <div className={styles.inputGroup}>
          <label htmlFor="search" className={styles.srOnly}>Søg produkter</label>
          <input
            id="search"
            className={styles.input}
            placeholder="Søg efter produktnavn..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Kategori vælger */}
        <div className={styles.inputGroup}>
          <label htmlFor="category" className={styles.srOnly}>Kategori</label>
          <select
            id="category"
            className={styles.select}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="Alle">Alle kategorier</option>
            {uniqueCategories(products).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sorteringsvælger */}
        <div className={styles.inputGroup}>
          <label htmlFor="sort" className={styles.srOnly}>Sorter efter</label>
          <select
            id="sort"
            className={styles.select}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
            <option value="price-asc">Pris stigende</option>
            <option value="price-desc">Pris faldende</option>
            <option value="rating">Bedømmelse</option>
          </select>
        </div>
      </div>

      {/* Viser hvor mange produkter der vises */}
      <div className={styles.productCount}>
        Viser {paged.length} af {filtered.length} produkter
        {totalPages > 1 && (
          <span className={styles.pageInfo}> • Side {page} af {totalPages}</span>
        )}
      </div>

      {/* Produktgrid */}
      <div className={styles.grid}>
        {paged.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Sideinddeling / pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* Forrige side */}
          {page > 1 && (
            <button
              onClick={() => handlePageChange(page - 1)}
              className={styles.navButton}
              aria-label="Forrige side"
            >
              ← Forrige
            </button>
          )}

          {/* Side-numre */}
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;

            // Viser kun vigtige sider (f.eks. 1, sidste, og omkring nuværende)
            const showPage = pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(pageNum - page) <= 1;

            if (!showPage) {
              // Viser "..." hvis der springes over sider
              if (pageNum === 2 && page > 4) {
                return <span key="ellipsis1" className={styles.ellipsis}>...</span>;
              }
              if (pageNum === totalPages - 1 && page < totalPages - 3) {
                return <span key="ellipsis2" className={styles.ellipsis}>...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === page ? styles.pageActive : styles.pageButton}
                aria-label={`Gå til side ${pageNum}`}
                aria-current={pageNum === page ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Næste side */}
          {page < totalPages && (
            <button
              onClick={() => handlePageChange(page + 1)}
              className={styles.navButton}
              aria-label="Næste side"
            >
              Næste →
            </button>
          )}
        </div>
      )}

      {/* Hvis ingen resultater efter filtrering */}
      {paged.length === 0 && filtered.length === 0 && products.length > 0 && (
        <div className={styles.noResults}>
          <h2>Ingen produkter fundet</h2>
          <p>Prøv at justere dine søgekriterier eller filtre.</p>
        </div>
      )}
    </div>
  );
}

export default Products;