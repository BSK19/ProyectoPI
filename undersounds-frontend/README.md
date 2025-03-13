# UnderSounds - Tienda de Música en Línea

Bienvenido a UnderSounds, una tienda de música en línea que permite a músicos y bandas lanzar y promocionar su música. Esta plataforma ofrece a los usuarios la posibilidad de explorar, reproducir, comprar y descargar música en diversos formatos digitales.

## Funcionalidades

### General
- Explora un catálogo organizado por géneros, artistas y popularidad.
- Los artistas pueden crear un perfil y gestionar sus canciones y álbumes.
- Descarga música en formatos como MP3, FLAC y WAV.
- Sistema de valoraciones y comentarios para feedback de los usuarios.

### Sistema de Usuarios
- Autenticación mediante OAuth 2.0 (Google, Facebook, etc.).
- Roles de usuario:
  - **Invitados**: Exploran el catálogo sin registro.
  - **Usuarios registrados**: Compran música, dejan comentarios y valoraciones.
  - **Músicos**: Gestionan su contenido y establecen precios.

### Gestión de Contenido Musical
- Cada entrada incluye álbum o sencillo con portada, precio, lista de canciones, información del artista y metadatos.
- Comentarios y valoraciones asociados a cada obra musical.

### Navegación y Búsqueda
- Navegación acorde a preferencias y roles de usuario.
- Búsqueda por palabras clave, género y rango de fechas.

### Privacidad y Seguridad
- Registro y autenticación seguros para proteger datos de usuarios.
- Compras realizadas mediante procedimientos seguros.

## Estructura del Proyecto

- **public/**: Archivos estáticos como el favicon y el HTML principal.
- **src/**: Código fuente de la aplicación React.
  - **assets/**: Imágenes y otros activos.
  - **components/**: Componentes reutilizables de la interfaz.
  - **context/**: Contextos para gestión de estado.
  - **mockData/**: Datos simulados para desarrollo.
  - **pages/**: Páginas principales de la aplicación.
  - **services/**: Servicios para autenticación y manejo de música.
  - **styles/**: Estilos globales y específicos de componentes.
  - **utils/**: Funciones utilitarias.
- **.gitignore**: Archivos y carpetas a ignorar por Git.
- **package.json**: Metadatos y dependencias del proyecto.
- **vite.config.js**: Configuración de Vite.

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd undersounds-frontend
   ```
3. Instala las dependencias:
   ```
   npm install
   ```
4. Inicia la aplicación:
   ```
   npm run dev
   ```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.