import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { authService } from '../../services/authService';
import jwtDecode from 'jwt-decode';

function ForgotPassword({ open, handleClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [message, setMessage] = useState('');
  const inputRefs = useRef([]);

  // Efecto que reinicia estados cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setStep(1);
      setEmail('');
      setOtpValues(Array(6).fill(''));
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
      setOtpToken('');
    }
  }, [open]);

  // Paso 1: Solicitar OTP (mantiene estética y texto original)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const { message, otpToken } = await authService.forgotPassword(email);
      setMessage(message);
      setOtpToken(otpToken);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data.error || 'Error al solicitar OTP');
    }
  };

  // Paso 2: Verificar OTP localmente (comparando lo ingresado con el token decodificado)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    try {
      const decoded = jwtDecode(otpToken);
      if (decoded.otp === otp && decoded.email === email) {
        setMessage('');
        setStep(3);
      } else {
        setMessage('El código OTP ingresado es incorrecto');
      }
    } catch (error) {
      setMessage('Error al verificar el OTP');
    }
  };

  // Manejo de cambios en cada recuadro del OTP
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return;
    const nuevoOtp = [...otpValues];
    nuevoOtp[index] = value;
    setOtpValues(nuevoOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Permite borrar con retroceso
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paso 3: Restablecer contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    const otp = otpValues.join('');
    try {
      const response = await authService.resetPassword(email, otp, newPassword, otpToken);
      setMessage(response.message || 'Contraseña actualizada exitosamente');
      setTimeout(() => {
        handleClose();
        // Reinicia estados luego de cerrar el diálogo
        setStep(1);
        setEmail('');
        setOtpValues(Array(6).fill(''));
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
        setOtpToken('');
      }, 750);
    } catch (error) {
      setMessage(error.response?.data.error || 'Error al restablecer la contraseña');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit:
            step === 1 ? handleRequestOtp :
            step === 2 ? handleVerifyOtp :
            handleResetPassword,
          sx: { backgroundImage: 'none' }
        }
      }}
    >
      <DialogTitle>
        {step === 1 && 'Recupera tu contraseña'}
        {step === 2 && 'Ingresa el código OTP'}
        {step === 3 && 'Restablece tu contraseña'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {message && <Alert severity="info">{message}</Alert>}
        {step === 1 && (
          <>
            <DialogContentText>
              Ingresa tu dirección de correo electrónico y te enviaremos un código OTP para restablecer tu contraseña.
            </DialogContentText>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              placeholder="Correo electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        {step === 2 && (
          <>
            <DialogContentText>
              Ingresa el código OTP que recibiste. Cada recuadro representa un dígito.
            </DialogContentText>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {otpValues.map((value, index) => (
                <OutlinedInput
                  key={index}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '20px', width: '40px' }
                  }}
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  required
                />
              ))}
            </Box>
          </>
        )}
        {step === 3 && (
          <>
            <DialogContentText sx={{ mb: 2 }}>
              Ingresa tu nueva contraseña y confírmala.
            </DialogContentText>
            <TextField
              required
              fullWidth
              type="password"
              label="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              required
              fullWidth
              type="password"
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" type="submit">
          {step === 1 && 'Enviar Código'}
          {step === 2 && 'Verificar OTP'}
          {step === 3 && 'Restablecer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ForgotPassword;