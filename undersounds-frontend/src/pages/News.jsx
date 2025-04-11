import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { getNewsById } from '../services/newsService';
import '../styles/newspage.css';

const News = () => {
  const { noticiaId } = useParams();  // Capturamos el parámetro noticiaId desde la URL
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(noticiaId);
        setNoticia(data);
      } catch (err) {
        setError('Noticia no encontrada o error en el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [noticiaId]);

  if (loading) {
    return <Typography variant="h5">Cargando...</Typography>;
  }

  if (error || !noticia) {
    return <Typography variant="h5">{error || "Noticia no encontrada"}</Typography>;
  }

  return (
    <Box className="news-container">
      <h1 className="news-title">{noticia.titulo}</h1>
      <Typography className="news-author">Autor: {noticia.autor}</Typography>
      <Typography className="news-date">
        Fecha de publicación: {new Date(noticia.fechaPublicacion).toLocaleDateString()}
      </Typography>
      
      {/* Se usa la imagen que retorna la API */}
      <img 
        src={noticia.image} 
        alt={noticia.titulo} 
        className="news-image" 
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <Box
          sx={{
            fontFamily: '"Arial", sans-serif',
            fontSize: '1.1rem',
            color: '#333',
            lineHeight: 1.8,
            textAlign: 'justify',
            textIndent: '30px',
            maxWidth: '800px',
            marginRight: '20px',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          {noticia.body}
        </Box>
      </Box>
    </Box>
  );
};

export default News;