import { FaShoppingBag } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaPhone,
  FaInfoCircle,
  FaChevronRight
} from "react-icons/fa";
import { useEffect } from "react";
import styles from "./BurgerMenu.module.css";
import useLocalStorage from "../hooks/useLocalStorage";

// Komponent til burger-menu
function BurgerMenu({ open, setOpen, categories = [] }) {
  const location = useLocation();
  const [cart] = useLocalStorage("cart", []);
  const [favorites] = useLocalStorage("favorites", []);
  const cartItemCount = cart.reduce((total, item) => total + (item.qty || 1), 0);
  const favoriteCount = favorites.length;

  // Lukker menuen automatisk hvis man skifter side
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  // Hvis brugeren trykker på Escape, så lukker vi menuen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, setOpen]);

  if (!open) return null;

  const menuItems = [
    { name: 'Hjem', icon: FaHome, link: '/' },
    { name: 'Produkter', icon: FaShoppingBag, link: '/produkter' },
    { name: 'Om os', icon: FaInfoCircle, link: '/om-os' },
    { name: 'Kontakt', icon: FaPhone, link: '/kontakt' }
  ];

  const userItems = [
    { name: 'Favoritter', icon: FaHeart, link: '/favoritter', badge: favoriteCount },
    { name: 'Kurv', icon: FaShoppingCart, link: '/kurv', badge: cartItemCount }
  ];

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <nav className={styles.menu} onClick={e => e.stopPropagation()}>
        {/* Top-bar med logo og luk-knap */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
            <img
              src="/webshop-projekt/logo.png"
              alt="HardwareByen logo"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>HardwareByen</span>
          </Link>

          <button
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Luk menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Alt indhold i menuen */}
        <div className={styles.menuContent}>
          {/* Navigation */}
          <div className={styles.section}>
            <h3>Navigation</h3>
            <ul className={styles.menuList}>
              {menuItems.map((item, index) => (
                <li key={item.name} style={{ '--delay': `${index * 0.1}s` }}>
                  <Link
                    to={item.link}
                    className={`${styles.menuItem} ${location.pathname === item.link ? styles.active : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className={styles.icon} />
                    <span>{item.name}</span>
                    <FaChevronRight className={styles.chevron} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamiske kategorier */}
          {categories.length > 0 && (
            <div className={styles.section}>
              <h3>Kategorier</h3>
              <ul className={styles.menuList}>
                {categories.map((cat, index) => (
                  <li key={cat.name} style={{ '--delay': `${(menuItems.length + index) * 0.1}s` }}>
                    <Link
                      to={cat.link}
                      className={styles.menuItem}
                      onClick={() => setOpen(false)}
                    >
                      <FaShoppingBag className={styles.icon} />
                      <span>{cat.name}</span>
                      <FaChevronRight className={styles.chevron} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bruger links */}
          <div className={styles.section}>
            <h3>Kurv & Favoritter</h3>
            <ul className={styles.menuList}>
              {userItems.map((item, index) => (
                <li key={item.name} style={{ '--delay': `${(menuItems.length + categories.length + index) * 0.1}s` }}>
                  <Link
                    to={item.link}
                    className={`${styles.menuItem} ${location.pathname === item.link ? styles.active : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className={styles.icon} />
                    <span>{item.name}</span>
                    {item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
                    <FaChevronRight className={styles.chevron} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer med kontaktinfo */}
        <div className={styles.footer}>
          <div className={styles.support}>
            <h4>Brug for hjælp?</h4>
            <p>Ring til os på <a href="tel:+4570203040">+45 70 20 30 40</a></p>
            <p>Skriv til <a href="mailto:support@hardwarebyen.dk">support@hardwarebyen.dk</a></p>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BurgerMenu;