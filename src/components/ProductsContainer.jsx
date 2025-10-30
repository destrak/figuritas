import React from "react";
import ProductCard from "./ProductCard";

const ProductsContainer = ({ title = "Productos", products = [] }) => {
  const wrap = {
    width: "100%",
    background: "#0b1220",
    padding: "24px 20px",
    borderTop: "1px solid #1f2937",
  };

  const inner = {
    width: "min(1200px, 96vw)",
    margin: "0 auto",
  };

  const heading = {
    color: "#e5e7eb",
    margin: "0 0 16px 4px",
    fontSize: 20,
    fontWeight: 800,
  };

  const grid = {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    alignItems: "start",
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        {title && <h2 style={heading}>{title}</h2>}
        <div style={grid}>
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
      </div>
    </section>
  );
};

export default ProductsContainer;
