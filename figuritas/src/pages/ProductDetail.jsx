import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  if (!product) return <h2>Producto no encontrado</h2>;

  const { name, price, stock, image } = product;

  return (
    <main
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        background: "#0b1220",
        padding: "24px 20px",
        display: "grid",
        placeItems: "center",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "min(1100px, 96vw)",
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr) 1.2fr",
          gap: 24,
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            borderRadius: 12,
          }}
        />
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>{name}</h1>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>
            ${price.toLocaleString("es-CL")}
          </div>
          <p>{stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}</p>
          <button
            disabled={stock <= 0}
            onClick={() => addToCart(product)}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #22c55e",
              background: stock > 0 ? "#16a34a" : "#374151",
              color: "#fff",
              fontWeight: 800,
              cursor: stock > 0 ? "pointer" : "not-allowed",
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
