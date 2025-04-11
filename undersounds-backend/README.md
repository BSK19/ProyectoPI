Collecting workspace information# UnderSounds Backend

El backend de UnderSounds proporciona una API completa para gestionar la plataforma de música, ofreciendo servicios para autenticación, gestión de contenido musical, procesamiento de pagos y más.

## Funcionalidades principales

### Autenticación y Usuarios
- **Registro y login tradicional** con JWT y sistema de refresh tokens
- **Autenticación OAuth con Google** mediante Passport.js
- **Recuperación de contraseña** con sistema de OTP
- **Perfiles de usuario** con distintos roles (fan, banda, sello discográfico)

### Gestión de Contenido Musical
- **Catálogo de música**: álbumes, artistas y pistas
- **Descarga de música** en múltiples formatos (MP3, WAV, FLAC)
- **Conversión de archivos de audio** mediante FFmpeg
- **Integración con Jamendo** para ampliar el catálogo musical

### E-commerce
- **Carrito de compras** para gestionar artículos seleccionados
- **Procesamiento de pagos** mediante Stripe
- **Gestión de merchandising** (camisetas y otros productos)

### Otras funcionalidades
- **Sistema de noticias musicales** (CRUD completo)
- **Documentación automática** con Swagger

## Instalación y configuración

1. **Clonar el repositorio**:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd undersounds-backend
   ```

2. **Instalar dependencias**:
   ```
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` con:
   ```
   MONGO_URI=<URI_DE_MONGODB>
   ACCESS_TOKEN_SECRET=<CLAVE_JWT_ACCESS>
   REFRESH_TOKEN_SECRET=<CLAVE_JWT_REFRESH>
   SESSION_SECRET=<CLAVE_SESIONES>
   GOOGLE_CLIENT_ID=<ID_OAUTH_GOOGLE>
   GOOGLE_CLIENT_SECRET=<SECRET_OAUTH_GOOGLE>
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   STRIPE_SECRET_KEY=<CLAVE_SECRETA_STRIPE>
   ```

4. **Ejecutar el servidor**:
   ```
   npm start
   ```

5. **Acceder a la documentación**:
   Navega a `http://localhost:5000/api-docs` para explorar la API con Swagger.

## Gestión de base de datos

El backend incluye herramientas para importar y exportar datos de MongoDB:

- **Importar datos**:
  ```
  npm run mongoimport
  ```

- **Exportar datos**:
  ```
  npm run mongoexport
  ```

## Endpoints principales

### Autenticación
- `POST /api/auth/register`: Registro de usuarios
- `POST /api/auth/login`: Inicio de sesión
- `POST /api/auth/refresh-token`: Renovación de tokens
- `POST /api/auth/logout`: Cierre de sesión
- `GET /api/auth/google`: Autenticación con Google
- `POST /api/auth/forgot-password`: Solicitud de recuperación
- `POST /api/auth/reset-password`: Restablecimiento con OTP

### Música
- `GET /api/albums`: Obtiene todos los álbumes
- `GET /api/albums/{id}`: Obtiene un álbum específico
- `GET /api/albums/{id}/download`: Descarga una pista en MP3/WAV/FLAC
- `GET /api/albums/{id}/download-album`: Descarga un álbum completo en ZIP

### Artistas
- `GET /api/artists`: Lista de artistas
- `GET /api/artists/{id}`: Información de un artista específico

### Merchandising
- `GET /api/merchandising`: Catálogo de productos
- `GET /api/merchandising/{id}`: Detalles de un producto

### Noticias
- `GET /api/noticias`: Obtener noticias musicales
- `POST /api/noticias`: Crear una noticia

### Pagos
- `POST /create-checkout-session`: Procesa pagos con Stripe

## Tecnologías utilizadas

- **Node.js y Express**: Base del servidor
- **MongoDB y Mongoose**: Base de datos y ODM
- **JWT y Passport**: Autenticación y autorización
- **FFmpeg**: Conversión de formatos de audio
- **Stripe**: Procesamiento de pagos
- **Swagger**: Documentación de API
- **Archiver**: Compresión de archivos para descarga

## Requisitos técnicos

- Node.js 16.x o superior
- MongoDB 4.4 o superior
- FFmpeg (instalado globalmente para conversión de audio)
- Conexión a internet para servicios externos (Stripe, OAuth)

## Estructura del proyecto

```
undersounds-backend/
├── config/              # Configuraciones (DB, Passport)
├── controller/          # Controladores de la API
├── data-dump/           # Datos exportados de MongoDB
├── docs/                # Documentación API (Swagger)
├── model/               # Modelos de datos y DAOs
├── routes/              # Definición de rutas
├── services/            # Servicios (conversión de audio, etc.)
├── utils/               # Utilidades
├── view/                # Vistas HTML (mínimas)
├── .env                 # Variables de entorno (no en repo)
└── server.js            # Punto de entrada