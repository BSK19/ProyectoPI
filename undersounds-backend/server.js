require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const accountRoutes = require('./routes/AccountRoutes');
const passport = require('./config/passport');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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
      {
        url: 'http://localhost:5000/api'
      }
    ]
  },
  apis: ['./docs/openapi.yaml']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/api/auth', accountRoutes);

// --- Configuración de la vista (MVC tradicional) ---
app.use(express.static(path.join(__dirname, 'view')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});