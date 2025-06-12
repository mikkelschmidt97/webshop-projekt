## Teknologier brugt

- React + React Router DOM
- CSS Modules
- DummyJSON API til produktdata
- Custom hooks (`useLocalStorage`, `useFavorites`)

## Fejlfinding

### Produkter bliver ikke hentet:

```js
useEffect(() => {
	(async () => {
		try {
			const data = await fetchProducts();
			console.log("Modtagne produkter:", data);
			setProducts(data);
		} catch (err) {
			console.error("Fejl under produkt-hentning:", err);
		}
	})();
}, []);
```

### Tilføjelse til kurv:

```js
function handleAddToCart(product) {
	console.log("Lægger i kurv:", product);
	setCart((prev) => {
		const found = prev.find((p) => p.id === product.id);
		return found
			? prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p))
			: [...prev, { ...product, qty: 1 }];
	});
}
```

### Favorit-tilstand:

```js
console.log("Er favorit:", isFavorite(product.id));
```

### localStorage debug:

```js
console.log("Gemmer i localStorage:", key, valueToStore);
```

### Filtrering og sortering:

```js
useEffect(() => {
	console.log("Aktiv kategori:", category);
	console.log("Søgning:", search);
	console.log("Sortering:", sort);
	console.log("Filtrerede produkter:", filtered);
}, [search, sort, category, products]);
```

### Note

Jeg har valgt at skifte farve designet, da jeg simpelthen ikke var tilfreds med det farve design som vi sammen havde valgt i gruppen.
