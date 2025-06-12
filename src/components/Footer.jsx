// Importerer nødvendige ikoner, hooks og styling
import { Link } from "react-router-dom";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaArrowUp
} from "react-icons/fa";
import styles from "./Footer.module.css";
import { useState, useEffect } from "react";

function Footer() {
  // State til at vise "scroll til top"-knap
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // State til nyhedsbrev funktionalitet
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Viser knappen når man scroller længere ned på siden
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Når man klikker på "scroll til top"-knappen
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Email validering
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Håndter nyhedsbrev tilmelding
  const handleSubscribe = () => {
    if (!email.trim()) {
      setEmailError('Indtast venligst din email-adresse');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Indtast venligst en gyldig email-adresse');
      return;
    }

    setEmailError('');
    setIsSubscribed(true);
    
    // Reset efter 5 sekunder
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 5000);
  };

  // Håndter email input ændringer
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  // Håndter Enter-tast i email input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Scroll-til-top knap (vises kun hvis man har scrollet langt nok) */}
      {showScrollTop && (
        <button className={styles.scrollTop} onClick={scrollToTop} aria-label="Scroll til toppen">
          <FaArrowUp />
        </button>
      )}

      {/* Nyhedsbrev sektion */}
      <div className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h3>Få de bedste tilbud direkte i din indbakke</h3>
            <p>
              Tilmeld dig vores nyhedsbrev og vær den første til at høre om nye produkter,
              særtilbud og tech-nyheder
            </p>
            
            {!isSubscribed ? (
              <div className={styles.newsletterForm}>
                <div className={styles.inputWrapper}>
                  <input 
                    type="email" 
                    placeholder="Din email-adresse"
                    className={`${styles.emailInput} ${emailError ? styles.emailError : ''}`}
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                  />
                  {emailError && <span className={styles.errorMessage}>{emailError}</span>}
                </div>
                <button 
                  className={styles.subscribeBtn}
                  onClick={handleSubscribe}
                >
                  Tilmeld nu
                </button>
              </div>
            ) : (
              <div className={styles.subscribeSuccess}>
                <button className={`${styles.subscribeBtn} ${styles.subscribed}`} disabled>
                  Tak for tilmelding
                </button>
                <p className={styles.demoMessage}>
                  <em>Note: Dette er kun til demonstration - nyhedsbrev funktionen er ikke aktiv.</em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hovedfooter med kontaktinformationer */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Kontaktoplysninger */}
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaPhone />
                <span>+45 70 20 30 40</span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope />
                <span>support@hardwarebyen.dk</span>
              </div>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt />
                <span>Teknologiparken 15, 2630 Taastrup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
