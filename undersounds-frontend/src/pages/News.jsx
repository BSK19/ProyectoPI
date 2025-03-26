import React from 'react';
import { useParams } from 'react-router-dom';
import noticiasMusica from '../mockData/noticiasMusica'; // Asumiendo que las noticias están en este archivo
import { Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
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

  <h1 className="news-title">
    {noticia.titulo}
  </h1>

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
    display: 'flex',                // Usa Flexbox para organizar los elementos
    justifyContent: 'center',       // Centra los elementos horizontalmente
    alignItems: 'flex-start',       // Alinea los elementos al principio de la caja
    marginTop: '20px',
    marginBottom: '20px',
  }}
>
  {/* Columna de texto principal */}
  <Box
    sx={{
      fontFamily: '"Arial", sans-serif',
      fontSize: '1.1rem',
      color: '#333',
      lineHeight: 1.8,
      textAlign: 'justify',
      textIndent: '30px',
      maxWidth: '800px',
      marginRight: '20px',          // Espacio entre el texto y el contenido adicional
      padding: '20px',
      borderRadius: '8px',
    }}
  >
    {noticia.descripcion}
  </Box>

  {/* Columna de contenido adicional */}
  <Box>
    
    <h3 className="titulo-extra">Noticias Relacionadas</h3>

    {parseInt(noticiaId) === 1 && (
      <div className='noticiaExtra'>
        <Link to="/news/2">
          <img src={imagen2} alt="Noticia 2" className="news-extra" />
          <h3>Soulful Voices Colabora con Artista Internacional</h3>
        </Link>
      </div>
    )}

    {parseInt(noticiaId) === 2 && (
      <div className='noticiaExtra'>
        <Link to="/news/3">
          <img src={imagen3} alt="Noticia 3" className="news-extra" />
          <h3>Soulful Voices Colabora con Artista Internacional</h3>
        </Link>
      </div>
    )}

    {parseInt(noticiaId) === 3 && (
      <div className='noticiaExtra'>
        <Link to="/news/1">
          <img src={imagen} alt="Noticia 1" className="news-extra" />
          <h3>Soulful Voices Colabora con Artista Internacional</h3>
        </Link>
      </div>
    )}
    </Box>
  </Box>
</Box>);};

export default News;
