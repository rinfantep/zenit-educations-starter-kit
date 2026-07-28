Zenith Education — Fase 6: Layout Shell Responsivo

En este paso hemos integrado el App Shell Layout, proporcionando una navegación consistente para todos los módulos del SaaS.

1. Novedades Integradas:

Sidebar Dinámico: Menú lateral responsivo con resaltado de ruta activa (usePathname), selector multi-tenant y cierre automático en dispositivos móviles.

Top Header: Barra superior con switch de tema Claro/Oscuro (next-themes), barra de búsqueda global y notificaciones.

Modularidad: El interior (app/dashboard/page.tsx) se renderiza dentro del contenedor de app/dashboard/layout.tsx.

2. Probar la Navegación y Compilación:

Ejecuta el entorno de desarrollo:

pnpm dev


Entra a http://localhost:3000/dashboard en tu navegador.

Observa la transición del tema claro/oscuro.

Prueba colapsar el menú en pantalla pequeña (Mobile drawer).

Verifica la compilación estricta de producción:

pnpm build
