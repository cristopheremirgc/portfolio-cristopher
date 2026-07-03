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
      id: "nova-dashboard",
      name: "Nova Dashboard",
      tagline: "Panel SaaS para métricas de negocio.",
      description:
        "Dashboard modular para visualizar KPIs, actividad reciente, ventas y rendimiento operativo usando una arquitectura frontend limpia y componentes reutilizables.",
      stack: ["Astro", "TypeScript", "CSS Grid", "REST API"],
      features: [
        "Widgets reutilizables.",
        "Layout responsive.",
        "Carga diferida de secciones.",
        "Estados vacíos y loading preparados.",
      ],
      links: {
        demo: "https://example.com/demo/nova-dashboard",
        github: "https://github.com/tuusuario/nova-dashboard",
        info: "https://example.com/projects/nova-dashboard",
      },
    },
    {
      id: "taskflow",
      name: "TaskFlow",
      tagline: "Gestión visual de tareas tipo kanban.",
      description:
        "Aplicación de productividad orientada a equipos pequeños. Incluye tableros, columnas, tarjetas, filtros y una experiencia responsive para desktop y móvil.",
      stack: ["Vue 3", "TypeScript", "Pinia", "CSS Modules"],
      features: [
        "Drag conceptual de tareas.",
        "Filtros por estado y prioridad.",
        "Persistencia preparada para API.",
        "Componentes desacoplados.",
      ],
      links: {
        demo: "https://example.com/demo/taskflow",
        github: "https://github.com/tuusuario/taskflow",
        info: "https://example.com/projects/taskflow",
      },
    },
    {
      id: "orbit-commerce",
      name: "Orbit Commerce",
      tagline: "Landing e-commerce rápida y optimizada.",
      description:
        "Sitio de comercio con enfoque en velocidad, SEO, accesibilidad y conversión. Ideal para mostrar productos, beneficios, testimonios y llamadas a la acción.",
      stack: ["Astro", "TypeScript", "Vanilla CSS", "Islands Architecture"],
      features: [
        "HTML estático optimizado.",
        "Componentes interactivos aislados.",
        "CSS moderno sin framework pesado.",
        "Buenas prácticas SEO.",
      ],
      links: {
        demo: "https://example.com/demo/orbit-commerce",
        github: "https://github.com/tuusuario/orbit-commerce",
        info: "https://example.com/projects/orbit-commerce",
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