import Link from "next/link";

// TODO(diego): hacer revisar este texto por un abogado antes de darlo por definitivo.
const LAST_UPDATED = "9 de octubre de 2026";

export default function TerminosPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold text-brand-primary">
            Términos y Condiciones de Servicio
          </h1>
          <p className="text-sm text-gray-500">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p>
            Estos términos regulan el uso del sitio web solucionesdys.cl y la
            contratación de los servicios de diseño y desarrollo web que ofrece
            Soluciones DyS SpA. Se rigen por las leyes de la República de Chile,
            en especial la Ley N° 19.496 sobre Protección de los Derechos de los
            Consumidores, la Ley N° 17.336 sobre Propiedad Intelectual y la
            normativa de protección de datos personales (Ley N° 19.628 y Ley N°
            21.719).
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">1. Quiénes somos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Razón social:</strong> Soluciones DyS SpA</li>
              <li><strong>RUT:</strong> 78.152.735-1</li>
              <li><strong>Domicilio:</strong> Puerto Varas, Región de Los Lagos, Chile</li>
              <li><strong>Correo de contacto:</strong> contacto@solucionesdys.cl</li>
              <li><strong>Teléfono / WhatsApp:</strong> +56 9 4763 7541</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">2. Aceptación de estos términos</h2>
            <p>
              Al navegar por este sitio aceptas estos términos en lo que se refiere
              al uso del sitio. Al aceptar una cotización nuestra, aceptas además las
              condiciones de contratación de las secciones 4 a 11. Si no estás de
              acuerdo con ellos, te pedimos no usar el sitio ni contratar nuestros
              servicios.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">3. Uso del sitio web</h2>
            <p>
              El contenido de este sitio (textos, guías del blog, secciones de
              Aprende IA y Comunidad) es informativo. Puedes usarlo para fines
              personales y no comerciales. No está permitido:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>usar el sitio para fines ilícitos o que afecten derechos de terceros;</li>
              <li>intentar acceder sin autorización a áreas restringidas, como el panel de administración;</li>
              <li>enviar mensajes masivos, automatizados o con contenido malicioso a través del formulario de contacto;</li>
              <li>copiar o reproducir el contenido del sitio con fines comerciales sin nuestra autorización escrita.</li>
            </ul>
            <p>
              La información de servicios farmacéuticos de la sección Comunidad
              proviene de fuentes públicas. Hacemos lo posible por mantenerla al día,
              pero te recomendamos confirmarla directamente con la farmacia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">4. Servicios y cotizaciones</h2>
            <p>
              Cada proyecto se define en una cotización escrita que indica el alcance
              del trabajo, los entregables, el precio, la forma y los plazos de pago,
              los plazos estimados de entrega y su vigencia. El contrato queda
              celebrado cuando aceptas la cotización por escrito, ya sea por correo
              electrónico, WhatsApp u otro medio que deje constancia.
            </p>
            <p>
              La información del sitio sobre servicios, incluidos los rangos de
              precio que aparezcan en el blog, es referencial y no constituye una
              oferta. Lo que vale para tu proyecto es lo que indique tu cotización.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">5. Precios y pagos</h2>
            <p>
              Los precios se expresan en pesos chilenos. La forma de pago, los
              montos de cada cuota y sus fechas se establecen en cada cotización,
              que además indica si el precio incluye impuestos.
            </p>
            <p>
              Si un pago acordado no se realiza en la fecha indicada, podremos
              suspender el trabajo hasta que se regularice, y los plazos de entrega
              se extenderán por el mismo tiempo que dure la suspensión.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">6. Plazos y colaboración del cliente</h2>
            <p>
              Los plazos de entrega son estimados y dependen de que nos entregues a
              tiempo lo necesario para avanzar: textos, imágenes, logotipos, accesos
              y aprobaciones. Si esa información llega con retraso, el plazo se
              extiende en la misma medida.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">7. Cambios y trabajos adicionales</h2>
            <p>
              Los ajustes que estén dentro del alcance descrito en la cotización
              están incluidos. Las funciones, páginas o cambios que queden fuera de
              ese alcance se cotizan por separado antes de realizarlos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">8. Propiedad intelectual</h2>
            <p>
              <strong>Contenido de este sitio.</strong> Los textos, diseños, marcas y
              demás elementos de solucionesdys.cl pertenecen a Soluciones DyS SpA o a
              sus respectivos titulares y están protegidos por la Ley N° 17.336.
            </p>
            <p>
              <strong>Tu proyecto.</strong> Una vez pagado el total del proyecto,
              adquieres los derechos patrimoniales sobre el diseño y el código
              desarrollados específicamente para ti. Hasta ese momento, los derechos
              se mantienen en Soluciones DyS SpA.
            </p>
            <p>
              Esta cesión no incluye los componentes de terceros que formen parte
              del sitio (tipografías, bibliotecas de código abierto, servicios o
              plugins externos), que se rigen por sus propias licencias, ni las
              herramientas y conocimientos generales que usamos en todos nuestros
              proyectos.
            </p>
            <p>
              <strong>Portafolio.</strong> Podemos mostrar tu sitio terminado en
              nuestro portafolio y en nuestras redes, salvo que nos pidas por
              escrito que no lo hagamos.
            </p>
            <p>
              <strong>Material que nos entregas.</strong> Declaras que tienes los
              derechos sobre los textos, imágenes y marcas que nos entregas para tu
              proyecto, y que podemos usarlos para construirlo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">9. Dominio, hosting y mantenimiento</h2>
            <p>
              El dominio de tu sitio se registra a tu nombre. El hosting, el
              mantenimiento y los cambios posteriores a la publicación se contratan
              según lo que indique cada cotización. Los servicios de terceros, como
              registradores de dominio, proveedores de hosting o pasarelas de pago,
              se rigen además por los términos de cada proveedor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">10. Alcance de nuestra responsabilidad</h2>
            <p>
              Construimos cada sitio con buenas prácticas de velocidad y
              posicionamiento, pero no podemos garantizar una posición específica en
              Google ni resultados comerciales determinados, porque dependen de
              factores que no controlamos, como la competencia o los cambios en los
              buscadores.
            </p>
            <p>
              Tampoco respondemos por fallas o interrupciones de servicios de
              terceros (hosting, dominio, pasarelas de pago, redes sociales) ni por
              cambios que tú o terceros hagan en el sitio después de la entrega.
            </p>
            <p>
              Nada de lo anterior limita los derechos que la ley te reconoce como
              consumidor, que son irrenunciables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">11. Tus derechos como consumidor</h2>
            <p>
              Si contratas como persona natural para un fin no profesional, o como
              micro o pequeña empresa en los casos que contempla el Estatuto Pyme
              (Ley N° 20.416), te protegen las disposiciones de la Ley N° 19.496,
              incluido el derecho de retracto en los casos y plazos que establece su
              artículo 3 bis. Puedes además recurrir al Servicio Nacional del
              Consumidor (SERNAC).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">12. Datos personales</h2>
            <p>
              El tratamiento de los datos que nos entregas se explica en nuestra{" "}
              <Link
                href="/privacidad"
                className="text-brand-accent-dark underline underline-offset-2 hover:text-brand-primary"
              >
                Política de Privacidad y Cookies
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">13. Enlaces a otros sitios</h2>
            <p>
              Este sitio incluye enlaces a sitios de terceros, como los de nuestros
              clientes o fuentes de noticias. No somos responsables de su contenido
              ni de sus políticas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">14. Cambios a estos términos</h2>
            <p>
              Podemos actualizar estos términos para reflejar cambios en nuestros
              servicios o en la ley. La versión vigente es la publicada en esta
              página, con su fecha de actualización. Los proyectos ya contratados se
              rigen por los términos vigentes al aceptar la cotización.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">15. Ley aplicable y tribunales</h2>
            <p>
              Estos términos se rigen por las leyes de la República de Chile.
              Cualquier conflicto se someterá a los tribunales ordinarios de justicia
              con asiento en Puerto Varas, sin perjuicio del derecho del consumidor a
              demandar ante el juzgado de policía local de su domicilio, conforme a
              la Ley N° 19.496.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">16. Contacto</h2>
            <p>
              Si tienes dudas sobre estos términos, escríbenos a
              contacto@solucionesdys.cl o por WhatsApp al +56 9 4763 7541.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
