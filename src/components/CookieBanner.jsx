import useLocalStorage from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { FaCookie, FaTimes, FaCog } from "react-icons/fa";
import styles from "./CookieBanner.module.css";

// Komponent til at vise cookie-samtykkebanner
function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useLocalStorage("cookie-consent", null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Initialiser cookie-præferencer
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Vis banner efter kort forsinkelse hvis intet samtykke er givet
  useEffect(() => {
    if (cookieConsent === null) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [cookieConsent]);

  // Accepter alle cookies
  const acceptAll = () => {
    const all = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookieConsent({ accepted: true, preferences: all });
    setShowBanner(false);
  };

  // Accepter kun nødvendige cookies
  const acceptNecessary = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setCookieConsent({ accepted: true, preferences: onlyNecessary });
    setShowBanner(false);
  };

  // Gem brugerens valg
  const savePreferences = () => {
    setCookieConsent({ accepted: true, preferences });
    setShowPreferences(false);
    setShowBanner(false);
  };

  // Skift indstillinger (bortset fra nødvendige)
  const togglePreference = (type) => {
    if (type === "necessary") return;
    setPreferences((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Hvis brugeren allerede har givet samtykke, vis ikke banner
  if (!showBanner || cookieConsent !== null) return null;

  return (
    <>
      {/* Selve banneret */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerLeft}>
            <FaCookie className={styles.cookieIcon} />
            <div className={styles.textContent}>
              <h3>Vi respekterer dit privatliv</h3>
              <p>
                Vi bruger cookies til at forbedre din oplevelse, analysere trafik og vise relevante annoncer.
                Du kan tilpasse dine præferencer eller acceptere alle cookies.
              </p>
            </div>
          </div>
          <div className={styles.bannerActions}>
            <button onClick={() => setShowPreferences(true)} className={styles.preferencesBtn}>
              <FaCog /> Indstillinger
            </button>
            <button onClick={acceptNecessary} className={styles.acceptNecessaryBtn}>
              Kun nødvendige
            </button>
            <button onClick={acceptAll} className={styles.acceptAllBtn}>
              Accepter alle
            </button>
          </div>
        </div>
      </div>

      {/* Indstillinger-modal */}
      {showPreferences && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Cookie indstillinger</h3>
              <button onClick={() => setShowPreferences(false)} className={styles.closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Vælg hvilke typer cookies vi må bruge. Du kan ændre dem senere.</p>
              {["necessary", "analytics", "marketing", "preferences"].map((key) => {
                const cookie = {
                  key,
                  title: {
                    necessary: "Nødvendige cookies",
                    analytics: "Analyse cookies",
                    marketing: "Marketing cookies",
                    preferences: "Præference cookies",
                  }[key],
                  description: {
                    necessary: "Disse er nødvendige for at siden fungerer korrekt.",
                    analytics: "Hjælper os med at analysere brugen af siden.",
                    marketing: "Gør det muligt at vise relevante annoncer.",
                    preferences: "Gemmer dine valg og indstillinger.",
                  }[key],
                  required: key === "necessary",
                };
                return (
                  <div key={cookie.key} className={styles.cookieType}>
                    <div className={styles.cookieHeader}>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={preferences[cookie.key]}
                          disabled={cookie.required}
                          onChange={() => togglePreference(cookie.key)}
                        />
                        <span
                          className={`${styles.slider} ${cookie.required ? styles.disabled : ""}`}
                        ></span>
                      </label>
                      <div>
                        <h4>{cookie.title}</h4>
                        <span className={cookie.required ? styles.required : styles.optional}>
                          {cookie.required ? "Påkrævet" : "Valgfri"}
                        </span>
                      </div>
                    </div>
                    <p>{cookie.description}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowPreferences(false)} className={styles.cancelBtn}>
                Annuller
              </button>
              <button onClick={savePreferences} className={styles.saveBtn}>
                Gem indstillinger
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CookieBanner;