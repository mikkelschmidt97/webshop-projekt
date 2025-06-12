// Importerer nødvendige hooks, komponenter og ikoner
import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaStar, FaArrowRight } from "react-icons/fa";

function Home() {
  // State til produkter på forsiden
  const [products, setProducts] = useState([]);

  // Navigationsfunktion til routing
  const navigate = useNavigate();

  // Lokal storage til kurv (kun skriver, ikke læser her)
  const [, setCart] = useLocalStorage("cart", []);

  // Loader produkter og sætter sidens titel
  useEffect(() => {
    document.title = "HardwareByen – Din online techbutik";

    // Async funktion til at hente produkter
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 6)); // Viser kun de første 6 produkter
      } catch (err) {
        console.error("Kunne ikke hente produkter:", err);
      }
    })();
  }, []);

  // Når man klikker på "Læg i kurv"-knappen
  function handleAddToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        // Hvis produktet allerede er i kurven, opdaterer vi antal
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        // Hvis det er nyt, tilføjer vi det med qty = 1
        return [...prev, { ...product, qty: 1 }];
      }
    });
  }

  // Liste over fordele ved at handle hos HardwareByen
  const features = [
    { id: "shipping", icon: FaShippingFast, title: "Gratis fragt", description: "På alle ordrer over 299 DKK" },
    { id: "warranty", icon: FaShieldAlt, title: "2 års garanti", description: "Omfattende garanti på alle produkter" },
    { id: "support", icon: FaHeadset, title: "Ekspert support", description: "Personlig rådgivning fra vores specialister" },
    { id: "quality", icon: FaStar, title: "Kvalitet først", description: "Kun produkter fra anerkendte brands" }
  ];

  return (
    <div className={styles.bg}>
      {/* Hero sektion med velkomsttekst */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>
              Danmarks <span className={styles.gradient}>smarteste</span> techbutik
            </h1>
            <h2>
              Hvor teknologi møder passion
            </h2>
            <p>
              Oplev et komplet univers af cutting-edge hardware, gaming-udstyr og smart home-løsninger. 
              Fra kraftfulde gaming-rigs til intelligente hjem-systemer – vi har alt, hvad du behøver for at 
              opbygge din digitale verden.
            </p>

            {/* Knap til at udforske produkter */}
            <div className={styles.ctaGroup}>
              <button 
                className={styles.ctaPrimary}
                onClick={() => navigate("/produkter")}
                aria-label="Udforsk vores produktsortiment"
              >
                Udforsk sortimentet
                <FaArrowRight className={styles.ctaIcon} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sektion med fordele/ikoner */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Hvorfor vælge HardwareByen?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Viser populære produkter (top 6) */}
      <section className={styles.topProducts}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Populære produkter</h2>
            <p className={styles.sectionSubtitle}>
              Oplev vores mest populære produkter – valgt af tusindvis af tilfredse kunder
            </p>
          </div>

          {/* Viser produkter hvis de er hentet */}
          <div className={styles.products}>
            {products.length === 0 ? (
              <p>Indlæser populære produkter...</p>
            ) : (
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  homeStyle
                />
              ))
            )}
          </div>

          {/* Knap til at se alle produkter */}
          <div className={styles.viewMoreContainer}>
            <button 
              className={styles.viewMoreBtn}
              onClick={() => navigate("/produkter")}
              aria-label="Se hele produktkataloget"
            >
              Se alle produkter
              <FaArrowRight className={styles.ctaIcon} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
