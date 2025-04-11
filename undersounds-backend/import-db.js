require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI no está definido en el archivo .env');
  process.exit(1);
}

// Directorio de exportación
const dataDumpPath = path.join(__dirname, 'data-dump');
// Archivo de metadata (compartido) que se usará para determinar las colecciones a importar
const dbmetaFile = path.join(__dirname, 'config', 'dbmeta.json');

// Se lee la metadata y se espera que tenga la propiedad "colecciones"
let collectionsToImport = [];
try {
  if (fs.existsSync(dbmetaFile)) {
    const data = fs.readFileSync(dbmetaFile, 'utf8');
    const meta = JSON.parse(data);
    // La propiedad "colecciones" debe ser un array con el nombre de las colecciones a importar
    collectionsToImport = meta.colecciones || [];
  } else {
    console.error(`El archivo de metadata "${dbmetaFile}" no existe.`);
    process.exit(1);
  }
} catch (err) {
  console.error(`Error leyendo ${dbmetaFile}:`, err);
  process.exit(1);
}

async function importCollections() {
  if (collectionsToImport.length === 0) {
    console.log('No hay colecciones definidas para importar en dbmeta.json.');
    process.exit(0);
  }
  console.log('Importando colecciones:', collectionsToImport);

  for (const col of collectionsToImport) {
    const inputFile = path.join(dataDumpPath, `${col}.json`);
    if (!fs.existsSync(inputFile)) {
      console.error(`El archivo para la colección "${col}" no existe. Saltando...`);
      continue;
    }
    const command = `mongoimport --uri "${uri}" --collection ${col} --file "${inputFile}" --jsonArray`;
    console.log(`Ejecutando: ${command}`);
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error importando "${col}":`, error.message);
          return reject(error);
        }
        if (stderr) {
          console.log(`Información durante la importación de "${col}": ${stderr}`);
        }
        console.log(`Importación de "${col}" completada: ${stdout}`);
        resolve();
      });
    });
  }
  console.log('Importación completada para las colecciones definidas.');
}

importCollections().catch((err) => {
  console.error('Error en la importación:', err);
  process.exit(1);
});