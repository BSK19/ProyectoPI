const AccountDao = require('../model/dao/AccountDao');
const AccountDTO = require('../model/dto/AccountDTO');
const AccountFactory = require('../model/factory/AccountFactory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AccountController {
  
  async register(req, res) {
    try {
      const inputData = req.body;
      const accountData = AccountFactory.createAccount(inputData);
      accountData.password = await bcrypt.hash(accountData.password, 10);
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
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      // Envía el access token en el body (puedes omitir refreshToken)
      res.json({
        account: new AccountDTO(account),
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
      
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Refresh token no válido' });
        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );
        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const updatedAccount = await AccountDao.update(id, req.body);
      res.json(new AccountDTO(updatedAccount));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async logout(req, res) {
    // Borra la cookie del refresh token
    res.clearCookie('refreshToken');
    res.json({ success: true });
  }
}

module.exports = new AccountController();