import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    // Validación básica de los ítems
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío o inválido" },
        { status: 400 },
      );
    }

    // Calcular el monto total
    const totalAmount = items.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);

    let orderId = null;

    // Si enviaron datos del cliente, creamos la orden en Supabase
    if (customer) {
      const { data, error } = await supabase.from("orders").insert([{
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_city: customer.city,
        items: items,
        total_amount: totalAmount,
        status: "pending"
      }]).select("id").single();

      if (error) {
        console.error("Error guardando orden en Supabase:", error);
      } else {
        orderId = data.id;
      }
    }

    // Inicializamos el SDK de MercadoPago
    // Usa la variable de entorno que debes configurar en .env.local
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || "",
      options: { timeout: 5000 },
    });

    const preference = new Preference(client);

    // Formateamos los items para MP
    const mpItems = items.map((item: any) => ({
      id: item.id?.toString() || "item",
      title: item.name || "Producto DYS",
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price) || 0,
      currency_id: "CLP", 
    }));

    // Forzamos una URL estrictamente válida para evitar el error 'back_url.success must be defined'
    const fallbackUrl = "http://localhost:3000";

    const response = await preference.create({
      body: {
        items: mpItems,
        external_reference: orderId || "sin-orden",
        back_urls: {
          success: fallbackUrl,
          failure: fallbackUrl,
          pending: fallbackUrl,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ id: response.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return NextResponse.json(
      { error: "Error interno al crear preferencia de MercadoPago" },
      { status: 500 },
    );
  }
}
