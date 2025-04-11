# UnderSounds - Plataforma de Música para Artistas Independientes

UnderSounds es una plataforma completa para artistas musicales independientes y sus seguidores. Permite a los músicos distribuir su música, vender merchandising y conectar con fans, mientras que los oyentes pueden descubrir, comprar y disfrutar música en diversos formatos.

## 🎵 Características principales

### Para oyentes
- **Descubre música**: Explora un catálogo organizado por géneros, artistas y álbumes
- **Escucha**: Reproductor integrado para escuchar música antes de comprar
- **Descarga**: Obtén música en múltiples formatos (MP3, FLAC, WAV)
- **Colecciona**: Crea tu biblioteca personal con tus artistas favoritos
- **Conecta**: Valora, comenta y sigue a tus artistas preferidos

### Para artistas
- **Distribución digital**: Sube y vende tu música directamente a los fans
- **Merchandising**: Vende productos relacionados con tu marca
- **Perfil personalizado**: Cuenta tu historia y conecta con tu audiencia
- **Análisis**: Datos sobre reproducciones, descargas y ventas
- **Pagos directos**: Recibe ingresos de tus ventas de forma transparente

## 🔧 Arquitectura

UnderSounds utiliza el stack MERN completo:

- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express.js
- **Base de datos**: MongoDB
- **Autenticación**: JWT + OAuth2 (Google)
- **Pagos**: Stripe

## 🚀 Instalación y configuración

### Requisitos previos
- Node.js 16.x o superior
- MongoDB 4.4 o superior
- FFmpeg (para conversión de archivos de audio)
- Cuenta en Stripe (para procesamiento de pagos)
- Proyecto registrado en Google Cloud Platform (para OAuth)

### Configuración del proyecto

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/undersounds.git
   cd undersounds
   ```

2. **Configurar el backend**:
   ```bash
   cd undersounds-backend
   npm install
   ```
   
   Crea un archivo `.env` con:
   ```
   MONGO_URI=mongodb://localhost:27017/undersounds
   ACCESS_TOKEN_SECRET=tu_clave_secreta_jwt
   REFRESH_TOKEN_SECRET=otra_clave_secreta_jwt
   SESSION_SECRET=clave_para_sesiones
   GOOGLE_CLIENT_ID=id_de_google_oauth
   GOOGLE_CLIENT_SECRET=secret_de_google_oauth
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   STRIPE_SECRET_KEY=clave_secreta_de_stripe
   ```

   Deberás tener un archivo dbmeta.json y otro dbmeta_local.json, si es tu primera vez al iniciar el servidor el segundo de estos archivos tendrá una versión inferior al otro y por lo tanto se iniciará el proceso de actualización de la BD.

3. **Configurar el frontend**:
   ```bash
   cd ../undersounds-frontend
   npm install
   ```
   
   Crea un archivo `.env` con:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=clave_publica_de_stripe
   ```

4. **Iniciar la aplicación**:
   
   Backend:
   ```bash
   cd undersounds-backend
   node server.js
   ```
   
   Frontend:
   ```bash
   cd undersounds-frontend
   npm start
   ```

5. **Acceder a la aplicación**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Documentación API: http://localhost:5000/api-docs

## 📂 Estructura del proyecto

```
undersounds/
├── undersounds-frontend/       # Aplicación React
│   ├── src/
│   │   ├── assets/             # Recursos estáticos 
│   │   ├── components/         # Componentes reutilizables
│   │   ├── context/            # Contextos de React
│   │   ├── pages/              # Páginas principales
│   │   ├── services/           # Servicios de API
│   │   └── utils/              # Utilidades
│   ├── .env                    # Variables de entorno
│   └── package.json            # Dependencias frontend
│
├── undersounds-backend/        # Servidor Node.js/Express
│   ├── config/                 # Configuraciones
│   ├── controller/             # Controladores API
│   ├── docs/                   # Documentación Swagger
│   ├── model/                  # Modelos de datos
│   ├── routes/                 # Rutas API
│   ├── services/               # Servicios
│   ├── utils/                  # Utilidades
│   ├── .env                    # Variables de entorno
│   └── package.json            # Dependencias backend
│
└── README.md                   # Documentación principal
```

## 🧰 Características técnicas destacadas

- **Reproductor de audio personalizado** integrado en toda la aplicación
- **Conversión de formatos de audio** en tiempo real (MP3, FLAC, WAV)
- **Sistema de autenticación avanzado** con JWT, refresh tokens y OAuth
- **Integración con Stripe** para procesamiento seguro de pagos
- **Arquitectura escalable** basada en microservicios y API REST
- **Sistema de búsqueda avanzada** con filtros.

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta sus detalles en Github.

---

© 2025 UnderSounds - Plataforma para música independiente.