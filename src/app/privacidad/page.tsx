const LAST_UPDATED = "2 de octubre de 2026";

export default function PrivacidadPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold text-brand-primary">
            Política de Privacidad y Cookies
          </h1>
          <p className="text-sm text-gray-500">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p>
            En Soluciones DyS SpA respetamos tu privacidad y nos comprometemos a
            proteger los datos personales que nos entregas al usar este sitio web.
            Esta política explica qué información recopilamos, para qué la usamos,
            con quién la compartimos y cómo puedes ejercer tus derechos, en línea
            con la Ley N° 19.628 sobre Protección de la Vida Privada y su
            actualización, la Ley N° 21.719 sobre Protección de Datos Personales.
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">1. Responsable del tratamiento</h2>
            <p>
              El responsable de los datos personales recopilados a través de este
              sitio es:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Razón social:</strong> Soluciones DyS SpA</li>
              <li><strong>RUT:</strong> 78.152.735-1</li>
              <li><strong>Domicilio:</strong> Puerto Varas, Chile</li>
              <li><strong>Correo de contacto:</strong> contacto@solucionesdys.cl</li>
              <li><strong>Teléfono / WhatsApp:</strong> +56 9 4763 7541</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">2. Qué datos recopilamos</h2>
            <p>Recopilamos datos personales en dos situaciones:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Formulario de contacto:</strong> cuando nos escribes desde la
                página de Contacto, guardamos tu nombre, correo electrónico, teléfono
                (si lo indicas), motivo de contacto y el mensaje que nos envías. Junto
                con ellos registramos datos técnicos mínimos: la página del sitio desde
                la que llegaste, la campaña de origen si viniste desde un anuncio o
                enlace etiquetado (parámetros <em>utm</em>), el tipo de navegador
                (<em>user agent</em>) y un código cifrado de tu dirección IP (un hash
                irreversible con sal; nunca guardamos la IP en claro).
              </li>
              <li>
                <strong>Datos de navegación (solo con tu autorización):</strong> si
                aceptas las cookies analíticas, recopilamos de forma agregada
                información sobre cómo usas el sitio (páginas visitadas, tiempo de
                permanencia, tipo de dispositivo) a través de Microsoft Clarity.
              </li>
            </ul>
            <p>No solicitamos ni almacenamos datos bancarios, de pago ni contraseñas en este sitio.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">3. Para qué usamos tus datos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Responder tus consultas y cotizaciones a través del formulario de contacto o WhatsApp.</li>
              <li>
                Llevar un registro ordenado de las consultas recibidas y su estado
                (nueva, contactada, cerrada), para no perder ninguna.
              </li>
              <li>
                Prevenir spam y abuso del formulario (verificación anti-robots y
                límite de envíos por dirección IP).
              </li>
              <li>Saber qué páginas y campañas nos traen consultas, para mejorar el sitio.</li>
              <li>Comunicarnos contigo respecto de un proyecto o servicio solicitado.</li>
              <li>
                Entender cómo se usa el sitio y mejorarlo (solo si aceptas cookies
                analíticas).
              </li>
            </ul>
            <p>No vendemos ni cedemos tus datos personales a terceros con fines comerciales.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">4. Base legal</h2>
            <p>
              Tratamos tus datos con base en tu <strong>consentimiento expreso</strong>,
              otorgado al completar voluntariamente el formulario de contacto o al
              aceptar las cookies analíticas mediante el banner que se muestra en tu
              primera visita. Puedes retirar tu consentimiento en cualquier momento
              (ver sección 9).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">5. Cookies que utilizamos</h2>
            <p>Clasificamos las cookies de este sitio en dos categorías:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4 font-semibold text-brand-primary">Categoría</th>
                    <th className="py-2 pr-4 font-semibold text-brand-primary">Finalidad</th>
                    <th className="py-2 font-semibold text-brand-primary">¿Requiere tu autorización?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 align-top">Esenciales</td>
                    <td className="py-2 pr-4 align-top">
                      Necesarias para el funcionamiento básico del sitio (por ejemplo,
                      recordar tu preferencia de cookies).
                    </td>
                    <td className="py-2 align-top">No</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top">Analíticas</td>
                    <td className="py-2 pr-4 align-top">
                      Microsoft Clarity: nos ayuda a entender cómo se navega el
                      sitio para mejorarlo.
                    </td>
                    <td className="py-2 align-top">Sí</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Además, mientras navegas guardamos en el almacenamiento de sesión de tu
              navegador (que se borra al cerrar la pestaña) la última página que
              visitaste y la campaña de origen, solo para adjuntarlas a tu consulta si
              envías el formulario. No es una cookie y no se comparte con terceros.
            </p>
            <p>
              Puedes aceptar o rechazar las cookies analíticas en cualquier momento
              desde el enlace <strong>&ldquo;Preferencias de Cookies&rdquo;</strong> en el
              pie de página. Si las rechazas, Microsoft Clarity no se cargará en
              tu navegador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">6. Con quién compartimos tus datos</h2>
            <p>Para operar el sitio, algunos datos pasan por proveedores externos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Google (Gmail):</strong> usamos Gmail para recibir los
                mensajes del formulario de contacto.
              </li>
              <li>
                <strong>Microsoft Clarity:</strong> herramienta de análisis de
                comportamiento en el sitio (si aceptas cookies).
              </li>
              <li>
                <strong>Supabase:</strong> base de datos donde guardamos las consultas
                del formulario de contacto.
              </li>
              <li>
                <strong>Resend:</strong> servicio que envía los correos del formulario
                (el aviso interno y la confirmación que recibes).
              </li>
              <li>
                <strong>Cloudflare Turnstile:</strong> verificación anti-robots del
                formulario. Analiza señales técnicas del navegador para distinguir
                personas de bots, sin cookies publicitarias.
              </li>
              <li>
                <strong>Upstash y Vercel:</strong> alojamiento del sitio y control del
                límite de envíos por IP.
              </li>
            </ul>
            <p>
              Estos proveedores procesan datos en servidores que pueden estar fuera
              de Chile (por ejemplo, en Estados Unidos), bajo sus propias políticas
              de privacidad y estándares de seguridad internacionales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">7. Plazo de conservación</h2>
            <p>
              Conservamos las consultas del formulario de contacto (y los datos
              técnicos asociados) por un máximo de <strong>24 meses</strong> desde
              que nos escribes, para responderte y dar seguimiento comercial si
              corresponde. Pasado ese plazo las eliminamos. Puedes pedirnos que las
              borremos antes en cualquier momento (ver sección 9).
            </p>
            <p>
              Los registros del límite de envíos por IP se borran solos a los pocos
              minutos. Los datos analíticos se conservan según los plazos por defecto
              de Microsoft Clarity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">8. Tus derechos</h2>
            <p>
              Tienes derecho a acceder, rectificar, cancelar o eliminar tus datos
              personales, a oponerte a su tratamiento y a solicitar su portabilidad,
              conforme a la legislación chilena vigente. También puedes retirar tu
              consentimiento para el uso de cookies analíticas en cualquier momento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">9. Cómo ejercer tus derechos</h2>
            <p>
              Para ejercer cualquiera de estos derechos, o si tienes preguntas sobre
              esta política, escríbenos a{" "}
              <a href="mailto:contacto@solucionesdys.cl" className="text-brand-accent-dark underline hover:text-brand-primary">
                contacto@solucionesdys.cl
              </a>{" "}
              o contáctanos por WhatsApp al{" "}
              <a href="https://wa.me/56947637541" target="_blank" rel="noopener noreferrer" className="text-brand-accent-dark underline hover:text-brand-primary">
                +56 9 4763 7541
              </a>
              . Responderemos tu solicitud a la brevedad posible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">10. Seguridad de la información</h2>
            <p>
              Aplicamos medidas técnicas razonables para proteger tus datos
              (por ejemplo, conexión cifrada HTTPS, validación de los datos que
              recibimos por el formulario, base de datos sin acceso público y panel
              interno protegido con contraseña). Sin embargo, ningún sistema
              es 100% infalible, por lo que no podemos garantizar seguridad
              absoluta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-primary">11. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política para reflejar cambios en nuestras
              prácticas o en la legislación vigente. Publicaremos cualquier cambio
              en esta misma página junto con la fecha de actualización.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
