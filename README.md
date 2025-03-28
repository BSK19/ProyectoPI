# UnderSounds - Tienda de Música en Línea

Bienvenido a UnderSounds, una tienda de música en línea que permite a músicos y bandas lanzar y promocionar su música. Esta plataforma ofrece a los usuarios la posibilidad de explorar, reproducir, comprar y descargar música en diversos formatos digitales.

## Funcionalidades

### General
- Explora un catálogo organizado por géneros, artistas, álbumes y pistas.
- Reproduce música, visualiza carátulas y accede a detalles de canciones y álbumes.
- Descarga música en formatos como MP3, FLAC y WAV.
- Sistema de valoraciones, comentarios y colecciones personales.

### Sistema de Usuarios
- Registro, autenticación y recuperación de contraseña.
- Roles de usuario:
  - **Invitados**: Acceden al catálogo sin necesidad de registro.
  - **Usuarios registrados**: Pueden comprar música, dejar comentarios y gestionar su perfil.
  - **Músicos**: Pueden crear y gestionar su perfil, así como administrar su contenido musical (álbumes, sencillos, merchandising).
- Actualización de perfil con campos dinámicos según el rol (por ejemplo, **bandas** y **sellos** muestran campos adicionales como nombre, género, sitio web, etc.).

### Gestión de Contenido Musical
- Cada entrada (álbum, sencillo, merchandising) incluye portada, precio, lista de canciones y metadatos relacionados.
- Reproducción directa de pistas desde la vista de álbum, con integración al reproductor global.
- Búsqueda y filtrado avanzado por artista, género y palabras clave.

### Navegación y Búsqueda
- Navegación intuitiva a través de menús, tabs y carruseles.
- Barra de búsqueda en el header con filtrado en vivo que muestra resultados de artistas, álbumes y pistas.
- Páginas dedicadas: Inicio, Discover, Explore, Artist Profile, Album, Carrito y Payment.

## Estructura del Proyecto

- **src/**: Código fuente de la aplicación React.
  - **assets/**: Imágenes y otros recursos gráficos.
  - **components/**: Componentes reutilizables (por ejemplo, Header, Navigation, Footer, Player, y componentes específicos para álbum, artista, autenticación, etc.).
  - **context/**: Gestores de estado global (AuthContext, CartContext, PlayerContext, AlbumContext, RegisterContext, etc.).
  - **mockData/**: Datos simulados para desarrollo (por ejemplo, cuentas, álbumes, artistas, pistas y merchandising).
  - **pages/**: Vistas principales de la aplicación (HomePage, DiscoverPage, AlbumPage, ArtistProfile, UserProfile, ConcertPage, CarritoPage, Payment, News, TshirtPage, etc.).
  - **services/**: Funciones para comunicación con el backend (autenticación, música, etc.).
  - **styles/**: Hojas de estilo globales y específicas para cada componente o página.
  - **utils/**: Funciones utilitarias y helpers (por ejemplo, formateo de duración de álbum, validaciones, etc.).

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
   
## Licencia

Este proyecto está bajo la Licencia MIT.