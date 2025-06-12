// Importerer lokal storage hook og React hooks
import useLocalStorage from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import styles from "./CartPage.module.css";

// Gyldige rabatkoder og hvad de gør
const validCodes = [
  { code: "SAVE10", discount: 0.1, text: "10% rabat" },
  { code: "FREESHIP", discount: 0, text: "Gratis fragt" }
];

// Fast fragtpris i DKK
const SHIPPING = 39;

function CartPage() {
  // Skifter sidens titel og meta beskrivelse (SEO)
  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Se dine varer i kurven og gør klar til at bestille hos HardwareByen – din online techbutik.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Se dine varer i kurven og gør klar til at bestille hos HardwareByen – din online techbutik.";
      document.head.appendChild(meta);
    }
  }, []);

  // Bruger lokal storage til at gemme kurv
  const [cart, setCart] = useLocalStorage("cart", []);

  // State til rabatkode og beskeder
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [freeShip, setFreeShip] = useState(false);
  const [msg, setMsg] = useState("");

  // Beregner totalpriser med afrunding til 2 decimaler
  const total = Math.round(cart.reduce((acc, p) => acc + p.price * (p.qty || 1), 0) * 100) / 100;
  const discounted = Math.round((total - total * discount) * 100) / 100;
  const shipping = freeShip || total === 0 ? 0 : SHIPPING;
  const finalTotal = Math.round((discounted + shipping) * 100) / 100;

  // Formaterer priser til dansk format (komma som decimalseparator)
  const formatPrice = (price) => price.toFixed(2).replace('.', ',');

  // Funktion til at ændre antal af et produkt
  function updateQty(id, delta) {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p
      )
    );
  }

  // Fjerner et produkt fra kurven
  function removeProduct(id) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  // Når brugeren prøver en rabatkode
  function handleCode() {
    const input = code.trim().toUpperCase(); // sikrer store bogstaver
    const found = validCodes.find(c => c.code === input);

    if (found) {
      setMsg(found.text + " tilføjet!");
      if (found.code === "FREESHIP") {
        setFreeShip(true);
      } else {
        setDiscount(found.discount);
      }
    } else {
      setMsg("Ugyldig rabatkode!");
    }
  }

  // Selve HTML'en til kurven
  return (
    <section className={styles.cartSection}>
      <h2 className={styles.cartHeading}>Indkøbskurv</h2>

      {/* Hvis kurven er tom */}
      {cart.length === 0 ? (
        <p className={styles.emptyMessage}>Kurven er tom.</p>
      ) : (
        <div className={styles.cartContent}>
          {/* Liste over produkter i kurven */}
          <div className={styles.cartList}>
            {cart.map(p => (
              <div key={p.id} className={styles.item}>
                <img src={p.thumbnail} alt={p.title} />
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span>{formatPrice(p.price)} DKK</span>
                  <div className={styles.qtyRow}>
                    <button onClick={() => updateQty(p.id, -1)}>-</button>
                    <span>{p.qty || 1}</span>
                    <button onClick={() => updateQty(p.id, 1)}>+</button>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeProduct(p.id)}>
                    Fjern
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total og rabatkode felt */}
          <div className={styles.cartTotal}>
            <input
              type="text"
              placeholder="Rabatkode"
              value={code}
              onChange={e => setCode(e.target.value)}
              className={styles.codeInput}
            />
            <button className={styles.codeBtn} onClick={handleCode}>Indløs</button>
            {msg && <div className={styles.codeMsg}>{msg}</div>}

            {/* Prisoversigt */}
            <div className={styles.priceRow}>
              <span>Subtotal</span>
              <span>
                {discount > 0 ? (
                  <>
                    <s>{formatPrice(total)} DKK</s> {formatPrice(discounted)} DKK
                  </>
                ) : (
                  <>{formatPrice(total)} DKK</>
                )}
              </span>
            </div>
            <div className={styles.priceRow}>
              <span>Fragt</span>
              <span>{shipping === 0 ? "Gratis" : `${formatPrice(shipping)} DKK`}</span>
            </div>
            <div className={styles.priceRow + " " + styles.totalRow}>
              <span>Samlet</span>
              <span style={{ fontWeight: 700 }}>
                {formatPrice(finalTotal)} DKK
              </span>
            </div>
            <button className={styles.checkoutBtn}>Gå til betaling</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;