require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const accountRoutes = require('./routes/AccountRoutes');
const albumRoutes = require('./routes/AlbumRoutes');
const artistRoutes = require('./routes/ArtistRoutes');
const noticiasMusica = require('./routes/NewsRoutes');
const MerchRoutes = require('./routes/MerchandisingRoutes');
const Stripe = require('stripe');
const passport = require('./config/passport');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process'); // Añadido spawn
const readline = require('readline');
const jamendoRoutes = require('./routes/JamendoRoutes');

mongoose.set('strictQuery', false);

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/assets', express.static(path.join(__dirname, '../undersounds-frontend/src/assets')));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Conectar a MongoDB
connectDB();

// Configuración Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UnderSounds API',
      version: '1.0.0',
      description: 'Documentación de la API de UnderSounds'
    },
    servers: [
      { url: 'http://localhost:5000/api' }
    ]
  },
  apis: ['./docs/openapi.yaml']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/api/auth', accountRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/jamendo', jamendoRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/noticias', noticiasMusica);
app.use('/api/merchandising', MerchRoutes);


// --- Configuración de la vista (MVC tradicional) ---
app.use(express.static(path.join(__dirname, 'view')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

// ----- Gestión de metadata -----
// Definición de los archivos de metadata:
// - sharedMetaFile: versión global (compartido en el repo, por ejemplo, config/dbmeta.json)
// - localMetaFile: versión local (entorno de desarrollo, config/dbmeta_local.json)
const sharedMetaFile = path.join(__dirname, 'config', 'dbmeta.json');
const localMetaFile = path.join(__dirname, 'config', 'dbmeta_local.json');

// Función auxiliar: obtiene la versión guardada en un fichero (o 0 si no existe)
// Si es el archivo local y no existe, se crea con valor 0
const getVersionFromFile = (filePath) => {
  let version = 0;
  try {
    if (!fs.existsSync(filePath)) {
      if (filePath === localMetaFile) {
        fs.writeFileSync(filePath, JSON.stringify({ dbVersion: 0, colecciones: [] }, null, 2));
        console.log(`${filePath} no existía, se ha creado con valor 0 y colecciones vacías.`);
        return 0;
      }
    } else {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      version = parsed.dbVersion || 0;
    }
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
  }
  return version;
};

// Función auxiliar: actualiza un fichero de metadata con la nueva versión y opcionalmente las colecciones
const updateVersionFile = (filePath, newVersion, newColecciones = null) => {
  let meta = {};
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      meta = JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
  }
  meta.dbVersion = newVersion;
  if (newColecciones !== null) {
    meta.colecciones = newColecciones;
  }
  fs.writeFileSync(filePath, JSON.stringify(meta, null, 2));
  console.log(`${filePath} actualizado a la versión ${newVersion} con colecciones:`, meta.colecciones);
};

// La versión global (esperada en el repo) se extrae de dbmeta.json
const CURRENT_DB_VERSION = getVersionFromFile(sharedMetaFile);

// Al iniciar, se compara la versión local con la global (CURRENT_DB_VERSION).
// Si la versión local es menor, se ejecuta mongoimport y luego se actualizan ambos ficheros.
const checkAndImportData = () => {
  const localVersion = getVersionFromFile(localMetaFile);
  if (localVersion < CURRENT_DB_VERSION) {
    console.log("La versión local es antigua o no existe. Ejecutando mongoimport...");
    exec('npm run mongoimport', (err, stdout, stderr) => {
      if (err) {
        console.error("Error ejecutando mongoimport:", err);
        startServer();
      } else {
        console.log("mongoimport completado:", stdout);
        // Se conserva el array actual de colecciones, o se usa [] si no existe
        let currentCollections = [];
        try {
          const metaData = fs.existsSync(sharedMetaFile) ? JSON.parse(fs.readFileSync(sharedMetaFile, 'utf8')) : {};
          currentCollections = metaData.colecciones || [];
        } catch (e) {
          console.error(e);
        }
        updateVersionFile(sharedMetaFile, CURRENT_DB_VERSION, currentCollections);
        updateVersionFile(localMetaFile, CURRENT_DB_VERSION, currentCollections);
        startServer();
      }
    });
  } else {
    console.log("La BD ya está actualizada.");
    startServer();
  }
};

// ----- Gestión del respaldo (mongoexport) al cierre -----
process.on('SIGINT', () => {
  console.log("Se detectó el cierre del proceso.");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("¿Desea respaldar los datos con mongoexport? (S/N): ", (answer) => {
    if (answer.trim().toUpperCase() === "S") {
      console.log("Ejecutando mongoexport para respaldar datos...");
      
      // Usar spawn en lugar de exec para mantener la interactividad
      const child = spawn('node', ['export-db.js'], { 
        stdio: 'inherit' // Esto conecta stdin/stdout/stderr del hijo al padre
      });

      child.on('exit', (code) => {
        console.log(`\nExportación de datos completada con código ${code}`);
        
        // Se actualiza tanto la versión global como la local a CURRENT_DB_VERSION + 1
        const newVersion = CURRENT_DB_VERSION + 1;
        let currentCollections = [];
        try {
          const metaData = fs.existsSync(sharedMetaFile) ? JSON.parse(fs.readFileSync(sharedMetaFile, 'utf8')) : {};
          currentCollections = metaData.colecciones || [];
        } catch (e) {
          console.error(e);
        }
        updateVersionFile(sharedMetaFile, newVersion, currentCollections);
        updateVersionFile(localMetaFile, newVersion, currentCollections);
        
        rl.close();
        process.exit();
      });
    } else {
      console.log("No se realizará el respaldo de datos.");
      rl.close();
      process.exit();
    }
  });
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        //images: item.image,
      },
      unit_amount: Math.round(item.price * 100), // en céntimos
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/',
      cancel_url: 'http://localhost:3000/',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Al iniciar se verifica si hay que hacer mongoimport
checkAndImportData();