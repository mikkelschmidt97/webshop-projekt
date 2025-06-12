import { useState, useEffect, useCallback } from "react";

// En custom hook der gør det lettere at bruge localStorage i React
export default function useLocalStorage(key, initialValue) {
	// Brug useCallback så readValue ikke ændres hele tiden
	const readValue = useCallback(() => {
		try {
			// Prøver at hente den gemte værdi fra localStorage
			const item = window.localStorage.getItem(key);
			// Hvis den findes, parser vi den som JSON – ellers bruger vi initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch {
			// Hvis der sker en fejl (fx ugyldigt JSON), returnér bare standardværdien
			return initialValue;
		}
	}, [key, initialValue]); // Afhængigheder så useCallback fungerer korrekt

	// Gemmer den aktuelle værdi i komponentets state
	const [storedValue, setStoredValue] = useState(readValue);

	// Funktion til at opdatere værdien både i state og i localStorage
	const setValue = (value) => {
		try {
			// Hvis value er en funktion, kalder vi den med den gamle værdi
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;

			// Opdater React state
			setStoredValue(valueToStore);

			// Gem den nye værdi i localStorage som en JSON-streng
			window.localStorage.setItem(key, JSON.stringify(valueToStore));

			// Vi laver vores egen event, så vi også kan opfange ændringen i andre tabs
			window.dispatchEvent(new Event("localstorage-update"));
		} catch (error) {
			// Udskriv fejlen i konsollen (så man kan fejlsøge)
			console.error(error);
		}
	};

	// useEffect lytter efter ændringer i localStorage (fra andre tabs eller komponenter)
	useEffect(() => {
		const handleStorageChange = () => {
			// Opdatér værdien hvis noget er ændret
			setStoredValue(readValue());
		};

		// Lyt både efter normale "storage" events (fra andre tabs)
		// og vores egen "localstorage-update" (fra samme tab)
		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("localstorage-update", handleStorageChange);

		// Ryd op når komponentet bliver fjernet
		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("localstorage-update", handleStorageChange);
		};
	}, [readValue]); // Husk at opdatere når readValue ændres

	// Returnér værdien og funktionen til at opdatere den – ligesom useState
	return [storedValue, setValue];
}
