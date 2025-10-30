import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarNav from "./components/BarNav";
import ProductsContainer from "./components/ProductsContainer";
import ProductDetail from "./pages/ProductDetail";
import { products } from "./data/products";

function App() {
  const [cartCount, setCartCount] = React.useState(0);

  const handleAddToCart = (product) => {
    // aquí podrías manejar un carrito real; por ahora solo incrementa el contador
    setCartCount((n) => n + 1);
  };

  return (
    <Router>
      <BarNav cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={<ProductsContainer title="Productos" products={products} />}
        />
        <Route
          path="/productos"
          element={<ProductsContainer title="Productos" products={products} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetail onAddToCart={handleAddToCart} />}
        />
        <Route path="/cart" element={<div style={{ padding: 24 }}><h2>🛒 Tu carrito</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;
