export type ProjectLink = {
  demo: string;
  github: string;
  info: string;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  features: string[];
  links: ProjectLink;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type PortfolioData = {
  profile: {
    name: string;
    role: string;
    location: string;
    email: string;
    summary: string;
    highlights: string[];
  };
  projects: Project[];
  experience: ExperienceItem[];
  skills: string[];
  socials: SocialLink[];
};

export const portfolioData: PortfolioData = {
  profile: {
    name: "Cris Developer",
    role: "Fullstack Developer",
    location: "México",
    email: "cris@example.com",
    summary:
      "Desarrollador enfocado en construir experiencias web rápidas, accesibles y mantenibles. Me gusta trabajar con arquitectura limpia, interfaces cuidadas y sistemas preparados para crecer.",
    highlights: [
      "Frontend moderno con Astro, Vue y TypeScript.",
      "Backend robusto con PHP, Laravel y APIs REST.",
      "Performance, accesibilidad y buenas prácticas desde el inicio.",
    ],
  },

  projects: [
    {
      id: "conspiracion-moda",
      name: "Conspiración Moda",
      tagline: "Tienda en línea de moda sostenible.",
      description:
        "Plataforma de comercio electrónico para vender ropa sostenible con enfoque en la calidad y el impacto ambiental.",
      stack: ["Astro", "TypeScript", "CSS Grid", "REST API"],
      features: [
        "Widgets reutilizables.",
        "Layout responsive.",
        "Carga diferida de secciones.",
        "Estados vacíos y loading preparados.",
      ],
      links: {
        demo: "https://example.com/demo/conspiracion-moda",
        github: "https://github.com/tuusuario/conspiracion-moda",
        info: "https://example.com/projects/conspiracion-moda",
      },
    },
    {
      id: "Dracma",
      name: "Dracma",
      tagline: "Compra y venta de divisas bilingües.",
      description:
        "Aplicación web para la compra y venta de divisas, con soporte en español e inglés, diseñada para ofrecer una experiencia fluida y segura.",
      stack: ["Vue 3", "TypeScript", "Pinia", "CSS Modules"],
      features: [
        "Drag conceptual de tareas.",
        "Filtros por estado y prioridad.",
        "Persistencia preparada para API.",
        "Componentes desacoplados.",
      ],
      links: {
        demo: "https://example.com/demo/dracma",
        github: "https://github.com/tuusuario/dracma",
        info: "https://example.com/projects/dracma",
      },
    },
    {
      id: "QR3",
      name: "ERP QR3",
      tagline: "Sistema de gestión empresarial para TCDL de México.",
      description:
        "Plataforma ERP para la gestión de procesos internos de TCDL, incluyendo inventarios, ventas y reportes financieros y POS System de cotizaciones.",
      stack: ["Laravel", "Vue 3", "Vite", "Lumen"],
      features: [
        "Módulos desacoplados y reutilizables.",
        "Optimización de performance inicial.",
        "Componentes accesibles y responsivos.",
        "Integración con APIs internas y externas.",
      ],
      links: {
        demo: "https://example.com/demo/qr3",
        github: "https://github.com/tuusuario/qr3",
        info: "https://example.com/projects/qr3",
      },
    },
  ],

  experience: [
    {
      role: "Frontend Developer",
      company: "Studio Digital",
      period: "2024 — Actualidad",
      description:
        "Desarrollo de interfaces web rápidas, componentes reutilizables y sistemas visuales mantenibles.",
      achievements: [
        "Implementación de layouts responsive.",
        "Optimización de performance inicial.",
        "Mejora de accesibilidad en componentes clave.",
      ],
    },
    {
      role: "Fullstack Developer",
      company: "Freelance",
      period: "2022 — 2024",
      description:
        "Construcción de sitios, dashboards y APIs para clientes pequeños y medianos.",
      achievements: [
        "Integración de APIs REST.",
        "Automatización de procesos internos.",
        "Diseño de estructuras escalables para nuevos módulos.",
      ],
    },
  ],

  skills: [
    "Astro",
    "TypeScript",
    "Vue 3",
    "PHP",
    "Laravel",
    "REST APIs",
    "CSS moderno",
    "Accesibilidad",
    "Performance",
    "MySQL",
    "Git",
    "Arquitectura limpia",
  ],

  socials: [
    {
      label: "GitHub",
      href: "https://github.com/tuusuario",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/tuusuario",
    },
    {
      label: "Portfolio",
      href: "https://example.com",
    },
  ],
};