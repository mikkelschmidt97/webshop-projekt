// Importerer nødvendige komponenter og hooks
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layout-komponenter
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

// Sidekomponenter (pages)
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import Contact from "./pages/Contact";
import About from "./pages/About";

// CSS-modul med generel styling
import styles from "./App.module.css";

// Komponent der automatisk scroller til toppen ved sideskift
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll op når path ændres
  }, [pathname]);

  return null;
}

// Appens ruter og struktur (skal ligge inde i Router)
function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      {/* Tilgængelighed: spring direkte til hovedindhold */}
      <a href="#main-content" className={styles.skipLink}>
        Spring til hovedindhold
      </a>

      {/* Øverste menu */}
      <Header />

      {/* Hovedindhold */}
      <main id="main-content" className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produkter" element={<Products />} />
          <Route path="/produkt/:id" element={<ProductDetails />} />
          <Route path="/kurv" element={<CartPage />} />
          <Route path="/favoritter" element={<FavoritesPage />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/om-os" element={<About />} />
        </Routes>
      </main>

      {/* Nederste sektion */}
      <Footer />
      <CookieBanner />
    </>
  );
}

// Selve app-komponenten – wrapper hele appen i en Router
function App() {
  return (
    <Router>
      <div className={styles.app}>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
