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

    // Inicializamos el SDK de MercadoPago limpiando el token de espacios invisibles
    const client = new MercadoPagoConfig({
      accessToken: (process.env.MP_ACCESS_TOKEN || "").trim(),
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

    // Mercado Pago requiere URLs absolutas. Para evitar errores de validación, forzamos una URL
    // que el SDK reconozca como válida (el error back_url.success suele ser por formato).
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const preferenceBody = {
      items: mpItems,
      external_reference: orderId?.toString() || "sin-orden",
      back_urls: {
        success: `${baseUrl}/checkout-success`,
        failure: `${baseUrl}/`,
        pending: `${baseUrl}/`,
      },
      auto_return: "approved",
      binary_mode: true,
    };

    console.log(">>> MP Preference Body Final:", JSON.stringify(preferenceBody, null, 2));

    let response;
    try {
      // Intentamos con auto_return (ideal para producción)
      response = await preference.create({ body: preferenceBody });
    } catch (createError: any) {
      console.warn(">>> MP aviso: El servidor de MP rechazó auto_return en localhost. Reintentando sin esa opción...");
      // Si falla por validación de URL (típico de localhost), reintentamos sin auto_return
      const { auto_return, ...simpleBody } = preferenceBody;
      response = await preference.create({ body: simpleBody });
    }

    return NextResponse.json({ id: response.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return NextResponse.json(
      { error: "Error interno al crear preferencia de MercadoPago" },
      { status: 500 },
    );
  }
}
