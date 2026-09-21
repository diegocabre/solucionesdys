// Contenido de la sección "Aprende IA". Para actualizarlo basta con editar este archivo:
// no hay que tocar los componentes.

export const IA_REVISADO = "septiembre de 2026";

// ── Robot ────────────────────────────────────────────────────────────────────

export interface RobotTema {
  id: string;
  /** Texto del botón bajo el robot. */
  chip: string;
  /** Lo que dice el robot. */
  texto: string;
}

export const ROBOT_NOMBRE = "DyBot";

export const ROBOT_INTRO: RobotTema = {
  id: "intro",
  chip: "Inicio",
  texto:
    "¡Hola! Soy DyBot, el robot de Soluciones DyS. Te cuento de inteligencia artificial sin tecnicismos. Elige un tema y yo te lo explico.",
};

export const ROBOT_TEMAS: RobotTema[] = [
  {
    id: "ia",
    chip: "¿Qué es la IA?",
    texto:
      "La IA generativa es un programa que aprendió de enormes cantidades de texto, imágenes y código. Ahora puede redactar, resumir, traducir o programar cuando se lo pides con palabras normales. No piensa como una persona: predice muy bien lo que viene a continuación, y por eso a veces se equivoca con mucha seguridad. Lo importante, revísalo siempre.",
  },
  {
    id: "agentes",
    chip: "Agentes de IA",
    texto:
      "Antes le hacías una pregunta a la IA y te respondía. Hoy los agentes van más allá: reciben un objetivo, lo dividen en pasos, usan herramientas como tu código o una hoja de cálculo, y revisan su propio trabajo. Tú sigues al mando: apruebas lo importante.",
  },
  {
    id: "claude",
    chip: "Claude Code",
    texto:
      "Claude Code es un asistente de programación de Anthropic. Lee todo tu proyecto, edita archivos, ejecuta comandos y crea commits, desde la terminal, VS Code, la app de escritorio o el navegador. Es la herramienta que más usamos en Soluciones DyS para construir sitios web.",
  },
  {
    id: "negocio",
    chip: "IA en tu negocio",
    texto:
      "En una pyme sirve para responder consultas frecuentes, ordenar información, redactar textos y automatizar tareas repetitivas. Mi consejo: empieza por una tarea pequeña que te quite tiempo, mide el resultado y recién ahí crece.",
  },
  {
    id: "responsable",
    chip: "Uso responsable",
    texto:
      "Tres reglas. Uno: no pegues datos sensibles de tus clientes. Dos: revisa lo que la IA escribe antes de publicarlo. Tres: pide fuentes cuando haya cifras o leyes. La IA ayuda, pero la responsabilidad sigue siendo tuya.",
  },
];

// ── Panorama ─────────────────────────────────────────────────────────────────

export type CategoriaIA = "Agentes" | "Herramientas" | "Modelos" | "Uso responsable";

export const CATEGORIAS_IA: CategoriaIA[] = ["Agentes", "Herramientas", "Modelos", "Uso responsable"];

export interface NovedadIA {
  categoria: CategoriaIA;
  titulo: string;
  resumen: string;
  fuente?: { etiqueta: string; url: string };
}

export const IA_NOVEDADES: NovedadIA[] = [
  {
    categoria: "Agentes",
    titulo: "De responder preguntas a ejecutar tareas",
    resumen:
      "La IA ya no solo conversa: los agentes leen tus archivos, ejecutan comandos y verifican su trabajo. Claude Code es un ejemplo: describes lo que quieres y planifica, escribe el código en varios archivos y comprueba que funcione.",
    fuente: { etiqueta: "Qué es Claude Code", url: "https://code.claude.com/docs/en/overview" },
  },
  {
    categoria: "Agentes",
    titulo: "Varios agentes trabajando en paralelo",
    resumen:
      "Un agente coordinador puede repartir subtareas entre otros agentes y juntar los resultados. También se pueden lanzar sesiones en segundo plano y verlas desde una sola pantalla.",
    fuente: { etiqueta: "Subagentes en Claude Code", url: "https://code.claude.com/docs/en/sub-agents" },
  },
  {
    categoria: "Herramientas",
    titulo: "MCP: un estándar abierto para conectar la IA con tus herramientas",
    resumen:
      "El Model Context Protocol permite que una IA lea documentos en Google Drive, actualice tickets en Jira o consulte Slack sin integraciones a medida para cada caso.",
    fuente: { etiqueta: "MCP en Claude Code", url: "https://code.claude.com/docs/en/mcp" },
  },
  {
    categoria: "Herramientas",
    titulo: "Tareas programadas: la IA trabaja aunque tu computador esté apagado",
    resumen:
      "Las rutinas ejecutan a Claude en la nube según un horario o ante un evento, por ejemplo revisar cambios cada mañana o auditar dependencias cada semana.",
    fuente: { etiqueta: "Rutinas", url: "https://code.claude.com/docs/en/routines" },
  },
  {
    categoria: "Modelos",
    titulo: "Lanzamientos casi semanales",
    resumen:
      "Las grandes empresas de IA publican modelos nuevos con mucha frecuencia (mira las noticias de arriba). Conviene elegir por la tarea que necesitas resolver y no por la moda del mes: modelos grandes para lo complejo, pequeños para lo rápido y económico.",
  },
  {
    categoria: "Uso responsable",
    titulo: "Revisa siempre lo que la IA produce",
    resumen:
      "Puede equivocarse con total seguridad. Cifras, leyes y textos que vas a publicar deben pasar por una persona. Y no compartas datos sensibles de clientes.",
  },
];

// ── Claude Code ──────────────────────────────────────────────────────────────

export type LineaTerminal =
  | { tipo: "usuario"; texto: string }
  | { tipo: "herramienta"; texto: string }
  | { tipo: "claude"; texto: string }
  | { tipo: "ok"; texto: string };

export interface EscenarioTerminal {
  id: string;
  pestana: string;
  lineas: LineaTerminal[];
}

export const ESCENARIOS_TERMINAL: EscenarioTerminal[] = [
  {
    id: "error",
    pestana: "Arreglar un error",
    lineas: [
      { tipo: "usuario", texto: "el menú no abre en el celular, ¿me ayudas?" },
      { tipo: "herramienta", texto: "Leyó src/components/Navbar.tsx" },
      {
        tipo: "claude",
        texto: "El botón sí cambia el estado, pero el menú queda oculto por una clase que solo aplica en escritorio.",
      },
      { tipo: "herramienta", texto: "Editó src/components/Navbar.tsx (+2 −1)" },
      { tipo: "herramienta", texto: "Ejecutó npm run lint" },
      { tipo: "ok", texto: "Listo. Revísalo en el navegador antes de publicar." },
    ],
  },
  {
    id: "pagina",
    pestana: "Crear una página",
    lineas: [
      { tipo: "usuario", texto: "crea una página de contacto con formulario y mapa" },
      { tipo: "claude", texto: "Plan: 1) componente del formulario, 2) la página, 3) validar y probar." },
      { tipo: "herramienta", texto: "Creó src/components/ContactForm.tsx" },
      { tipo: "herramienta", texto: "Creó src/app/contacto/page.tsx" },
      { tipo: "herramienta", texto: "Ejecutó npm run build" },
      { tipo: "ok", texto: "Página creada y compilando sin errores." },
    ],
  },
  {
    id: "entender",
    pestana: "Entender un proyecto",
    lineas: [
      { tipo: "usuario", texto: "explícame cómo está organizado este proyecto" },
      { tipo: "herramienta", texto: "Exploró 24 archivos" },
      {
        tipo: "claude",
        texto:
          "Es una app Next.js: las páginas viven en src/app, los componentes en src/components y la configuración del sitio en src/lib.",
      },
      { tipo: "ok", texto: "¿Quieres que empiece por alguna parte en particular?" },
    ],
  },
];

export interface PasoFlujo {
  titulo: string;
  corto: string;
  detalle: string;
  ejemplo: string;
}

export const PASOS_FLUJO: PasoFlujo[] = [
  {
    titulo: "Tú pides",
    corto: "En lenguaje normal",
    detalle:
      "Describes lo que necesitas como se lo dirías a una persona: un error que ves, una función nueva, una duda sobre el código.",
    ejemplo: "“Agrega un botón de WhatsApp en la página de contacto.”",
  },
  {
    titulo: "Explora",
    corto: "Lee tu proyecto",
    detalle:
      "Antes de tocar nada, busca y lee los archivos relevantes para entender cómo está hecho tu proyecto y seguir tu estilo.",
    ejemplo: "Lee la página de contacto y la configuración del sitio.",
  },
  {
    titulo: "Planifica",
    corto: "Propone los pasos",
    detalle:
      "En tareas grandes propone un plan antes de actuar. Tú lo revisas, lo ajustas o lo apruebas.",
    ejemplo: "“Voy a editar 2 archivos y probar el resultado. ¿Te parece?”",
  },
  {
    titulo: "Actúa",
    corto: "Edita y ejecuta",
    detalle:
      "Edita archivos y ejecuta comandos. Por defecto pide tu permiso antes de hacer cambios o correr algo, y tú decides qué permitir.",
    ejemplo: "Modifica el componente y ejecuta la compilación.",
  },
  {
    titulo: "Verifica",
    corto: "Prueba y corrige",
    detalle:
      "Corre las pruebas o la compilación, lee los errores y ajusta hasta que funcione. Si quieres, también deja el cambio listo en git.",
    ejemplo: "La compilación falló → corrige → vuelve a compilar ✓",
  },
];

export interface CapacidadClaude {
  titulo: string;
  resumen: string;
  detalle: string;
}

export const CAPACIDADES_CLAUDE: CapacidadClaude[] = [
  {
    titulo: "CLAUDE.md",
    resumen: "La memoria del proyecto",
    detalle:
      "Un archivo de texto en la raíz de tu proyecto que Claude lee al empezar cada sesión: tus reglas de estilo, librerías preferidas y decisiones de diseño.",
  },
  {
    titulo: "Skills",
    resumen: "Flujos que se repiten",
    detalle:
      "Paquetes de instrucciones reutilizables, como /review-pr o /deploy-staging, que puedes compartir con tu equipo.",
  },
  {
    titulo: "Hooks",
    resumen: "Acciones automáticas",
    detalle:
      "Comandos que se ejecutan solos antes o después de que Claude haga algo, por ejemplo dar formato al código después de cada edición.",
  },
  {
    titulo: "MCP",
    resumen: "Conecta tus herramientas",
    detalle:
      "Un estándar abierto para que Claude acceda a Google Drive, Jira, Slack o tus propias herramientas.",
  },
  {
    titulo: "Subagentes",
    resumen: "Trabajo en paralelo",
    detalle:
      "Un agente principal reparte partes de una tarea a otros agentes que trabajan a la vez, y luego junta los resultados.",
  },
  {
    titulo: "Rutinas",
    resumen: "Tareas programadas",
    detalle:
      "Ejecuta a Claude según un horario o ante eventos de GitHub, incluso con tu computador apagado. Sirven para revisiones y auditorías periódicas.",
  },
];

export const CLAUDE_CODE_SUPERFICIES = ["Terminal", "VS Code", "App de escritorio", "Navegador", "JetBrains"];
