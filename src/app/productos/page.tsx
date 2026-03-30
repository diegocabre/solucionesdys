"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore, Product } from "@/store/cartStore";

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        // Traer productos desde Supabase
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setProducts(data as Product[]);
        }
      } catch (err: any) {
        console.error("Error cargando productos:", err);
        setError("No pudimos conectar con el catálogo en vivo. Revisa tu consola y las credenciales.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-primary">Catálogo Online</h1>
          <p className="text-gray-500 mt-2">
            Encuentra todo lo que necesitas para tu proyecto, enlazado directamente a tu base de datos central.
          </p>
        </div>

        {/* Estado de Carga */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Buscando productos en Supabase...</p>
          </div>
        )}

        {/* Estado de Error */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center gap-4">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <div>
               <h3 className="font-bold text-lg">Disculpa los inconvenientes</h3>
               <p>{error}</p>
            </div>
          </div>
        )}

        {/* Grilla de productos Dinámicos */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-500 text-lg">No hay productos disponibles actualmente en la base de datos.</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-accent/30 transition-all flex flex-col group relative"
              >
                {/* Badge de Stock */}
                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm border border-blue-400">
                    A Pedido
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                    ¡Quedan {product.stock}!
                  </div>
                )}

                <div className="bg-linear-to-br from-gray-100 to-gray-50 h-48 w-full flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">Imagen del Producto</span>
                  )}
                  <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors duration-300"></div>
                </div>

                <div className="p-5 grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-brand-accent font-semibold uppercase tracking-wider mb-2">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-lg text-brand-primary mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                       <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                         {product.description}
                       </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-xl font-bold text-brand-primary">
                      ${product.price.toLocaleString("es-CL")}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => addItem(product)}
                      variant="primary"
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
