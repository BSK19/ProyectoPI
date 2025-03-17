import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { RegisterContext } from '../../context/RegisterContext.jsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword.jsx';
import AppTheme from '../themes/AuthTheme/AuthTheme.jsx';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login(props) {
  // Estados para email, password y error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openForgot, setOpenForgot] = useState(false);
  const navigate = useNavigate();
  const { setRegisterType } = useContext(RegisterContext);

  const handleForgotOpen = () => {
    setOpenForgot(true);
  };

  const handleForgotClose = () => {
    setOpenForgot(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      // Llamada a tu servicio de login
      await login(email, password);
      navigate('/'); // Si el login es exitoso, redirige al home
    } catch (err) {
      setErrorMessage('Su email o contraseña no es válido');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Inicio sesión	
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Correo electrónico</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuérdame"
            />
            <ForgotPassword open={openForgot} handleClose={handleForgotClose} />
            <Button type="submit" fullWidth variant="contained">
              Inicia sesión
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleForgotOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
          <Divider>or</Divider>
          {/* Texto de Sign up usando RegisterContext para establecer el tipo */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              ¿No tienes cuenta todavía? Registrate como{' '}
              <Link
                component="button"
                variant="body2"
                sx={{ mx: 0.5 }}
                onClick={() => {
                  setRegisterType('fan');
                  navigate('/register');
                }}
              >
                Fan
              </Link>
              |
              <Link
                component="button"
                variant="body2"
                sx={{ mx: 0.5 }}
                onClick={() => {
                  setRegisterType('band');
                  navigate('/register');
                }}
              >
                Banda
              </Link>
              |
              <Link
                component="button"
                variant="body2"
                sx={{ mx: 0.5 }}
                onClick={() => {
                  setRegisterType('label');
                  navigate('/register');
                }}
              >
                Sello discográfico
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}