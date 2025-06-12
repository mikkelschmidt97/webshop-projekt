// Importerer useEffect hook og CSS-modulet
import { useEffect } from "react";
import styles from "./About.module.css";

// Komponent til "Om os"-siden
function About() {
  // Skifter titlen på fanen, når komponenten bliver vist
  useEffect(() => {
    document.title = "Om os – HardwareByen";
  }, []);

  // Returnerer HTML-indholdet for "Om os"-siden
  return (
    <section className={styles.aboutSection}>
      {/* Overskrift */}
      <h2>Om HardwareByen</h2>

      {/* Beskrivelse af webshoppen */}
      <p>
        HardwareByen er din moderne onlinebutik med{" "}
        <strong>fokus på teknologi</strong>, gaming og smarte løsninger til hjemmet.
        <br />
        <br />
        Vi har altid et stort udvalg af de nyeste produkter og sætter en ære i personlig
        kundeservice, hurtig levering og gode priser.
        <br />
        <br />
        Kontakt os, hvis du har spørgsmål eller brug for rådgivning!
      </p>
    </section>
  );
}

// Eksporterer komponenten, så den kan bruges andre steder
export default About;
