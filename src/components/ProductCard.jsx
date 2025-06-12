// Importerer ikoner og nødvendige hooks + styling
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import styles from "./ProductCard.module.css";
import useFavorites from "../hooks/useFavorites";
import { useState } from "react";

// Komponent der viser ét produkt som et kort
function ProductCard({ product, onAddToCart }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  // State til at vise "Tilføjet!" kortvarigt efter klik
  const [added, setAdded] = useState(false);

  // Håndterer klik på "Tilføj til kurv"
  const handleClick = () => {
    onAddToCart(product); // kalder funktionen fra parent
    setAdded(true);       // viser at produktet er tilføjet
    setTimeout(() => setAdded(false), 2000); // nulstiller igen efter 2 sek.
  };

  // Udregner rabat i procent hvis der er en gammel pris
  const discount = product.oldPrice
    ? Math.round(100 * (1 - product.price / product.oldPrice))
    : null;

  return (
    <div className={styles.card}>
      {/* Hvis der er rabat, vis rabatbadge */}
      {discount && <span className={styles.discountBadge}>-{discount}%</span>}

      {/* Favorit-knap (hjerte) */}
      <button
        className={styles.favBtn}
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={isFavorite(product.id) ? "Fjern fra favoritter" : "Føj til favoritter"}
      >
        <FaHeart
          className={isFavorite(product.id) ? styles.filled : ""}
          color={isFavorite(product.id) ? "#f75d5d" : "#ccd9e5"}
        />
      </button>

      {/* Produktbillede */}
      <img src={product.thumbnail} alt={product.title} className={styles.img} />

      {/* Lager- og kategori-badges */}
      <div className={styles.badgeRow}>
        <span className={styles.stockBadge}>PÅ LAGER</span>
        <span className={styles.categoryBadge}>{product.category}</span>
      </div>

      {/* Produktnavn */}
      <div className={styles.title}>{product.title}</div>

      {/* Pris og evt. gammel pris */}
      <div className={styles.priceRow}>
        <span className={styles.price}>{product.price} DKK</span>
        {product.oldPrice && (
          <span className={styles.oldPrice}>{product.oldPrice} DKK</span>
        )}
      </div>

      {/* Bedømmelse med stjerne */}
      <div className={styles.ratingRow}>
        <FaStar className={styles.star} />
        <span>{product.rating?.toFixed(1) || "-"}</span>
      </div>

      {/* Tilføj til kurv knap */}
      <button
        className={`${styles.cartBtn} ${added ? styles.added : ""}`}
        onClick={handleClick}
        disabled={added}
        type="button"
        aria-label={added ? "Produkt tilføjet til kurven" : "Tilføj til kurv"}
      >
        <FaShoppingCart style={{ marginRight: "0.7em" }} />
        {added ? "Tilføjet!" : "Tilføj til kurv"}
      </button>
    </div>
  );
}

export default ProductCard;
