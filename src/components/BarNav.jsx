import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BarNav = ({ cartCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        insetInline: 0,
        width: "100vw",            // ocupa todo el ancho real
        background: "#0f172a",
        color: "#fff",
        zIndex: 50,
        boxShadow: "0 2px 6px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "12px 24px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Marca */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,#06b6d4,#2563eb)",
            }}
          />
          Figuritas
        </Link>

        {/* Links */}
        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
            Inicio
          </Link>
          <Link to="/productos" style={{ color: "#d1d5db", textDecoration: "none" }}>
            Productos
          </Link>
          <Link to="/ofertas" style={{ color: "#d1d5db", textDecoration: "none" }}>
            Ofertas
          </Link>
        </nav>

        {/* Carrito movido y con margen del borde */}
        <div style={{ marginRight: "24px" }}>
          <button
            onClick={() => navigate("/cart")}
            style={{
              position: "relative",
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid #1f2937",
              background: "#111827",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            aria-label="Ver carrito"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>

            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 20,
                  height: 20,
                  padding: "0 6px",
                  borderRadius: 999,
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,.25)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default BarNav;
