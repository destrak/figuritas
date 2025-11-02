import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "./ProductCard";

export default function ProductsContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("objetos")
        .select("id_objeto,titulo,precio,stock,imagen,estado")
        .eq("estado", "disponible")
        .order("id_objeto");

      if (error) console.error(error);
      const normalized = (data ?? []).map(p => ({
        id: p.id_objeto,
        name: p.titulo,
        price: Number(p.precio),
        stock: p.stock ?? 0,
        image: p.imagen || "/vite.svg",
      }));
      setProducts(normalized);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Cargando productos...</p>;

  return (
    <section style={{ width: "100vw", minHeight: "calc(100vh - 64px)", background: "#0b1220",
                      borderTop: "1px solid #1f2937", padding: "24px 24px 40px" }}>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {products.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </section>
  );
}
