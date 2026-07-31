"use client";

import { useState, useEffect } from "react";
import { loginStep1, loginStep2, recoveryStep1, recoveryStep2, checkSession, logout, deleteOrderAndNotify, cleanupExpiredOrders } from "./actions";
import { Lock, LogOut, PackagePlus, Trash2, UploadCloud, RefreshCw, AlertCircle, ImageIcon, Loader2, Edit, ShoppingBag, X, Mail, Check, KeyRound } from "lucide-react";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/store/cartStore";

export default function AdminPage() {
  // --------- ESTADOS DE SESIÓN Y 2FA ---------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("sandracydiegoc@gmail.com");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginStep, setLoginStep] = useState<"credentials" | "otp" | "recovery_email" | "recovery_otp">("credentials");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --------- ESTADOS DE NAVEGACIÓN ---------
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // --------- ESTADOS DE INVENTARIO Y ORDENES ---------
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --------- ESTADOS DEL FORMULARIO CREAR ---------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --------- ESTADOS DEL FORMULARIO EDITAR ---------
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [editFile, setEditFile] = useState<File | null>(null);

  // --------- EFECTO INICIAL (JWT SESSION) ---------
  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionEmail = await checkSession();
        if (sessionEmail) {
          setIsAuthenticated(true);
          setEmailInput(sessionEmail);
          
          // EJECUTAR LIMPIEZA AUTOMÁTICA DE ÓRDENES EXPIRADAS (48 HORAS)
          try {
            await cleanupExpiredOrders();
          } catch (cleanErr) {
            console.error("Error al limpiar órdenes expiradas:", cleanErr);
          }
          
          // Cargar productos
          const { data: prodData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
          if (prodData) setProducts(prodData as Product[]);
          
          // Cargar órdenes
          const { data: ordData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
          if (ordData) setOrders(ordData);
        }
      } catch (err) {
        console.error("Error al validar sesión persistente:", err);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  // --------- LÓGICA DE AUTENTICACIÓN ---------
  const handleLoginStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const res = await loginStep1(emailInput, passwordInput);
      if (res.success) {
        setLoginStep("otp");
      } else {
        setAuthError(res.error || "Error al iniciar sesión.");
      }
    } catch (err) {
      setAuthError("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      const res = await loginStep2(otpInput);
      if (res.success) {
        setIsAuthenticated(true);
        // EJECUTAR LIMPIEZA AUTOMÁTICA AL INICIAR SESIÓN
        try {
          await cleanupExpiredOrders();
        } catch (cleanErr) {
          console.error("Error al limpiar órdenes expiradas:", cleanErr);
        }
        // Cargar datos
        const { data: prodData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (prodData) setProducts(prodData as Product[]);
        const { data: ordData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (ordData) setOrders(ordData);
      } else {
        setAuthError(res.error || "Código de verificación incorrecto.");
      }
    } catch (err) {
      setAuthError("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      const res = await recoveryStep1(emailInput);
      if (res.success) {
        setLoginStep("recovery_otp");
      } else {
        setAuthError(res.error || "Error al solicitar recuperación.");
      }
    } catch (err) {
      setAuthError("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!newPassword || newPassword.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await recoveryStep2(otpInput, newPassword);
      if (res.success) {
        setSuccessMessage("Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión.");
        setLoginStep("credentials");
        setPasswordInput("");
        setOtpInput("");
        setNewPassword("");
      } else {
        setAuthError(res.error || "Código de verificación incorrecto.");
      }
    } catch (err) {
      setAuthError("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setLoginStep("credentials");
    setPasswordInput("");
    setOtpInput("");
  };

  // --------- RECUPERAR DATOS ---------
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else if (data) {
      setProducts(data as Product[]);
    }
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const refreshData = () => {
    if (activeTab === "products") fetchProducts();
    else fetchOrders();
  };

  const parseAddress = (fullAddress: string) => {
    if (!fullAddress) return { address: "", email: "", docType: "Boleta", details: "" };
    
    const parts = fullAddress.split(" | ");
    const address = parts[0] || "";
    let email = "";
    let docType = "Boleta";
    let details = "";

    parts.forEach(part => {
      if (part.startsWith("Correo: ")) {
        email = part.replace("Correo: ", "");
      } else if (part.startsWith("Tipo Doc: ")) {
        const docStr = part.replace("Tipo Doc: ", "");
        if (docStr.includes("Factura")) {
          docType = "Factura";
          const match = docStr.match(/\(([^)]+)\)/);
          if (match && match[1]) {
            details = match[1];
          }
        }
      }
    });

    return { address, email, docType, details };
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert("Error al actualizar la orden: " + err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta orden? Se le enviará un correo de notificación de cancelación al cliente de forma automática.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await deleteOrderAndNotify(orderId);
      if (res.success) {
        alert("Orden eliminada y cliente notificado.");
        fetchOrders();
      } else {
        alert("Error al eliminar la orden: " + res.error);
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --------- CREAR PRODUCTO ---------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, selectedFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error: dbError } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            description: newProduct.description,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock),
            category: newProduct.category || "General",
            image_url: finalImageUrl
          }
        ]);

      if (dbError) throw dbError;

      alert("Producto creado exitosamente");
      setNewProduct({ name: "", description: "", price: "", stock: "", category: "" });
      setSelectedFile(null);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert("Error creando producto: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------- EDITAR PRODUCTO ---------
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      description: p.description || "",
      price: p.price.toString(),
      stock: p.stock.toString(),
      category: p.category || "General",
    });
    setEditFile(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);

    try {
      let finalImageUrl = editingProduct.image_url;

      if (editFile) {
        const fileExt = editFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, editFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`No se pudo subir la nueva foto: ${uploadError.message}`);
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { data: updatedData, error: dbError } = await supabase
        .from("products")
        .update({
          name: editForm.name,
          description: editForm.description,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          category: editForm.category,
          image_url: finalImageUrl
        })
        .eq("id", editingProduct.id)
        .select();

      if (dbError) throw dbError;
      if (!updatedData || updatedData.length === 0) {
        throw new Error("Permiso denegado por la Base de Datos. Ejecuta la política SQL de UPDATE en la tabla products.");
      }

      alert("Producto actualizado exitosamente");
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert("Error actualizando producto: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------- BORRAR PRODUCTO ---------
  const handleDeleteProduct = async (id: string, image_url: string | null) => {
    if (!confirm("¿Estás seguro de que deseas borrar este producto permanentemente?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      alert("Producto eliminado.");
      fetchProducts();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent mb-4" />
        <p className="text-gray-500 text-sm font-medium">Validando sesión administrativa...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent"></div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-brand-accent" />
            </div>
          </div>
          
          {/* VISTA CREDENCIALES DE LOGIN */}
          {loginStep === "credentials" && (
            <>
              <h1 className="text-2xl font-bold text-center text-brand-primary mb-2">Panel Administrativo</h1>
              <p className="text-gray-500 text-center text-sm mb-6">Gestiona productos, stock y órdenes de clientes.</p>
              
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl font-medium leading-relaxed">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleLoginStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Usuario / Correo</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {authError && <p className="text-red-500 text-sm mt-2 font-medium">{authError}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 mt-2 bg-brand-accent hover:bg-brand-accent-dark border-brand-accent">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar al Tablero"}
                </Button>
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginStep("recovery_email");
                      setAuthError("");
                      setSuccessMessage("");
                    }}
                    className="text-xs font-semibold text-brand-accent hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            </>
          )}

          {/* VISTA CÓDIGO OTP (2FA) */}
          {loginStep === "otp" && (
            <>
              <h1 className="text-2xl font-bold text-center text-brand-primary mb-2">Código de Verificación</h1>
              <p className="text-gray-500 text-center text-sm mb-6">Hemos enviado un código de acceso a tu correo.</p>
              
              <form onSubmit={handleLoginStep2} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Código de 6 Dígitos</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpInput}
                      onChange={(e) => {
                        setOtpInput(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full text-center tracking-[0.5em] text-lg font-mono py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  {authError && <p className="text-red-500 text-sm mt-2 font-medium">{authError}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 mt-2 bg-brand-accent hover:bg-brand-accent-dark border-brand-accent">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verificar e Ingresar"}
                </Button>
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginStep("credentials");
                      setAuthError("");
                      setOtpInput("");
                    }}
                    className="text-xs font-semibold text-gray-400 hover:text-brand-primary"
                  >
                    Volver al ingreso
                  </button>
                </div>
              </form>
            </>
          )}

          {/* VISTA SOLICITUD DE RECUPERACIÓN */}
          {loginStep === "recovery_email" && (
            <>
              <h1 className="text-2xl font-bold text-center text-brand-primary mb-2">Recuperar Clave</h1>
              <p className="text-gray-500 text-center text-sm mb-6">Ingresa tu correo para recibir un código de recuperación.</p>
              
              <form onSubmit={handleRecoveryStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Correo Administrador</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {authError && <p className="text-red-500 text-sm mt-2 font-medium">{authError}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 mt-2 bg-brand-accent hover:bg-brand-accent-dark border-brand-accent">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Código"}
                </Button>
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginStep("credentials");
                      setAuthError("");
                    }}
                    className="text-xs font-semibold text-gray-400 hover:text-brand-primary"
                  >
                    Volver al ingreso
                  </button>
                </div>
              </form>
            </>
          )}

          {/* VISTA RESET DE CLAVE CON OTP */}
          {loginStep === "recovery_otp" && (
            <>
              <h1 className="text-2xl font-bold text-center text-brand-primary mb-2">Restablecer Clave</h1>
              <p className="text-gray-500 text-center text-sm mb-6">Ingresa el código enviado y tu nueva contraseña.</p>
              
              <form onSubmit={handleRecoveryStep2} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Código de 6 Dígitos</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value);
                      setAuthError("");
                    }}
                    className="w-full text-center tracking-[0.5em] text-sm font-mono py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 caracteres"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100"
                    />
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {authError && <p className="text-red-500 text-sm mt-2 font-medium">{authError}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 mt-2 bg-brand-accent hover:bg-brand-accent-dark border-brand-accent">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Nueva Contraseña"}
                </Button>
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginStep("credentials");
                      setAuthError("");
                      setOtpInput("");
                      setNewPassword("");
                    }}
                    className="text-xs font-semibold text-gray-400 hover:text-brand-primary"
                  >
                    Volver al ingreso
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-100 py-6 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <PackagePlus className="w-8 h-8 text-brand-accent" />
              Centro de Control
            </h1>
            <p className="text-gray-500 mt-1">Sincronizado con la base de datos central local.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* TABS NAVEGACIÓN */}
      <div className="bg-white border-b border-gray-100 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "products" ? "border-brand-accent text-brand-accent" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              <PackagePlus className="w-4 h-4" />
              Catálogo de Productos
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "orders" ? "border-brand-accent text-brand-accent" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              <ShoppingBag className="w-4 h-4" />
              Órdenes de Clientes
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- PESTAÑA: PRODUCTOS --- */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORMULARIO */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  Nuevo Producto
                </h2>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Nombre</label>
                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" placeholder="Ej: Plumilla 20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Descripción (Opcional)</label>
                    <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm resize-none text-slate-900" placeholder="Descripción breve" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Precio Venta</label>
                      <input required type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" placeholder="$ CLP" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Stock Real</label>
                      <input required type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" placeholder="Cant." />
                      <p className="text-[10px] text-gray-400 mt-1">Stock 0 es "A Pedido"</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Categoría</label>
                    <input required type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" placeholder="Ej: Automotriz" />
                  </div>
                  <div className="pt-2">
                    <label className="flex text-xs font-medium text-slate-900 mb-2 justify-between items-center">
                      <span>Foto del producto</span>
                      {selectedFile && <span className="text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full text-[10px]">Archivo listo</span>}
                    </label>
                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <ImageIcon className={`w-8 h-8 ${selectedFile ? 'text-brand-accent' : 'text-gray-300 group-hover:text-brand-accent'}`} />
                        <span className="text-sm font-medium text-gray-500">
                          {selectedFile ? selectedFile.name : "Click o arrastra tu foto aquí"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                      {isSubmitting ? <span className="animate-pulse">Guardando...</span> : "Crear y Publicar Producto"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Catálogo Actual ({products.length})</h2>
                  <button onClick={refreshData} className="p-2 text-gray-400 hover:text-slate-900 rounded-lg transition-colors border border-transparent" title="Refrescar lista">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-accent' : ''}`} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-brand-accent animate-spin" /></div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 opacity-20 mb-3" />
                      <p>No hay productos en tu base de datos.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 font-medium">Miniatura</th>
                          <th className="px-6 py-4 font-medium max-w-[200px]">Producto</th>
                          <th className="px-6 py-4 font-medium">Precio</th>
                          <th className="px-6 py-4 font-medium">Stock</th>
                          <th className="px-6 py-4 font-medium text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                {p.image_url ? <img src={p.image_url} alt="img" className="w-full h-full object-contain p-1 mix-blend-multiply" /> : <ImageIcon className="w-4 h-4 text-gray-300" />}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="font-semibold text-slate-900 truncate max-w-[150px]">{p.name}</div>
                              <div className="text-xs text-gray-400">{p.category}</div>
                            </td>
                            <td className="px-6 py-3 font-medium text-gray-700">${p.price.toLocaleString("es-CL")}</td>
                            <td className="px-6 py-3">
                              {p.stock > 0 ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-200">{p.stock}</span>
                              ) : (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-200">A Pedid.</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button onClick={() => openEditModal(p)} className="p-2 text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors mr-2" title="Editar">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id, p.image_url)} className="p-2 text-gray-300 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Borrar">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA: ORDENES --- */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-slate-900">Órdenes a Coordinar ({orders.length})</h2>
              <button onClick={refreshData} className="p-2 text-gray-400 hover:text-slate-900 rounded-lg transition-colors border border-transparent" title="Refrescar órdenes">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-accent' : ''}`} />
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-brand-accent animate-spin" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 opacity-20 mb-3" />
                  <p>No hay órdenes registradas por el momento.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fecha</th>
                      <th className="px-6 py-4 font-medium">Cliente</th>
                      <th className="px-6 py-4 font-medium">Ubicación / Entrega</th>
                      <th className="px-6 py-4 font-medium">Monto</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(o.created_at).toLocaleDateString("es-CL", { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{o.customer_name}</div>
                          <div className="text-xs text-gray-400 font-medium">📞 {o.customer_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const parsed = parseAddress(o.customer_address);
                            return (
                              <div className="space-y-1">
                                <div className="font-medium text-gray-800">{o.customer_city}</div>
                                <div className="text-xs text-gray-500 max-w-[250px] truncate" title={parsed.address}>
                                  {parsed.address}
                                </div>
                                {parsed.email && (
                                  <div className="text-[11px] text-brand-primary/80 flex items-center gap-1 font-medium">
                                    <Mail className="w-3 h-3 text-brand-accent shrink-0" /> {parsed.email}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {o.customer_city?.toLowerCase() === "puerto varas" ? (
                                    <span className="text-[9px] font-bold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded uppercase">Envío Gratis</span>
                                  ) : (
                                    <span className="text-[9px] font-bold bg-orange-50 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded uppercase">Por Pagar</span>
                                  )}
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                    parsed.docType === "Factura" 
                                      ? "bg-purple-50 text-purple-700 border-purple-200" 
                                      : "bg-teal-50 text-teal-700 border-teal-200"
                                  }`}>
                                    SII: {parsed.docType}
                                  </span>
                                </div>
                                {parsed.docType === "Factura" && parsed.details && (
                                  <div className="text-[10px] bg-purple-50/50 text-purple-900/90 p-1.5 rounded-lg border border-purple-100 max-w-[250px] whitespace-normal leading-tight font-sans">
                                    <strong>Detalles Factura:</strong> {parsed.details}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          ${Number(o.total_amount).toLocaleString("es-CL")}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold border ${
                            o.status === "paid" 
                              ? "bg-green-100 text-green-700 border-green-200" 
                              : o.status === "pending_transfer" 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}>
                            {o.status === "pending_transfer" ? "TRANSFERENCIA PENDIENTE" : o.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(() => {
                            const parsed = parseAddress(o.customer_address);
                            return (
                              <div className="flex justify-end items-center gap-1.5 sm:gap-2">
                                {o.status !== "paid" && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.id, "paid")}
                                    className="px-2 py-1.5 sm:px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                                    title="Marcar orden como pagada / completada"
                                  >
                                    <Check className="w-3.5 h-3.5 shrink-0" />
                                    <span className="hidden lg:inline">Confirmar Pago</span>
                                  </button>
                                )}
                                <a
                                  href={parsed.email 
                                    ? `mailto:${parsed.email}?subject=${encodeURIComponent(
                                        `Documento Tributario de tu compra en Soluciones DyS`
                                      )}&body=${encodeURIComponent(
                                        `Hola ${o.customer_name},\n\n¡Muchas gracias por comprar en Soluciones DyS!\n\nAdjunto en este correo encontrarás tu ${
                                          parsed.docType
                                        } correspondiente a tu compra.\n\nDetalle de la orden:\n- Orden ID: ${
                                          o.id
                                        }\n- Total: $${Number(o.total_amount).toLocaleString("es-CL")}\n\nQuedamos a tu entera disposición.\n\nAtentamente,\nEquipo Soluciones DyS\nsandracydiegoc@gmail.com`
                                      )}`
                                    : `mailto:?subject=${encodeURIComponent(
                                        `Documento Tributario de tu compra en Soluciones DyS`
                                      )}&body=${encodeURIComponent(
                                        `Hola ${o.customer_name},\n\n¡Muchas gracias por comprar en Soluciones DyS!\n\nAdjunto en este correo encontrarás tu Boleta correspondiente a tu compra.\n\nDetalle de la orden:\n- Orden ID: ${
                                          o.id
                                        }\n- Total: $${Number(o.total_amount).toLocaleString("es-CL")}\n\nQuedamos a tu entera disposición.\n\nAtentamente,\nEquipo Soluciones DyS\nsandracydiegoc@gmail.com`
                                      )}`
                                  }
                                  className="px-2 py-1.5 sm:px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title={`Enviar ${parsed.docType} al correo del cliente`}
                                >
                                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="hidden lg:inline">Enviar {parsed.docType}</span>
                                </a>
                                <button
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="px-2 py-1.5 sm:px-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title="Eliminar orden y notificar por correo"
                                >
                                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                  <span className="hidden lg:inline">Borrar</span>
                                </button>
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-brand-accent" />
                Editar Producto
              </h2>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Nombre</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Descripción</label>
                <textarea rows={2} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm resize-none text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Precio</label>
                  <input required type="number" min="0" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Stock</label>
                  <input required type="number" min="0" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Categoría</label>
                <input required type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-slate-900" />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Cambiar Foto (Opcional)</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50 transition-colors group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setEditFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <ImageIcon className={`w-6 h-6 ${editFile ? 'text-brand-accent' : 'text-gray-300'}`} />
                    <span className="text-xs font-medium text-gray-500">
                      {editFile ? editFile.name : "Subir nueva foto"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button type="button" onClick={() => setEditingProduct(null)} className="flex-1 justify-center bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 justify-center" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Actualizar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
