import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, name, price, image }) => {
  const navigate = useNavigate();

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(0,0,0,.10)",
      }}
    >
      {/* 👇 Solo la imagen navega al detalle */}
      <div
        onClick={() => navigate(`/product/${id}`)}
        style={{ width: "100%", aspectRatio: "4/3", background: "#f3f4f6" }}
      >
        <img
          src={image}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: 12 }}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: 16, fontWeight: 700, color: "#111827" }}>
          {name}
        </h3>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0A8F3C" }}>
          ${Number(price).toLocaleString("es-CL")}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
