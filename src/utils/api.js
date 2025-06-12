// Funktion der henter produkter fra API'en
export async function fetchProducts() {
	try {
		// Henter data fra dummyjson (bruger fetch)
		const res = await fetch("https://dummyjson.com/products");

		// Hvis svaret ikke er OK, smider vi en fejl
		if (!res.ok) throw new Error("API fejl");

		// Læser JSON-data og returnerer kun produkter
		const data = await res.json();
		return data.products;
	} catch (err) {
		// Logger fejlen og returnerer en tom liste som fallback
		console.error(err);
		return [];
	}
}
