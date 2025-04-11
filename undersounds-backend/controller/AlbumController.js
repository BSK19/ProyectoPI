const AlbumDao = require('../model/dao/AlbumDao');
const AlbumDTO = require('../model/dto/AlbumDTO');
const AlbumFactory = require('../model/factory/AlbumFactory');
const { Artist } = require('../model/models/Artistas');
const path = require('path');
const fs = require('fs');
const os = require('os');
const archiver = require('archiver');
const axios = require('axios');
const audioConverter = require('../services/AudioConverterService');
const mongoose = require('mongoose');

// Usar rutas relativas para los archivos de música
const MUSIC_FILES_PATH = path.join(process.cwd(), '..', 'undersounds-frontend', 'src', 'assets', 'music');

class AlbumController {
  async getAlbums(req, res) {
    try {
      // Modificar para hacer populate del campo artist, seleccionando solo campos necesarios
      const albums = await AlbumDao.getAlbums();
      // Populate los objetos de artista
      await Promise.all(albums.map(async album => {
        if (album.artist && typeof album.artist === 'object' && album.artist._id) {
          try {
            const artistData = await Artist.findById(album.artist._id).select('name bandName profileImage');
            if (artistData) {
              album.artist.name = artistData.name || artistData.bandName || 'Unknown Artist';
              album.artist.profileImage = artistData.profileImage;
            }
          } catch (err) {
            console.warn(`Error poblando artista para álbum ${album._id}: ${err.message}`);
          }
        }
      }));
      
      const albumDTOs = albums.map(album => new AlbumDTO(album));
      res.json(albumDTOs);
    } catch (error) {
      console.error("Error en getAlbums:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      // Modificar para hacer populate del campo artist
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      
      // Populate el objeto artist si existe
      if (album.artist && typeof album.artist === 'object' && album.artist._id) {
        try {
          const artistData = await Artist.findById(album.artist._id).select('name bandName profileImage genre bio');
          if (artistData) {
            album.artist.name = artistData.name || artistData.bandName || 'Unknown Artist';
            album.artist.profileImage = artistData.profileImage;
            album.artist.genre = artistData.genre;
            album.artist.bio = artistData.bio;
          }
        } catch (err) {
          console.warn(`Error poblando artista para álbum ${id}: ${err.message}`);
        }
      }
      
      res.json(new AlbumDTO(album));
    } catch (error) {
      console.error("Error en getAlbumById:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async createAlbum(req, res) {
    try {
      // Los datos del formulario se encuentran en req.body
      const albumData = req.body;
      
      // Verificar que artistId sea válido antes de continuar
      console.log('⚠️ artistId type:', typeof albumData.artistId);
      console.log('⚠️ artistId value:', albumData.artistId);
      
      if (!albumData.artistId) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere el ID del artista (artistId)'
        });
      }
      
      // NUEVA LÓGICA PARA MANEJAR OBJETO COMPLETO
      let artistIdValue = albumData.artistId;
      
      // Si artistId es un string complejo, puede ser un objeto serializado
      if (typeof artistIdValue === 'string') {
        // Comprobar si es un objeto serializado que contiene _id
        if (artistIdValue.includes('_id') && artistIdValue.includes('ObjectId')) {
          // Extraer el ID del formato "new ObjectId("ID")"
          const matches = artistIdValue.match(/ObjectId\("([^"]+)"\)/);
          if (matches && matches[1]) {
            artistIdValue = matches[1];
            console.log('ID extraído del objeto:', artistIdValue);
          } else {
            // Intentar buscar cualquier formato de ID entre comillas
            const idMatches = artistIdValue.match(/"([a-f0-9]{24})"/);
            if (idMatches && idMatches[1]) {
              artistIdValue = idMatches[1];
              console.log('ID alternativo extraído:', artistIdValue);
            }
          }
        }
        
        // Si parece un objeto JSON, intentar parsearlo
        if (artistIdValue.startsWith('{') && artistIdValue.includes('_id')) {
          try {
            // Limpiar strings malformados - reemplazar comillas simples por dobles
            const cleanedString = artistIdValue
              .replace(/([a-zA-Z0-9]+):/g, '"$1":')  // Agregar comillas a keys
              .replace(/'/g, '"');                   // Reemplazar comillas simples
              
            console.log('Intentando parsear:', cleanedString);
            
            // Intentar usar regex para extraer el ID directamente
            const objectIdMatch = cleanedString.match(/"_id"\s*:\s*(?:new ObjectId\()?["']([a-f0-9]{24})["']/i);
            if (objectIdMatch && objectIdMatch[1]) {
              artistIdValue = objectIdMatch[1];
              console.log('ID extraído via regex:', artistIdValue);
            } else {
              // Último intento: buscar cualquier ID de 24 caracteres
              const idMatch = cleanedString.match(/([a-f0-9]{24})/);
              if (idMatch) {
                artistIdValue = idMatch[1];
                console.log('ID de 24 caracteres encontrado:', artistIdValue);
              }
            }
          } catch (e) {
            console.error('Error parseando objeto artistId:', e);
          }
        }
      } else if (typeof artistIdValue === 'object' && artistIdValue._id) {
        // Es un objeto con _id
        artistIdValue = artistIdValue._id.toString();
        console.log('ID extraído del objeto:', artistIdValue);
      }
      
      // Verificar que el ID extraído sea válido
      if (!mongoose.Types.ObjectId.isValid(artistIdValue)) {
        return res.status(400).json({
          success: false,
          error: `ID de artista no válido después de procesamiento: "${artistIdValue}"`
        });
      }
      
      // Convertir artista a ObjectId explícitamente
      albumData.artist = new mongoose.Types.ObjectId(artistIdValue);
      console.log('🔍 artist (ObjectId):', albumData.artist);
      
      // Convertir campos numéricos
      albumData.price = parseFloat(albumData.price) || 9.99;
      albumData.releaseYear = parseInt(albumData.releaseYear) || new Date().getFullYear();
      
      // Convertir campos booleanos
      albumData.vinyl = albumData.vinyl === 'true' || albumData.vinyl === true;
      albumData.cd = albumData.cd === 'true' || albumData.cd === true;
      albumData.cassettes = albumData.cassettes === 'true' || albumData.cassettes === true;
      albumData.destacado = albumData.destacado === 'true' || albumData.destacado === true;
      
      // Procesar archivo de coverImage si existe
      if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        albumData.coverImage = "http://localhost:5000/assets/images/" + req.files.coverImage[0].filename;
      }
  
      // Procesar los archivos de las pistas (tracks)
      if (req.files && req.files.tracks) {
        // Extraer los metadatos de las pistas del formulario
        let trackTitles = albumData.trackTitles || [];
        let trackDurations = albumData.trackDurations || [];
        let trackAutors = albumData.trackAutors || [];
        
        // Asegurar que son arrays incluso si solo hay un elemento
        if (!Array.isArray(trackTitles)) trackTitles = [trackTitles].filter(Boolean);
        if (!Array.isArray(trackDurations)) trackDurations = [trackDurations].filter(Boolean);
        if (!Array.isArray(trackAutors)) trackAutors = [trackAutors].filter(Boolean);
        
        // Asociar cada archivo con sus metadatos
        albumData.tracks = req.files.tracks.map((file, index) => ({
          id: index + 1,
          title: (trackTitles[index] || file.originalname).trim(),
          duration: (trackDurations[index] || '0:00').trim(),
          url: "http://localhost:5000/assets/music/" + file.filename,
          autor: (trackAutors[index] || albumData.artistName || 'Unknown').trim(),
          n_reproducciones: 0
        }));
      }
      
      // Limpiar campos temporales que no pertenecen al modelo
      delete albumData.trackTitles;
      delete albumData.trackDurations;
      delete albumData.trackAutors;
      delete albumData.artistName;
      // NO ELIMINAR ARTISTID HASTA DESPUÉS DE CREAR EL ALBUM
      // delete albumData.artistId; // ← Esta línea estaba causando el problema
      
      console.log('⚠️ Antes de pasar a factory, artist es:', albumData.artist);
      console.log('⚠️ Antes de pasar a factory, artistId es:', albumData.artistId);
      
      if (albumData.artist instanceof mongoose.Types.ObjectId) {
        console.log('El tipo es ObjectId, correcto');
      } else if (typeof albumData.artist === 'string') {
        console.log('El tipo es string:', albumData.artist);
        if (mongoose.Types.ObjectId.isValid(albumData.artist)) {
          console.log('Es un string válido para ObjectId');
        } else {
          console.log('NO es un string válido para ObjectId');
        }
      } else if (typeof albumData.artist === 'object') {
        console.log('El tipo es object con propiedades:', Object.keys(albumData.artist));
      }
      
      console.log('albumData procesado:', albumData);
      
      // Crear la entidad álbum usando la fábrica
      try {
        const albumEntity = AlbumFactory.createAlbum(albumData);
        console.log('albumEntity creado por factory:', albumEntity);
        
        // Asegurarse de que el campo artist esté presente y sea válido
        if (!albumEntity.artist || !mongoose.Types.ObjectId.isValid(albumEntity.artist)) {
          console.error('Error: Campo artist inválido después de factory:', albumEntity.artist);
          return res.status(400).json({
            success: false,
            error: 'Error interno: Campo artist es inválido'
          });
        }
        
        const newAlbum = await AlbumDao.createAlbum(albumEntity);
        
        // Si el artista existe, actualizamos su colección de álbumes
        try {
          const artist = await Artist.findById(albumData.artist);
          if (artist) {
            artist.albums.push(newAlbum._id);
            await artist.save();
            console.log(`Álbum ${newAlbum._id} añadido al artista ${artist.name || artist.id}`);
          } else {
            console.log(`Artista con ID ${albumData.artist} no encontrado`);
          }
        } catch (artistError) {
          console.warn('Error al actualizar el artista:', artistError.message);
          // No queremos que un error aquí impida la creación del álbum
        }
        
        // Ahora sí podemos eliminar el artistId si es necesario
        delete albumData.artistId;
        
        res.status(201).json({ 
          success: true, 
          message: 'Álbum creado exitosamente', 
          album: new AlbumDTO(newAlbum) 
        });
      } catch (factoryError) {
        console.error('Error al crear el álbum desde la factory:', factoryError);
        return res.status(400).json({
          success: false,
          error: factoryError.message || 'Error al procesar los datos del álbum'
        });
      }
    } catch (error) {
      console.error('Error en createAlbum:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error interno del servidor' 
      });
    }
  }

  // El resto de los métodos permanecen sin cambios...
  async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const albumData = req.body;
      const updatedAlbum = await AlbumDao.updateAlbum(id, albumData);
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(new AlbumDTO(updatedAlbum));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async deleteAlbum(req, res) {
    try {
      const { id } = req.params;
      const deletedAlbum = await AlbumDao.deleteAlbum(id);
      if (!deletedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json({ message: 'Album deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async addRating(req, res) {
    try {
      const { id } = req.params;
      const { userId, rating, comment, profileImage } = req.body;
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ success: false, error: 'Album not found' });
      }
      album.ratings.push({ userId, rating, comment, profileImage });
      await album.save();
      res.json({ success: true, album });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async downloadTrack(req, res) {
    try {
      const { id } = req.params;
      const format = req.query.format || 'mp3';
      const trackIdParam = req.query.trackId;
      
      // Convertir a número si es posible (para compatibilidad con IDs numéricos)
      const trackId = !isNaN(trackIdParam) ? parseInt(trackIdParam) : trackIdParam;
            
      // Verificar que el formato solicitado es válido
      if (!['mp3', 'wav', 'flac'].includes(format)) {
        return res.status(400).json({ error: 'Formato no válido. Use mp3, wav o flac.' });
      }
      
      // Buscar el álbum - manejar posibles errores de conversión
      let album;
      try {
        album = await AlbumDao.getAlbumById(id);
      } catch (error) {
        console.error(`Error al obtener el álbum con id ${id}:`, error.message);
        return res.status(500).json({ 
          error: `Error al obtener el álbum con id ${id}`, 
          details: error.message 
        });
      }
      
      if (!album) {
        return res.status(404).json({ error: 'Álbum no encontrado' });
      }
      
      // Buscar la pista dentro del álbum con comparación flexible
      let track;
      
      // Intentar buscar por ID exacto (número o string)
      track = album.tracks.find(t => t.id === trackId);
      
      // Si no se encontró, intentar buscar convirtiendo ambos a string
      if (!track) {
        track = album.tracks.find(t => String(t.id) === String(trackId));
      }
      
      // Si sigue sin encontrarse, verificar si estamos tratando con un índice
      if (!track && !isNaN(trackId) && trackId >= 0 && trackId < album.tracks.length) {
        track = album.tracks[trackId];
      }
      
      if (!track) {
        return res.status(404).json({ 
          error: 'Pista no encontrada en este álbum',
          details: `ID de pista solicitado: ${trackId}, pistas disponibles: ${album.tracks.map(t => t.id).join(', ')}`
        });
      }
            
      // Verificar si la URL existe
      if (!track.url) {
        return res.status(404).json({ error: 'URL de audio no encontrada' });
      }
      
      // Extraer solo el nombre del archivo de la URL
      const urlParts = track.url.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      // Construir la ruta al archivo usando path.join
      const audioPath = path.join(MUSIC_FILES_PATH, filename);
            
      // Sanitizar el nombre del track para el archivo de descarga
      const safeTrackTitle = track.title.replace(/[\/\\:*?"<>|]/g, '_');
      
      // Verificar si el archivo existe
      if (!fs.existsSync(audioPath)) {
        // Intentar encontrar el archivo por su nombre en la carpeta de música
        const files = fs.readdirSync(MUSIC_FILES_PATH);
        
        // Buscar un archivo que coincida con el nombre o que lo contenga
        const matchingFile = files.find(file => 
          file.toLowerCase() === filename.toLowerCase() || 
          file.toLowerCase().includes(filename.toLowerCase())
        );
        
        if (matchingFile) {
          const newPath = path.join(MUSIC_FILES_PATH, matchingFile);
          
          // Si el formato es MP3 y el archivo ya es compatible, enviar directamente
          if (format === 'mp3' && newPath.toLowerCase().endsWith('.mp3')) {
            return res.download(newPath, `${safeTrackTitle}.mp3`);
          }
          
          // Para otros formatos, convertir usando el nuevo servicio
          const tempDir = os.tmpdir();
          const outputPath = path.join(tempDir, `${track.title}-${Date.now()}.${format}`);
          
          try {
            // Usar el nuevo servicio de conversión
            await audioConverter.convertAudio(newPath, outputPath, format);
            
            // Enviar el archivo convertido
            return res.download(outputPath, `${safeTrackTitle}.${format}`, (err) => {
              // Limpiar el archivo temporal después de la descarga
              fs.unlink(outputPath, () => {});
              
              if (err) {
                console.error(`Error al enviar el archivo: ${err.message}`);
              }
            });
          } catch (conversionError) {
            console.error(`Error en la conversión: ${conversionError.message}`);
            return res.status(500).json({ error: 'Error al convertir el archivo' });
          }
        }
        
        return res.status(404).json({ 
          error: 'Archivo de audio no encontrado en el servidor',
          details: `Buscando: ${audioPath}. Archivos disponibles: ${files.join(', ')}`
        });
      }
      
      // Si el formato es MP3 y el archivo ya es compatible, enviar directamente
      if (format === 'mp3' && audioPath.toLowerCase().endsWith('.mp3')) {
        return res.download(audioPath, `${safeTrackTitle}.mp3`);
      }
      
      // Para otros formatos, convertir usando el nuevo servicio
      const tempDir = os.tmpdir();
      const outputPath = path.join(tempDir, `${track.title}-${Date.now()}.${format}`);
      
      try {
        // Usar el nuevo servicio de conversión
        await audioConverter.convertAudio(audioPath, outputPath, format);
        
        // Enviar el archivo convertido
        return res.download(outputPath, `${safeTrackTitle}.${format}`, (err) => {
          // Limpiar el archivo temporal después de la descarga
          fs.unlink(outputPath, () => {});
          
          if (err) {
            console.error(`Error al enviar el archivo: ${err.message}`);
          }
        });
      } catch (conversionError) {
        console.error(`Error en la conversión: ${conversionError.message}`);
        return res.status(500).json({ error: 'Error al convertir el archivo' });
      }
      
    } catch (error) {
      console.error('Error en downloadTrack:', error);
      res.status(500).json({ 
        error: 'Error al procesar la descarga', 
        details: error.message 
      });
    }
  }
  
  async downloadAlbum(req, res) {
    try {
      const { id } = req.params;
      const format = req.query.format || 'mp3';
            
      // Verificar formato válido
      if (!['mp3', 'wav', 'flac'].includes(format)) {
        return res.status(400).json({ error: 'Formato no válido. Use mp3, wav o flac.' });
      }
      
      // Buscar el álbum
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Álbum no encontrado' });
      }
            
      // Si el álbum no tiene pistas
      if (!album.tracks || album.tracks.length === 0) {
        return res.status(404).json({ error: 'Este álbum no tiene pistas' });
      }
      
      // Sanitizar el título del álbum para el nombre del archivo ZIP
      const safeAlbumTitle = album.title.replace(/[\/\\:*?"<>|]/g, '_');
      
      // Listar los archivos disponibles en la carpeta de música
      let availableFiles = [];
      try {
        availableFiles = fs.readdirSync(MUSIC_FILES_PATH);
      } catch (err) {
        console.error(`Error al leer directorio de música: ${err.message}`);
        return res.status(500).json({ 
          error: 'Error al acceder a los archivos de música',
          details: err.message
        });
      }
      
      // Crear directorio temporal para los archivos convertidos
      const tempDir = path.join(os.tmpdir(), `album-${id}-${Date.now()}`);
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      // Promesas para todas las conversiones
      const conversionPromises = [];
      
      // Para cada pista, procesar
      for (const track of album.tracks) {
        
        if (!track.url) {
          continue;
        }
        
        // Extraer solo el nombre del archivo de la URL
        const urlParts = track.url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        // Buscar el archivo en la lista de archivos disponibles
        let audioPath = path.join(MUSIC_FILES_PATH, filename);
        
        if (!fs.existsSync(audioPath)) {
          
          // Buscar un archivo que coincida con el nombre o que lo contenga
          const matchingFile = availableFiles.find(file => 
            file.toLowerCase() === filename.toLowerCase() || 
            file.toLowerCase().includes(filename.toLowerCase())
          );
          
          if (matchingFile) {
            audioPath = path.join(MUSIC_FILES_PATH, matchingFile);
          } else {
            continue; // Ignorar este archivo y continuar con el siguiente
          }
        }
        
        // Ruta de salida para este archivo
        const outputPath = path.join(tempDir, `${track.title || `track-${track.id}`}.${format}`);
        
        // Crear una promesa para la conversión
        const conversionPromise = new Promise(async (resolve, reject) => {
          try {
            // Si el formato es MP3 y el archivo ya es compatible, simplemente copiar
            if (format === 'mp3' && audioPath.toLowerCase().endsWith('.mp3')) {
              await fs.promises.copyFile(audioPath, outputPath);
              resolve();
              return;
            }
            
            // Para otros formatos, usar el nuevo servicio
            await audioConverter.convertAudio(audioPath, outputPath, format);
            resolve();
          } catch (error) {
            console.error(`Error convirtiendo ${track.title}: ${error.message}`);
            reject(error);
          }
        });
        
        conversionPromises.push(conversionPromise);
      }
      
      // Esperar a que todas las conversiones terminen
      try {
        await Promise.allSettled(conversionPromises);
        
        // Verificar si se ha generado al menos un archivo
        const files = await fs.promises.readdir(tempDir);
        if (files.length === 0) {
          throw new Error("No se pudo generar ningún archivo");
        }
        
        // Crear un archivo ZIP con todas las pistas usando el nombre del álbum
        const zipPath = path.join(os.tmpdir(), `${safeAlbumTitle}-${format}-${Date.now()}.zip`);
        
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 } // Máxima compresión
        });
        
        // Manejar eventos del archivo
        output.on('close', function() {
          
          // Enviar el ZIP como descarga con el nombre del álbum
          res.download(zipPath, `${safeAlbumTitle}.zip`, (err) => {
            if (err) {
              console.error(`Error al enviar ZIP: ${err.message}`);
            }
            
            // Limpiar archivos temporales
            fs.unlink(zipPath, () => {});
            fs.rm(tempDir, { recursive: true, force: true }, () => {});
          });
        });
        
        archive.on('error', function(err) {
          console.error(`Error creando ZIP: ${err.message}`);
          fs.rm(tempDir, { recursive: true, force: true }, () => {});
          res.status(500).json({ error: 'Error al crear el archivo ZIP' });
        });
        
        // Pipe el output al response
        archive.pipe(output);
        
        // Agregar archivos al ZIP
        archive.directory(tempDir, false);
        
        // Finalizar el archivo
        archive.finalize();
        
      } catch (conversionError) {
        console.error(`Error en las conversiones: ${conversionError.message}`);
        fs.rm(tempDir, { recursive: true, force: true }, () => {});
        res.status(500).json({ error: 'Error al convertir los archivos' });
      }
      
    } catch (error) {
      console.error(`Error en downloadAlbum: ${error.message}`);
      console.error(error.stack);
      res.status(500).json({ 
        error: 'Error al procesar la descarga del álbum', 
        details: error.message
      });
    }
  }
}

module.exports = new AlbumController();