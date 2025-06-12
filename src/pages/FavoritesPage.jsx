// Importerer custom hook til favoritter og en komponent til at vise produkter
import useFavorites from "../hooks/useFavorites";
import ProductCard from "../components/ProductCard";
import styles from "./FavoritesPage.module.css";

function FavoritesPage() {
  // Henter favoritter og funktioner fra hook'en
  const { favorites } = useFavorites();

  return (
    <div className={styles.favoritesPage}>
      {/* Sideoverskrift */}
      <h1 className={styles.heading}>Dine Favoritter</h1>

      {/* Produkttæller */}
      <div className={styles.productCount}>
        {favorites.length === 0 ? (
          ""
        ) : favorites.length === 1 ? (
          <span>Viser <span className={styles.pageInfo}>1</span> favoritprodukt</span>
        ) : (
          <span>Viser <span className={styles.pageInfo}>{favorites.length}</span> favoritprodukter</span>
        )}
      </div>

      {/* Hvis der ikke er nogen favoritter */}
      {favorites.length === 0 ? (
        <div className={styles.noResults}>
          <h2>Du har ingen favoritter endnu</h2>
          <p>
            Når du finder produkter du kan lide, kan du klikke på hjertet for at tilføje dem til dine favoritter. 
            De vil så blive vist her, så du nemt kan finde dem igen senere.
          </p>
        </div>
      ) : (
        // Viser produkter i et grid-layout
        <div className={styles.grid}>
          {favorites.map(product => (
            // Viser hvert produkt som et kort (ProductCard)
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => {}} // tom funktion, skal evt. implementeres
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;