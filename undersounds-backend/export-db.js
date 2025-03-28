require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Crear la carpeta data-dump si no existe
const dataDumpPath = path.join(__dirname, 'data-dump');
if (!fs.existsSync(dataDumpPath)) {
  fs.mkdirSync(dataDumpPath, { recursive: true });
}

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI no está definido en el archivo .env');
  process.exit(1);
}

const tempFile = path.join(dataDumpPath, 'temp_accounts.json');
const outputFile = path.join(dataDumpPath, 'accounts.json');

// Primero exportamos a un archivo temporal
const exportCommand = `mongoexport --uri "${uri}" --collection accounts --out "${tempFile}"`;
console.log(`Ejecutando: ${exportCommand}`);

exec(exportCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error en exportación: ${error.message}`);
    return;
  }
  
  try {
    // Leemos el contenido exportado
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // Dividimos por líneas y filtramos líneas vacías
    const documents = content.split('\n').filter(line => line.trim() !== '');
    
    // Creamos un array JSON válido
    const jsonArray = `[\n${documents.join(',\n')}\n]`;
    
    // Guardamos el resultado final
    fs.writeFileSync(outputFile, jsonArray);
    
    // Eliminamos el archivo temporal
    fs.unlinkSync(tempFile);
    
    console.log(`Exportación completada con éxito. Archivo guardado en: ${outputFile}`);
  } catch (err) {
    console.error(`Error al procesar el archivo: ${err.message}`);
  }
});