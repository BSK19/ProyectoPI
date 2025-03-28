Collecting workspace informationEl backend está diseñado para ser la base de la API de UnderSounds y soporta varios casos de uso esenciales en una aplicación moderna de música. Entre las funcionalidades principales se encuentran:

1. **Registro y Autenticación de Usuarios**  
   - Endpoint **POST /api/auth/register**: Permite registrar nuevos usuarios (con roles como fan, band o label).  
   - Endpoint **POST /api/auth/login**: Permite a los usuarios iniciar sesión, retornando un access token y enviando un refresh token en una cookie HttpOnly.  
   - Endpoint **PUT /api/auth/:id**: Permite la actualización del perfil del usuario según su rol, gestionando campos específicos (por ejemplo, bandName y genre para bandas).  

2. **Gestión de Tokens con JWT y Refresh Tokens**  
   - Cada petición protegida verifica el access token enviado en la cabecera.  
   - Si el access token caduca, el interceptor de axios en el frontend (y la lógica en el backend) utilizan el refresh token almacenado (por ejemplo, en una cookie HttpOnly) para solicitar un nuevo access token mediante el endpoint **POST /api/auth/refresh-token**.

3. **Logout**  
   - Endpoint **POST /api/auth/logout**: Finaliza la sesión del usuario, eliminando el access token almacenado en memoria y borrando la cookie de refresh token.

4. **Integración OAuth2.0 con Google**  
   - Los endpoints **GET /api/auth/google** y **GET /api/auth/google/callback** usan Passport (configurado en **config/passport.js**) para permitir la autenticación con Google.  
   - Esto permite a los usuarios iniciar sesión mediante su cuenta de Google sin tener que gestionar manualmente contraseñas.

5. **Documentación de la API con Swagger**  
   - Utilizando swagger-jsdoc y swagger-ui-express, la API está documentada y se puede visualizar en **/api-docs**, facilitando el consumo desde el frontend u otras aplicaciones.

### Condiciones y Casos Necesarios para su Funcionamiento

- **Variables de Entorno Correctas:**  
  Se debe tener un archivo `.env` en la carpeta undersounds-backend configurado con al menos:
  - `MONGO_URI`: Cadena de conexión a MongoDB.
  - `SESSION_SECRET`: Clave para las sesiones (si se usan).
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_CALLBACK_URL`: Para configurar el inicio de sesión con Google a través de OAuth2.0.

- **Conexión a MongoDB:**  
  El archivo **config/db.js** se encarga de conectar a la base de datos. La API funciona correctamente si MongoDB está en ejecución y la URI es válida.

- **Configuración de Passport para OAuth:**  
  El archivo **config/passport.js** debe estar configurado y exportado correctamente para gestionar el flujo de OAuth, leyendo las variables de entorno correspondientes.

- **Endpoints REST:**  
  Las rutas definidas en **routes/AccountRoutes.js** exponen todas las funcionalidades anteriores. Esto permite que el frontend (o herramientas de prueba como Postman) puedan consumir la API para registro, login, logout, actualización de perfil, token refresh y OAuth con Google.

- **Interoperabilidad con el Frontend:**  
  El frontend en undersounds-frontend debe comunicarse con estos endpoints (por ejemplo, en http://localhost:5000/api/auth) y gestionar correctamente los tokens mediante cookies (configurando axios con `withCredentials = true`).

En resumen, el backend ofrece un conjunto completo de servicios para gestionar usuarios seguros (tanto con método tradicional como mediante OAuth), controlar el ciclo de vida de la sesión usando JWT y refresh tokens, y exponer una API documentada que el frontend actual o futuras integraciones pueden consumir.

Los comandos configurados en el package.json permiten importar y exportar datos a MongoDB de forma sencilla:

1. **mongoimport**  
   - Comando:  
     ```
     mongoimport --uri "$MONGO_URI" --collection accounts --file data.json --jsonArray
     ```  
   - Función: Importa datos a la colección **accounts**.  
   - Parámetros:
     - **--uri "$MONGO_URI"**: Establece la URI de conexión a MongoDB usando la variable de entorno `MONGO_URI`.
     - **--collection accounts**: Especifica la colección destino en la base de datos.
     - **--file data.json**: Indica el archivo JSON que contiene los documentos a importar.
     - **--jsonArray**: Indica que el archivo contiene un array de documentos en formato JSON.

2. **mongoexport**  
   - Comando:  
     ```
     mongoexport --uri "$MONGO_URI" --collection accounts --out export.json
     ```  
   - Función: Exporta los documentos de la colección **accounts** a un archivo.  
   - Parámetros:
     - **--uri "$MONGO_URI"**: Usa la URI de conexión definida en la variable de entorno `MONGO_URI`.
     - **--collection accounts**: Define la colección de la que se exportan los documentos.
     - **--out export.json**: Especifica el nombre del archivo de salida donde se almacenarán los datos exportados en formato JSON.

Con estos comandos, puedes migrar datos a y desde MongoDB, facilitando la administración y respaldo de la base de datos.   - Función: Exporta los documentos de la colección **accounts** a un archivo.  
   - Parámetros:
     - **--uri "$MONGO_URI"**: Usa la URI de conexión definida en la variable de entorno `MONGO_URI`.
     - **--collection accounts**: Define la colección de la que se exportan los documentos.
     - **--out export.json**: Especifica el nombre del archivo de salida donde se almacenarán los datos exportados en formato JSON.

Con estos comandos, puedes migrar datos a y desde MongoDB, facilitando la administración y respaldo de la base de datos.