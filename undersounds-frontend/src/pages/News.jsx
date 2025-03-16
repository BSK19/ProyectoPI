import React from 'react';
import { useParams } from 'react-router-dom';
import noticiasMusica from '../mockData/noticiasMusica'; // Asumiendo que las noticias están en este archivo
import { Typography, Box } from '@mui/material';

import imagen from '../assets/images/images2.webp';
import imagen2 from '../assets/images/imagen2.jpeg';
import imagen3 from '../assets/images/images3.webp'; //arreglar esto, provisional. No consigo que cargue las imgs desde imagen.urlimagen
import '../styles/newspage.css'; // Importa el archivo CSS

const News = () => {
  const { noticiaId } = useParams();  // Capturamos el parámetro noticiaId desde la URL

  // Buscar la noticia con el ID capturado
  const noticia = noticiasMusica.find(noticia => noticia.id === parseInt(noticiaId)); // Asegúrate de comparar correctamente el ID

  if (!noticia) {
    return <Typography variant="h5">Noticia no encontrada</Typography>; // Si no se encuentra la noticia
  } 

  return (
<Box className="news-container">
  <Typography className="news-title">
    {noticia.titulo}
  </Typography>
  <Typography className="news-author">
    Autor: {noticia.autor}
  </Typography>
  <Typography className="news-date">
    Fecha de publicación: {noticia.fechaPublicacion}
  </Typography>

  {/* Mostrar la imagen según el noticiaId */}
  {parseInt(noticiaId) === 1 && (
    <img src={imagen} alt="Noticia 1" className="news-image" />
  )}
  {parseInt(noticiaId) === 2 && (
    <img src={imagen2} alt="Noticia 2" className="news-image" />
  )}
  {parseInt(noticiaId) === 3 && (
    <img src={imagen3} alt="Noticia 3" className="news-image" />
  )}

  {/* Descripción sin caja extra */}
  <Box
    sx={{
      fontFamily: '"Arial", sans-serif',
      fontSize: '1.1rem',
      color: '#333',
      lineHeight: 1.8,
      marginTop: '20px',
      marginBottom: '20px',
      textAlign: 'justify',
      textIndent: '30px',
      backgroundColor: '#f9f9f9',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '20px',
      borderRadius: '8px', // Opcional: redondea bordes para mejor estética
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Opcional: da un efecto de elevación sutil
    }}
  >
    {noticia.descripcion}
  </Box>
</Box>
  );
};

export default News;
