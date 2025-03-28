const accounts = require('../../undersounds-frontend/src/mockData/accounts'); // Asegúrate de que este path es correcto
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const saltRounds = 10;

async function generateHashedAccounts() {
  try {
    const hashedAccounts = [];
    for (const account of accounts) {
      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(account.password, saltRounds);
      // Crea un objeto actualizado, reemplazando la propiedad password
      const updatedAccount = { ...account, password: hashedPassword };
      hashedAccounts.push(updatedAccount);
    }

    // Define la carpeta de salida y asegúrate de que exista
    const outputDir = path.join(__dirname, 'data-dump');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Define la ruta de salida para el archivo JSON
    const outputFilePath = path.join(outputDir, 'accounts.hashed.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(hashedAccounts, null, 2));
    console.log(`Cuentas con contraseñas hasheadas escritas en: ${outputFilePath}`);
  } catch (error) {
    console.error('Error generando cuentas hasheadas:', error);
  }
}

generateHashedAccounts();