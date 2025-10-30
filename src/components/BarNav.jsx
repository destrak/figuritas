import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const routeTitle = (pathname) => {
  if (pathname === "/") return "Inicio";
  if (pathname.startsWith("/product/")) return "Detalle";
  if (pathname === "/cart") return "Carrito";
  return "Inicio";
};

const BarNav = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = routeTitle(pathname);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        insetInline: 0,
        width: "100vw",
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
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr", // izq · centro · der
          alignItems: "center",
        }}
      >
        {/* Izquierda: Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 20 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#06b6d4,#2563eb)" }} />
            Figuritas
          </Link>
        </div>

        {/* Centro: Título de la vista */}
        <div style={{ textAlign: "center", fontWeight: 800 }}>{title}</div>

        {/* Derecha: Carrito */}
        <div style={{ justifySelf: "end" }}>
          <button
            onClick={() => navigate("/cart")}
            aria-label="Ver carrito"
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
              transition: "transform .2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
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
