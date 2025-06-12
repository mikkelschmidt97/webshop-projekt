// Importerer nødvendige hooks, komponenter og ikoner
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import BurgerMenu from "./BurgerMenu";
import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function Header() {
  // State til burger-menu og scrolleffekt
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Henter kurv og favoritter fra localStorage
  const [cart] = useLocalStorage("cart", []);
  const [favorites] = useLocalStorage("favorites", []);

  const location = useLocation(); // bruges til aktiv link-styling

  // Lytter til scroll og sætter "scrolled" state
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Regner antal varer i kurv og antal favoritter
  const cartItemCount = cart.reduce((total, item) => total + (item.qty || 1), 0);
  const favoriteCount = favorites.length;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          
          {/* Logo (link til forsiden) */}
          <div className={styles.logoSection}>
          <Link to="/" className={styles.logo}>
            <img
              src="\public\logo.png"
              alt="HardwareByen logo"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>HardwareByen</span>
          </Link>


          </div>

          {/* Navigation til desktop */}
          <nav className={styles.desktopNav}>
            <Link
              to="/produkter"
              className={`${styles.navLink} ${location.pathname === "/produkter" ? styles.active : ""}`}
            >
              Produkter
            </Link>
            <Link 
              to="/om-os"
              className={`${styles.navLink} ${location.pathname === "/om-os" ? styles.active : ""}`}
            >
              Om os
            </Link>
            <Link 
              to="/kontakt"
              className={`${styles.navLink} ${location.pathname === "/kontakt" ? styles.active : ""}`}
            >
              Kontakt
            </Link>
          </nav>

          {/* Ikoner: favoritter, kurv og burger-menu */}
          <div className={styles.actions}>
            <Link to="/favoritter" className={styles.actionLink} aria-label="Favoritter">
              <FaHeart />
              {favoriteCount > 0 && <span className={styles.badge}>{favoriteCount}</span>}
            </Link>

            <Link to="/kurv" className={styles.actionLink} aria-label="Kurv">
              <FaShoppingCart />
              {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
            </Link>

            <button 
              className={styles.burgerButton} 
              onClick={() => setOpen(true)} 
              aria-label="Åbn menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Mobilmenu */}
      <BurgerMenu open={open} setOpen={setOpen} />
    </header>
  );
}

export default Header;