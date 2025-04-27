const AccountDao = require('../model/dao/AccountDAO');
const AccountDTO = require('../model/dto/AccountDTO');
const AccountFactory = require('../model/factory/AccountFactory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Importaciones corregidas con nombres exactos
const ArtistDAO = require('../model/dao/ArtistDAO');
const ArtistaFactory = require('../model/factory/ArtistaFactory');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pruebaspi060@gmail.com',       
    pass: 'haqv baox evro yxcj'            
  }
});

// Función para generar un OTP aleatorio de 6 caracteres alfanuméricos
function generateOtp() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

// Función para enviar el correo real con el OTP
async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: '"Soporte" pruebaspi060@gmail.com',
    to: email,
    subject: 'Código de recuperación de contraseña',
    text: `Tu código OTP es: ${otp}`,
    html: `<p>Tu código OTP es: <strong>${otp}</strong></p>`
  };

  await transporter.sendMail(mailOptions);
}

class AccountController {

  async register(req, res) {
    try {
      const inputData = req.body;
      // Comprueba si el correo ya existe
      const existingAccount = await AccountDao.findByEmail(inputData.email);
      if (existingAccount) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      }
   
      inputData.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(inputData.username)}&size=128&background=random&color=fff`;
      const accountData = AccountFactory.createAccount(inputData);
      accountData.password = await bcrypt.hash(accountData.password, 10);
      
      // Verificar si es una cuenta de banda y crear artista asociado
      if (accountData.role === 'band') {
        try {
          // Crear datos del artista basados en los datos de la cuenta
          const artistData = {
            name: accountData.bandName || accountData.username,
            profileImage: accountData.profileImage,
            bannerImage: accountData.bannerImage,
            genre: accountData.genre || '',
            bio: accountData.bio || '',
            followers: 0,
            albums: []
          };
          
          // Ya no necesitamos asignar el ID manualmente
          // ArtistDAO.createArtist() se encargará de asignar un ID único
          
          // Usar ArtistaFactory para crear el objeto de artista
          const newArtistData = ArtistaFactory.createArtist(artistData);
          
          // Guardar el nuevo artista en la base de datos
          const newArtist = await ArtistDAO.createArtist(newArtistData);
          
          // Asignar el ID de MongoDB del artista a la cuenta
          accountData.artistId = newArtist._id;
          
          console.log(`Artista creado con MongoDB ID: ${newArtist._id}, ID numérico: ${newArtist.id} para cuenta: ${accountData.email}`);
        } catch (artistError) {
          console.error('Error al crear artista vinculado:', artistError);
          // Continuamos con la creación de la cuenta aunque falle la creación del artista
        }
      }
      
      // Crear la cuenta (ahora posiblemente con artistId)
      const newAccount = await AccountDao.create(accountData);
      res.status(201).json(new AccountDTO(newAccount));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const account = await AccountDao.findByEmail(email);
      if (!account) return res.status(401).json({ error: 'Credenciales inválidas' });
      const valid = await bcrypt.compare(password, account.password);
      if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Si es una banda y tiene artistId, cargar datos completos
      let accountToReturn = account;
      if (account.role === 'band') {
        accountToReturn = await AccountDao.findByIdWithArtist(account._id);
      }

      // Genera el access token y el refresh token
      const accessToken = jwt.sign(
        { id: account._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: account._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Envía el refresh token en cookie HttpOnly
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        ...(req.body.remember ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}) // Si remember es false, la cookie será de sesión
      });

      // Envía el access token y la cuenta en el body
      res.json({
        account: new AccountDTO(accountToReturn),
        accessToken
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      // Lee el refresh token desde la cookie
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ error: 'No se proporcionó refresh token' });
      
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Refresh token no válido' });
        // Genera un nuevo access token
        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );
        // Obtén la cuenta existente en la base de datos
        const account = await AccountDao.findById(decoded.id);
        if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

        // Si es una banda con artistId, cargar datos completos
        let accountToReturn = account;
        if (account.role === 'band' && account.artistId) {
          accountToReturn = await AccountDao.findByIdWithArtist(account._id);
        }

        res.json({ 
          accessToken: newAccessToken,
          account: new AccountDTO(accountToReturn) 
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Nuevo método para generar token (usado en autenticación OAuth)
  generateToken(user) {
    if (!user) {
      throw new Error('Usuario no válido para generar token');
    }
    
    // Genera el access token usando la misma estructura y secreto que el método login
    const accessToken = jwt.sign(
      { 
        id: user._id || user.id,
        email: user.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' } // Token válido por 1 día
    );
    
    return accessToken;
  }

  async getAccountType(req, res) {
    try {
      const { id } = req.params;
      const account = await AccountDao.findById(id);
      if (!account) {
        return res.status(404).json({ error: 'Cuenta no encontrada' });
      }
      res.json({ type: account.type });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const updatedAccount = await AccountDao.update(id, req.body);
      // Retorna un objeto que incluya success y el dto actualizado
      res.json({ success: true, account: new AccountDTO(updatedAccount) });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async logout(req, res) {
    // Borra la cookie del refresh token
    res.clearCookie('refreshToken');
    res.json({ success: true });
  }

  // Endpoint para solicitar recuperación de contraseña
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const account = await AccountDao.findByEmail(email);
      if (!account) {
        return res.status(404).json({ error: 'Correo no encontrado' });
      }
      
      // Genera un nuevo OTP
      const otp = generateOtp();
      
      // Firma un token que contiene el OTP y el email con expiración de 10 minutos
      const otpToken = jwt.sign({ otp, email }, process.env.OTP_SECRET, { expiresIn: '10m' });
      
      // Envía el OTP por correo de forma asíncrona
      sendOtpEmail(email, otp).catch(err => {
        console.error("Error enviando el correo OTP:", err);
      });
      
      // Responde inmediatamente y envía también el otpToken para que el cliente lo guarde
      res.json({ message: 'Se ha enviado un código OTP a su correo', otpToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword, otpToken } = req.body;
      
      if (!otpToken) {
        return res.status(400).json({ error: 'No se ha proporcionado el otpToken' });
      }
      
      // Muestra el contenido del token sin verificar para debug
      const decodedPreview = jwt.decode(otpToken);
      
      let decoded;
      try {
        decoded = jwt.verify(otpToken, process.env.OTP_SECRET);
      } catch (err) {
        return res.status(400).json({ error: 'Token OTP inválido o expirado' });
      }
      
      if (decoded.email !== email || decoded.otp !== otp) {
        return res.status(400).json({ error: 'OTP inválido' });
      }
      
      const account = await AccountDao.findByEmail(email);
      if (!account) {
        return res.status(404).json({ error: 'Correo no encontrado' });
      }
      
      const hashStart = Date.now();
      account.password = await bcrypt.hash(newPassword, 10);
      
      await account.save();
      
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para vincular una cuenta de banda existente a un artista (útil para migraciones)
  async linkBandToArtist(req, res) {
    try {
      const { accountId } = req.params;
      const account = await AccountDao.findById(accountId);
      
      if (!account) {
        return res.status(404).json({ error: 'Cuenta no encontrada' });
      }
      
      if (account.role !== 'band') {
        return res.status(400).json({ error: 'Solo se pueden vincular cuentas de tipo banda' });
      }
      
      if (account.artistId) {
        return res.status(400).json({ error: 'Esta cuenta ya está vinculada a un artista' });
      }
      
      try {
        // Crear un nuevo artista basado en los datos de la cuenta
        const artistData = {
          name: account.bandName || account.username,
          profileImage: account.profileImage,
          bannerImage: account.bannerImage,
          genre: account.genre || '',
          bio: account.bio || '',
          followers: account.followers || 0,
          albums: []
        };
        
        // ArtistDAO.createArtist() ahora se encarga de asignar un ID único
        const newArtistData = ArtistaFactory.createArtist(artistData);
        const newArtist = await ArtistDAO.createArtist(newArtistData);
        
        // Vincular el artista a la cuenta
        const updatedAccount = await AccountDao.linkToArtist(accountId, newArtist._id);
        
        res.json({ 
          success: true, 
          message: 'Cuenta vinculada correctamente con un nuevo artista',
          account: new AccountDTO(updatedAccount)
        });
      } catch (error) {
        console.error('Error al vincular cuenta a artista:', error);
        res.status(500).json({ error: error.message });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AccountController();