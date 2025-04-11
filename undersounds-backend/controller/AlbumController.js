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

// Usar rutas relativas para los archivos de música
const MUSIC_FILES_PATH = path.join(process.cwd(), '..', 'undersounds-frontend', 'src', 'assets', 'music');

class AlbumController {
  async getAlbums(req, res) {
    try {
      const albums = await AlbumDao.getAlbums();
      const albumDTOs = albums.map(album => new AlbumDTO(album));
      res.json(albumDTOs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(new AlbumDTO(album));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async createAlbum(req, res) {
    try {
      // Los datos del formulario se encuentran en req.body
      const albumData = req.body;
      albumData.price = 10;
      
      // Procesar archivo de coverImage si existe (asegúrate de que Multer lo haya cargado)
      if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        albumData.coverImage = "http://localhost:5000/assets/images/" + req.files.coverImage [0].filename;
      }
  
      // Procesar los archivos de las pistas (tracks)
      // Procesar los archivos de las pistas (tracks)
      if (req.files && req.files.tracks) {
        // Se espera que los títulos de las pistas se envíen en el campo "trackTitles"
        let trackTitles = albumData.trackTitles || [];
        if (!Array.isArray(trackTitles)) {
          trackTitles = [trackTitles];
        }
        // Asocia cada archivo de pista con su título; si no se proporciona, usa el nombre del archivo. 
        // Además, asigna valores por defecto para "n_reproducciones" y "author".
        albumData.tracks = req.files.tracks.map((file, index) => ({
          title: file.originalname, // Título de la pista o nombre del archivo
          filePath: file.path,
          url: "http://localhost:5000/assets/music/" + file.filename, // URL por defecto
          duration: "0:00", // Valor por defecto para la duración
          n_reproducciones: 0, // Valores por defecto para reproducciones
          autor: albumData.artist || 'Unknown' // Se toma el artista del álbum o se asigna 'Unknown'
        }));
      }

      console.log('albumData recibido:', albumData); // Depuración

      // Crear la entidad álbum usando la fábrica
      const albumEntity = AlbumFactory.createAlbum(albumData);
      const newAlbum = await AlbumDao.createAlbum(albumEntity);
      res.status(201).json(new AlbumDTO(newAlbum));
    } catch (error) {
      console.error('Error en createAlbum:', error);
      res.status(500).json({ error: error.message });
    }
  }

  
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