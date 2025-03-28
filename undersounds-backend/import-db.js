require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputFile = path.join(__dirname, 'data-dump', 'accounts.json');

// Verificar que el archivo existe
if (!fs.existsSync(inputFile)) {
  console.error(`Error: El archivo ${inputFile} no existe.`);
  process.exit(1);
}

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI no está definido en el archivo .env');
  process.exit(1);
}

const command = `mongoimport --uri "${uri}" --collection accounts --file "${inputFile}" --jsonArray`;
console.log(`Ejecutando: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`Información: ${stderr}`);
  }
  if (stdout) {
    console.log(`Salida: ${stdout}`);
  }
  console.log('Importación completada con éxito');
});