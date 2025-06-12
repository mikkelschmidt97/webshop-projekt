// Importerer React og ReactDOM til at køre appen i browseren
import React from "react";
import ReactDOM from "react-dom/client";

// Hovedkomponenten for hele appen
import App from "./App.jsx";

// Global styling
import "./index.css";

// Finder root-elementet i HTML'en og starter appen der
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* App køres i StrictMode for at fange fejl under udvikling */}
    <App />
  </React.StrictMode>
);
