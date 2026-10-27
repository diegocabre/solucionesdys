import WhatsAppIcon from "@/components/WhatsAppIcon";
import { BUSINESS } from "@/lib/site";

// Acceso directo a WhatsApp solo en móvil, donde es el canal principal de contacto.
export default function WhatsAppFlotante() {
  return (
    <a
      href={BUSINESS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="md:hidden fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-dys-primary text-dys-on-primary shadow-lg shadow-dys-bg/40 ring-1 ring-dys-bg/10 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
