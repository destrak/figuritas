import React from "react";
import ProductCard from "./ProductCard";

const ProductsContainer = ({ products = [] }) => {
  return (
    <section
      style={{
        width: "100vw",                 // 👈 ocupa todo el ancho de la página
        minHeight: "calc(100vh - 64px)",
        background: "#0b1220",
        borderTop: "1px solid #1f2937",
        boxSizing: "border-box",
        padding: "24px 24px 40px",      // mismo padding horizontal que tu BarNav
        overflowX: "hidden",            // seguridad extra
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 24,
          // 👇 grid full-width, responsivo y sin “pasarse”
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          alignItems: "start",
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsContainer;
