# Dashboard Next.js con Prisma y PostgreSQL

Sistema completo de gestión con autenticación, dashboard administrativo y gestión de usuarios.

## 🚀 Características

- **Autenticación completa**: Login y registro con NextAuth.js
- **Dashboard responsive**: Menú lateral adaptable a móviles
- **Gestión de perfiles**: Los usuarios pueden modificar su información
- **Panel de administración**: CRUD completo de usuarios (solo para admins)
- **Roles de usuario**: Sistema de permisos con roles `user` y `admin`
- **UI moderna**: Diseño profesional con Tailwind CSS

## 🛠️ Tecnologías

- **Next.js 14+** con App Router
- **TypeScript** para tipado estático
- **Prisma** como ORM
- **PostgreSQL** como base de datos
- **NextAuth.js v5** para autenticación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos

## 📋 Requisitos previos

- Node.js 18+ instalado
- PostgreSQL instalado y en ejecución
- npm o yarn

## ⚙️ Configuración

### 1. Configurar base de datos

Edita el archivo `.env` con tu conexión a PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db?schema=public"
NEXTAUTH_SECRET="tu-secret-key-muy-segura"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Generar el cliente de Prisma y ejecutar migraciones

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Crear un usuario administrador (opcional)

Puedes crear un usuario admin manualmente en la base de datos o usar Prisma Studio:

```bash
npx prisma studio
```

Luego crea un usuario con `role: "admin"` y una contraseña hasheada con bcrypt.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del proyecto

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # Rutas de NextAuth
│   │   └── user/                   # API endpoints para usuarios
│   ├── dashboard/
│   │   ├── profile/                # Gestión de perfil
│   │   ├── users/                  # Gestión de usuarios (admin)
│   │   ├── layout.tsx              # Layout del dashboard
│   │   └── page.tsx                # Página principal del dashboard
│   ├── login/                      # Página de login
│   ├── register/                   # Página de registro
│   └── page.tsx                    # Página de inicio pública
├── components/
│   ├── Sidebar.tsx                 # Menú lateral del dashboard
│   └── SessionProvider.tsx         # Provider de sesión
├── lib/
│   ├── prisma.ts                   # Cliente de Prisma
│   └── actions.ts                  # Server actions
├── prisma/
│   └── schema.prisma               # Esquema de base de datos
├── auth.ts                         # Configuración de NextAuth
├── auth.config.ts                  # Config adicional de auth
└── middleware.ts                   # Middleware de protección de rutas
```

## 🔐 Roles y permisos

- **Usuario**: Puede acceder al dashboard y editar su perfil
- **Admin**: Tiene acceso completo, incluyendo la gestión de todos los usuarios

## 🎨 Páginas disponibles

- `/` - Página de inicio pública
- `/login` - Iniciar sesión
- `/register` - Crear cuenta
- `/dashboard` - Panel principal (requiere autenticación)
- `/dashboard/profile` - Editar perfil
- `/dashboard/users` - Gestión de usuarios (solo admin)

## 🔄 Scripts disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
npx prisma studio    # Abrir Prisma Studio
npx prisma migrate   # Crear nueva migración
```

## 🚨 Notas importantes

1. Cambia `NEXTAUTH_SECRET` en producción por una clave segura
2. Asegúrate de tener PostgreSQL corriendo antes de iniciar la app
3. Las contraseñas se hashean automáticamente con bcrypt
4. El primer usuario debe ser creado como admin manualmente en la base de datos

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

