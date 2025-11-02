import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import BarNav from "./components/BarNav";
import ProductsContainer from "./components/ProductsContainer";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import { products } from "./data/products";

const AppContent = () => {
  const { count } = useCart();

  return (
    <>
      <BarNav cartCount={count} />
      <Routes>
        <Route path="/" element={<ProductsContainer products={products} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}
