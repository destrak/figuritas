import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const numId = Number(id);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("objetos")
        .select("id_objeto,titulo,descripcion,precio,stock,imagen,estado")
        .eq("id_objeto", numId)
        .maybeSingle();

      if (error) console.error(error);

      if (data) {
        setProduct({
          id: data.id_objeto,
          name: data.titulo,
          descripcion: data.descripcion ?? "",
          price: Number(data.precio),
          stock: data.stock ?? 0,
          image: data.imagen || "/vite.svg",
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    })();
  }, [numId]);

  if (loading) return <h2 style={{ color: "#fff" }}>Cargando...</h2>;
  if (!product) return <h2 style={{ color: "#fff" }}>Producto no encontrado</h2>;

  const { name, price, stock, image, descripcion } = product;

  return (
    <main style={{ width: "100%", minHeight: "calc(100vh - 60px)", background: "#0b1220",
                   padding: "24px 20px", display: "grid", placeItems: "center", color: "#e5e7eb" }}>
      <div style={{ width: "min(1100px, 96vw)", background: "#0f172a", border: "1px solid #1f2937",
                    borderRadius: 16, padding: 24, display: "grid",
                    gridTemplateColumns: "minmax(260px, 1fr) 1.2fr", gap: 24 }}>
        <img src={image} alt={name}
             style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12 }} />
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>{name}</h1>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>
            ${price.toLocaleString("es-CL")}
          </div>
          {descripcion && <p>{descripcion}</p>}
          <p>{stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}</p>
          <button
            disabled={stock <= 0}
            onClick={() => addToCart({ id: product.id, name, price })}
            style={{ padding: "12px 18px", borderRadius: 12, border: "1px solid #22c55e",
                     background: stock > 0 ? "#16a34a" : "#374151", color: "#fff", fontWeight: 800 }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
