import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterContext } from './RegisterContext';
import signupFan from '../../assets/images/icon-fans.svg';
import signupBand from '../../assets/images/icon-artists.svg';
import signupLabel from '../../assets/images/icon-labels.svg';

const SignUpDialog = ({ open, handleClose }) => {
  const { setRegisterType } = useContext(RegisterContext);
  const navigate = useNavigate();

  const handleRegisterClick = (type) => {
    setRegisterType(type);
    handleClose();
    navigate('/register');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          fontSize: '24px', 
          fontWeight: 'bold',
        }}
      >
        Crea tu cuenta de Undersounds
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 2, backgroundColor: '#FFFFFF', p: 2 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <img src={signupFan} alt="SignUp Fan Logo" style={{ height: '170px', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Button 
                  sx={{ mt: 2, p: 2, width:'100%', height: '30%', backgroundColor: '#FFFFFF', color: '#3bb1ce', borderColor: '#3bb1ce', borderWidth: 2 }}
                  variant="outlined"  
                  onClick={() => handleRegisterClick('fan')}
                >
                  Registrarse como Fan
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Regístrate como fan para seguir a tus artistas favoritos y descubrir nueva música.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ width: '100%', my: 2, backgroundColor: 'grey' }} />
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <img src={signupBand} alt="SignUp Band Logo" style={{ height: '170px', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Button 
                  sx={{ mt: 2, p: 2, width:'100%', height: '30%', backgroundColor: '#FFFFFF', color: '#619728', borderColor: '#b9eb87', borderWidth: 2 }}
                  variant="outlined" 
                  fullWidth 
                  onClick={() => handleRegisterClick('band')}
                >
                  Registrarse como Banda
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Regístrate como banda para compartir tu música y conectar con tus fans.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ width: '100%', my: 2, backgroundColor: 'grey' }} />
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <img src={signupLabel} alt="SignUp Label Logo" style={{ height: '170px', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Button 
                  sx={{ mt: 2, p: 2 , width:'100%', height: '30%', backgroundColor: '#FFFFFF', color: '#9911ff', borderColor: '#9911ff', borderWidth: 2 }}
                  variant="outlined" 
                  fullWidth 
                  onClick={() => handleRegisterClick('label')}
                >
                  Registrarse como Sello Discográfico
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Regístrate como sello discográfico para gestionar tus artistas y lanzamientos.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignUpDialog;