const express = require('express');
const router = express.Router();
const passport = require('passport');
const AccountController = require('../controller/AccountController');

router.post('/register', AccountController.register);
router.post('/login', AccountController.login);
router.put('/:id', AccountController.updateProfile);
router.post('/logout', AccountController.logout);
router.post('/refresh-token', AccountController.refreshToken);

// Nuevas rutas de recuperación de contraseña
router.post('/forgot-password', AccountController.forgotPassword);
router.post('/reset-password', AccountController.resetPassword);

// Rutas para OAuth con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirige a la ruta deseada tras autenticación exitosa
    res.redirect('/');
  }
);

module.exports = router;