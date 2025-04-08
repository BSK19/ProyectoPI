require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI no está definido en el archivo .env');
  process.exit(1);
}

// Directorio de volcado de datos
const dataDumpPath = path.join(__dirname, 'data-dump');
if (!fs.existsSync(dataDumpPath)) {
  fs.mkdirSync(dataDumpPath, { recursive: true });
}

// Ruta del archivo de metadata compartida
const dbmetaFile = path.join(__dirname, 'config', 'dbmeta.json');

// Crear interfaz de readline para entrada/salida interactiva
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para preguntar al usuario y devolver una promesa
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function listCollections() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const dbName = (new URL(uri)).pathname.substr(1) || 'undersounds';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    // Filtrar para incluir sólo colecciones con al menos 1 documento.
    const nonEmptyCollections = await Promise.all(
      collections.map(async (col) => {
        const count = await db.collection(col.name).estimatedDocumentCount();
        return { name: col.name, count };
      })
    );
    const filtered = nonEmptyCollections
                      .filter(col => col.count > 0)
                      .map(col => col.name);
    return filtered;
  } catch (error) {
    console.error("Error listando colecciones de forma dinámica:", error.message);
    return [];
  } finally {
    await client.close();
  }
}

async function selectCollections() {
  const dynamicChoices = await listCollections();
  if (dynamicChoices.length === 0) {
    console.log("No se encontraron colecciones (con datos) en la base de datos.");
    rl.close();
    process.exit(1);
  }
  
  console.log("\n===== EXPORTACIÓN DE COLECCIONES =====");
  console.log("\nColecciones disponibles:");
  dynamicChoices.forEach((name, index) => {
    console.log(`${index}: ${name}`);
  });
  
  // Usar un enfoque más directo para la entrada
  process.stdout.write("\nEscribe los índices de las colecciones a exportar separados por coma (ej. 0,1) o presiona Enter para exportar todas: ");
  
  // Leer directamente de stdin con un timeout
  const answer = await new Promise((resolve) => {
    let data = '';
    
    const stdinListener = (chunk) => {
      data += chunk.toString();
      if (data.includes('\n')) {
        cleanup();
        resolve(data.trim());
      }
    };
    
    const timeout = setTimeout(() => {
      cleanup();
      resolve('');
    }, 60000); // 60 segundos de timeout
    
    function cleanup() {
      process.stdin.removeListener('data', stdinListener);
      clearTimeout(timeout);
    }
    
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.stdin.on('data', stdinListener);
  });
  
  // Debugging extensivo
  console.log(`\nEntrada recibida (raw): "${answer}", longitud: ${answer.length}`);
  console.log(`Bytes recibidos: ${[...answer].map(c => c.charCodeAt(0)).join(', ')}`);
  
  // Limpieza más agresiva
  const cleanAnswer = answer.replace(/[\r\n\t\f\v\s]/g, '');
  console.log(`Entrada limpiada: "${cleanAnswer}", longitud: ${cleanAnswer.length}`);
  
  // Si la entrada está vacía, exportar todo
  if (cleanAnswer === "") {
    console.log("Entrada vacía detectada. Se exportarán TODAS las colecciones.");
    return { collections: dynamicChoices };
  }
  
  // Procesar índices
  const validIndices = [];
  
  if (cleanAnswer.includes(',')) {
    // Procesar múltiples índices
    const fragments = cleanAnswer.split(',');
    console.log(`Procesando ${fragments.length} índices:`);
    
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i].trim();
      console.log(`  ${i+1}. Fragmento: "${fragment}"`);
      
      if (fragment === '') continue;
      
      const index = parseInt(fragment, 10);
      if (!isNaN(index) && index >= 0 && index < dynamicChoices.length) {
        validIndices.push(index);
        console.log(`    ✓ Índice válido: ${index} = ${dynamicChoices[index]}`);
      } else {
        console.log(`    ✗ Índice inválido: ${fragment}`);
      }
    }
  } else {
    // Procesar un solo índice
    const index = parseInt(cleanAnswer, 10);
    console.log(`Procesando como único índice: ${index}`);
    
    if (!isNaN(index) && index >= 0 && index < dynamicChoices.length) {
      validIndices.push(index);
      console.log(`  ✓ Índice válido: ${index} = ${dynamicChoices[index]}`);
    } else {
      console.log(`  ✗ Índice inválido: ${cleanAnswer}`);
    }
  }
  
  // Si no hay índices válidos, exportar todo
  if (validIndices.length === 0) {
    console.log("No se encontraron índices válidos. Se exportarán TODAS las colecciones.");
    return { collections: dynamicChoices };
  }
  
  // Mapear índices a nombres de colección
  const selectedCollections = validIndices.map(idx => dynamicChoices[idx]);
  
  console.log("\nCOLECCIONES SELECCIONADAS PARA EXPORTAR:");
  selectedCollections.forEach((name, i) => console.log(`${i+1}. ${name}`));
  
  return { collections: selectedCollections };
}

async function exportCollections() {
  try {
    const { collections: collectionsToExport } = await selectCollections();
    
    if (!collectionsToExport || collectionsToExport.length === 0) {
      console.log('No se seleccionó ninguna colección para exportar.');
      rl.close();
      process.exit(0);
    }

    // Exportar cada colección mediante mongoexport
    for (const col of collectionsToExport) {
      const tempFile = path.join(dataDumpPath, `temp_${col}.json`);
      const outputFile = path.join(dataDumpPath, `${col}.json`);
      
      const exportCommand = `mongoexport --uri "${uri}" --collection ${col} --out "${tempFile}"`;
      console.log(`Ejecutando: ${exportCommand}`);
      
      await new Promise((resolve, reject) => {
        exec(exportCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error exportando la colección ${col}:`, error.message);
            return reject(error);
          }
          try {
            const content = fs.readFileSync(tempFile, 'utf8');
            const documents = content.split('\n').filter(line => line.trim() !== '');
            const jsonArray = `[\n${documents.join(',\n')}\n]`;
            fs.writeFileSync(outputFile, jsonArray);
            fs.unlinkSync(tempFile);
            console.log(`Colección ${col} exportada exitosamente en: ${outputFile}`);
            resolve();
          } catch (err) {
            console.error(`Error procesando la colección ${col}:`, err.message);
            reject(err);
          }
        });
      });
    }

    // Actualizar el archivo de metadata con las colecciones exportadas
    let meta = {};
    try {
      if (fs.existsSync(dbmetaFile)) {
        const metaContent = fs.readFileSync(dbmetaFile, 'utf8');
        meta = JSON.parse(metaContent);
      }
    } catch (err) {
      console.error(`Error leyendo ${dbmetaFile}:`, err.message);
    }
    meta.colecciones = collectionsToExport;
    try {
      fs.writeFileSync(dbmetaFile, JSON.stringify(meta, null, 2));
      console.log(`Archivo de metadata actualizado en: ${dbmetaFile}`);
    } catch (err) {
      console.error(`Error actualizando ${dbmetaFile}:`, err.message);
    }

    console.log('Exportación completa para las colecciones seleccionadas.');
    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('Error en la exportación:', err);
    rl.close();
    process.exit(1);
  }
}

exportCollections();