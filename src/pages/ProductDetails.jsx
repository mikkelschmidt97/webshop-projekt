// Importerer nødvendige hooks og ikoner
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/api";
import useLocalStorage from "../hooks/useLocalStorage";
import useFavorites from "../hooks/useFavorites";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import styles from "./ProductDetails.module.css";

function ProductDetails() {
  // Henter produkt-id fra URL'en
  const { id } = useParams();

  // State til at gemme det valgte produkt og loading-status
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Favoritter (fra custom hook)
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Kurv fra local storage
  const [, setCart] = useLocalStorage("cart", []);

  // Tilbage-navigation
  const navigate = useNavigate();

  // Henter produktdata baseret på ID
  useEffect(() => {
    (async () => {
      const data = await fetchProducts(); // henter alle produkter
      const found = data.find(p => String(p.id) === id); // finder det rigtige produkt
      setProduct(found); // sætter produktet
      setLoading(false);
      if (found) {
        document.title = `${found.title} – HardwareByen`; // sætter sidetitel
      }
    })();
  }, [id]);

  // Funktion til at lægge produkt i kurven
  function handleAddToCart() {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        // Hvis produktet allerede er i kurven, opdaterer vi antal
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        // Ellers tilføjer vi det med qty = 1
        return [...prev, { ...product, qty: 1 }];
      }
    });
  }

  // Loader besked mens produktet hentes
  if (loading) return <p style={{ margin: "2rem" }}>Indlæser…</p>;

  // Hvis der ikke blev fundet noget produkt
  if (!product) return <p style={{ margin: "2rem" }}>Produkt ikke fundet.</p>;

  // Tjekker om produktet allerede er en favorit
  const isFavorite = favorites.some(f => f.id === product.id);

  return (
    <section className={styles.detailsSection}>
      {/* Tilbage-knap */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Tilbage
      </button>

      {/* Produktdetaljer vises her */}
      <div className={styles.details}>
        <img src={product.thumbnail} alt={product.title} className={styles.img} />

        <div className={styles.info}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.desc}>{product.description}</p>

          {/* Pris og rating */}
          <div className={styles.row}>
            <span className={styles.price}>{product.price} DKK</span>
            <span className={styles.rating}>★ {product.rating}</span>
          </div>

          {/* Kategori og favorit-knap */}
          <div className={styles.row}>
            <span className={styles.category}>{product.category}</span>
            <button
              className={styles.favBtn}
              onClick={() =>
                isFavorite ? removeFavorite(product.id) : addFavorite(product)
              }
              aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
            >
              <FaHeart color={isFavorite ? "#f85d5d" : "#b5d2ec"} />
            </button>
          </div>

          {/* Læg i kurv knap */}
          <button className={styles.cartBtn} onClick={handleAddToCart}>
            Læg i kurv
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;