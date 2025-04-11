const AlbumDao = require('../model/dao/AlbumDao');
const AlbumDTO = require('../model/dto/AlbumDTO');
const AlbumFactory = require('../model/factory/AlbumFactory');
const { Artist } = require('../model/models/Artistas');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const archiver = require('archiver');
const axios = require('axios');

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
      const albumData = req.body;
      const albumEntity = AlbumFactory.createAlbum(albumData);
      const newAlbum = await AlbumDao.createAlbum(albumEntity);
      const artist = await Artist.findOne({ id: albumData.artistId });
      if (artist) {
        artist.albums.push(newAlbum._id);
        await artist.save();
      }
      res.status(201).json(new AlbumDTO(newAlbum));
    } catch (error) {
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
      console.log("Iniciando descarga de track");
      const { id } = req.params;
      const format = req.query.format || 'mp3';
      const trackIdParam = req.query.trackId;
      
      // Convertir a número si es posible (para compatibilidad con IDs numéricos)
      const trackId = !isNaN(trackIdParam) ? parseInt(trackIdParam) : trackIdParam;
      
      console.log(`Album ID: ${id}, Track ID: ${trackId}, Format: ${format}`);
      
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
      
      console.log(`Pista encontrada: ${track.title}, URL: ${track.url}`);
      
      // Verificar si la URL existe
      if (!track.url) {
        return res.status(404).json({ error: 'URL de audio no encontrada' });
      }
      
      // Extraer solo el nombre del archivo de la URL
      const urlParts = track.url.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      // Construir la ruta al archivo usando path.join
      const audioPath = path.join(MUSIC_FILES_PATH, filename);
      
      console.log(`Ruta del archivo: ${audioPath}`);
      
      // Verificar si el archivo existe
      if (!fs.existsSync(audioPath)) {
        console.log(`¡ADVERTENCIA! Archivo no encontrado en: ${audioPath}`);
        // Intentar encontrar el archivo por su nombre en la carpeta de música
        const files = fs.readdirSync(MUSIC_FILES_PATH);
        console.log(`Archivos disponibles: ${files.join(', ')}`);
        
        // Buscar un archivo que coincida con el nombre o que lo contenga
        const matchingFile = files.find(file => 
          file.toLowerCase() === filename.toLowerCase() || 
          file.toLowerCase().includes(filename.toLowerCase())
        );
        
        if (matchingFile) {
          const newPath = path.join(MUSIC_FILES_PATH, matchingFile);
          console.log(`Archivo encontrado con nombre similar: ${newPath}`);
          
          // Si el formato es MP3, enviar el archivo directamente
          if (format === 'mp3') {
            return res.download(newPath, `${track.title}.mp3`);
          }
          
          // Para otros formatos, código de conversión incluido directamente (en lugar de llamar a this.convertAndSendFile)
          const tempDir = os.tmpdir();
          const outputPath = path.join(tempDir, `${track.title}-${Date.now()}.${format}`);
          
          console.log(`Iniciando conversión a ${format}, salida: ${outputPath}`);
          
          // Crear el proceso ffmpeg para convertir
          let ffmpegArgs;
          if (format === 'wav') {
            ffmpegArgs = ['-i', newPath, '-acodec', 'pcm_s16le', outputPath];
          } else if (format === 'flac') {
            ffmpegArgs = ['-i', newPath, '-c:a', 'flac', outputPath];
          } else {
            ffmpegArgs = ['-i', newPath, '-c:a', 'libmp3lame', '-q:a', '0', outputPath];
          }
          
          const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
          
          // Capturar logs para debugging
          ffmpegProcess.stderr.on('data', (data) => {
            console.log(`FFmpeg log: ${data}`);
          });
          
          // Manejar el resultado del proceso
          ffmpegProcess.on('close', (code) => {
            if (code !== 0) {
              console.error(`FFmpeg process exited with code ${code}`);
              return res.status(500).json({ error: 'Error al convertir el archivo' });
            }
            
            console.log(`Conversión exitosa, enviando archivo: ${outputPath}`);
            
            // Enviar el archivo convertido
            res.download(outputPath, `${track.title}.${format}`, (err) => {
              // Limpiar el archivo temporal después de la descarga
              fs.unlink(outputPath, () => {});
              
              if (err) {
                console.error(`Error al enviar el archivo: ${err.message}`);
              }
            });
          });
          
          ffmpegProcess.on('error', (err) => {
            console.error(`Error iniciando el proceso FFmpeg: ${err.message}`);
            res.status(500).json({ error: 'Error al iniciar el proceso de conversión' });
          });
          
          return; // Importante para evitar que continúe la ejecución
        }
        
        return res.status(404).json({ 
          error: 'Archivo de audio no encontrado en el servidor',
          details: `Buscando: ${audioPath}. Archivos disponibles: ${files.join(', ')}`
        });
      }
      
      // Si el formato es MP3, enviar el archivo directamente
      if (format === 'mp3') {
        console.log("Enviando archivo MP3 original");
        return res.download(audioPath, `${track.title}.mp3`);
      }
      
      // Para otros formatos, código de conversión incluido directamente (evitando el uso de this.convertAndSendFile)
      const tempDir = os.tmpdir();
      const outputPath = path.join(tempDir, `${track.title}-${Date.now()}.${format}`);
      
      console.log(`Iniciando conversión a ${format}, salida: ${outputPath}`);
      
      // Crear el proceso ffmpeg para convertir
      let ffmpegArgs;
      if (format === 'wav') {
        ffmpegArgs = ['-i', audioPath, '-acodec', 'pcm_s16le', outputPath];
      } else if (format === 'flac') {
        ffmpegArgs = ['-i', audioPath, '-c:a', 'flac', outputPath];
      } else {
        ffmpegArgs = ['-i', audioPath, '-c:a', 'libmp3lame', '-q:a', '0', outputPath];
      }
      
      const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
      
      // Capturar logs para debugging
      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg log: ${data}`);
      });
      
      // Manejar el resultado del proceso
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`FFmpeg process exited with code ${code}`);
          return res.status(500).json({ error: 'Error al convertir el archivo' });
        }
        
        console.log(`Conversión exitosa, enviando archivo: ${outputPath}`);
        
        // Enviar el archivo convertido
        res.download(outputPath, `${track.title}.${format}`, (err) => {
          // Limpiar el archivo temporal después de la descarga
          fs.unlink(outputPath, () => {});
          
          if (err) {
            console.error(`Error al enviar el archivo: ${err.message}`);
          }
        });
      });
      
      ffmpegProcess.on('error', (err) => {
        console.error(`Error iniciando el proceso FFmpeg: ${err.message}`);
        res.status(500).json({ error: 'Error al iniciar el proceso de conversión' });
      });
      
    } catch (error) {
      console.error('Error en downloadTrack:', error);
      res.status(500).json({ 
        error: 'Error al procesar la descarga', 
        details: error.message 
      });
    }
  }
  
  // Mantenemos este método para posible uso futuro, pero ya no lo llamamos desde downloadTrack
  async convertAndSendFile(audioPath, format, title, res) {
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, `${title}-${Date.now()}.${format}`);
    
    console.log(`Iniciando conversión a ${format}, salida: ${outputPath}`);
    
    // Crear el proceso ffmpeg para convertir
    let ffmpegArgs;
    if (format === 'wav') {
      ffmpegArgs = ['-i', audioPath, '-acodec', 'pcm_s16le', outputPath];
    } else if (format === 'flac') {
      ffmpegArgs = ['-i', audioPath, '-c:a', 'flac', outputPath];
    } else {
      ffmpegArgs = ['-i', audioPath, '-c:a', 'libmp3lame', '-q:a', '0', outputPath];
    }
    
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
    
    // Capturar logs para debugging
    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg log: ${data}`);
    });
    
    // Manejar el resultado del proceso
    ffmpegProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`FFmpeg process exited with code ${code}`);
        return res.status(500).json({ error: 'Error al convertir el archivo' });
      }
      
      console.log(`Conversión exitosa, enviando archivo: ${outputPath}`);
      
      // Enviar el archivo convertido
      res.download(outputPath, `${title}.${format}`, (err) => {
        // Limpiar el archivo temporal después de la descarga
        fs.unlink(outputPath, () => {});
        
        if (err) {
          console.error(`Error al enviar el archivo: ${err.message}`);
        }
      });
    });
    
    ffmpegProcess.on('error', (err) => {
      console.error(`Error iniciando el proceso FFmpeg: ${err.message}`);
      res.status(500).json({ error: 'Error al iniciar el proceso de conversión' });
    });
  }
  
  async downloadAlbum(req, res) {
    try {
      console.log("Iniciando descarga de álbum");
      const { id } = req.params;
      const format = req.query.format || 'mp3';
      
      console.log(`Album ID: ${id}, Format: ${format}`);
      
      // Verificar formato válido
      if (!['mp3', 'wav', 'flac'].includes(format)) {
        return res.status(400).json({ error: 'Formato no válido. Use mp3, wav o flac.' });
      }
      
      // Buscar el álbum
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Álbum no encontrado' });
      }
      
      console.log(`Álbum encontrado: ${album.title}, procesando ${album.tracks?.length || 0} pistas`);
      
      // Si el álbum no tiene pistas
      if (!album.tracks || album.tracks.length === 0) {
        return res.status(404).json({ error: 'Este álbum no tiene pistas' });
      }
      
      // Listar los archivos disponibles en la carpeta de música
      let availableFiles = [];
      try {
        availableFiles = fs.readdirSync(MUSIC_FILES_PATH);
        console.log(`Archivos de música disponibles: ${availableFiles.join(', ')}`);
      } catch (err) {
        console.error(`Error al leer directorio de música: ${err.message}`);
        console.log(`Ruta intentada: ${MUSIC_FILES_PATH}`);
        return res.status(500).json({ 
          error: 'Error al acceder a los archivos de música',
          details: err.message
        });
      }
      
      // Crear directorio temporal para los archivos convertidos
      const tempDir = path.join(os.tmpdir(), `album-${id}-${Date.now()}`);
      console.log(`Creando directorio temporal: ${tempDir}`);
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      // Promesas para todas las conversiones
      const conversionPromises = [];
      
      // Para cada pista, procesar
      for (const track of album.tracks) {
        console.log(`Procesando pista: ${track.title}, URL: ${track.url}`);
        
        if (!track.url) {
          console.log(`¡ADVERTENCIA! La pista ${track.id || 'desconocida'} no tiene URL`);
          continue;
        }
        
        // Extraer solo el nombre del archivo de la URL
        const urlParts = track.url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        // Buscar el archivo en la lista de archivos disponibles
        let audioPath = path.join(MUSIC_FILES_PATH, filename);
        
        if (!fs.existsSync(audioPath)) {
          console.log(`¡ADVERTENCIA! Archivo no encontrado: ${audioPath}`);
          
          // Buscar un archivo que coincida con el nombre o que lo contenga
          const matchingFile = availableFiles.find(file => 
            file.toLowerCase() === filename.toLowerCase() || 
            file.toLowerCase().includes(filename.toLowerCase())
          );
          
          if (matchingFile) {
            audioPath = path.join(MUSIC_FILES_PATH, matchingFile);
            console.log(`Archivo encontrado con nombre similar: ${audioPath}`);
          } else {
            console.log(`No se encontró ningún archivo similar a ${filename}`);
            continue; // Ignorar este archivo y continuar con el siguiente
          }
        }
        
        // Ruta de salida para este archivo
        const outputPath = path.join(tempDir, `${track.title || `track-${track.id}`}.${format}`);
        
        // Crear una promesa para la conversión
        const conversionPromise = new Promise((resolve, reject) => {
          // Si el formato es MP3 y el archivo ya está en MP3, simplemente copiar
          if (format === 'mp3' && audioPath.toLowerCase().endsWith('.mp3')) {
            fs.copyFile(audioPath, outputPath, (err) => {
              if (err) {
                console.error(`Error copiando archivo: ${err.message}`);
                reject(err);
              } else {
                console.log(`Archivo copiado a ${outputPath}`);
                resolve();
              }
            });
            return;
          }
          
          // Para otros formatos, convertir
          console.log(`Iniciando conversión de ${track.title} a ${format}`);
          
          // Configurar argumentos para ffmpeg
          let ffmpegArgs;
          if (format === 'wav') {
            ffmpegArgs = ['-i', audioPath, '-acodec', 'pcm_s16le', outputPath];
          } else if (format === 'flac') {
            ffmpegArgs = ['-i', audioPath, '-c:a', 'flac', outputPath];
          } else {
            ffmpegArgs = ['-i', audioPath, '-c:a', 'libmp3lame', '-q:a', '0', outputPath];
          }
          
          // Iniciar proceso de ffmpeg
          const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
          
          ffmpegProcess.stderr.on('data', (data) => {
            console.log(`FFmpeg log para ${track.title}: ${data}`);
          });
          
          ffmpegProcess.on('close', (code) => {
            if (code !== 0) {
              console.error(`FFmpeg process para ${track.title} exited with code ${code}`);
              reject(new Error(`Conversión fallida para ${track.title}`));
            } else {
              console.log(`Conversión exitosa para ${track.title}`);
              resolve();
            }
          });
          
          ffmpegProcess.on('error', (err) => {
            console.error(`Error iniciando FFmpeg para ${track.title}: ${err.message}`);
            reject(err);
          });
        });
        
        conversionPromises.push(conversionPromise);
      }
      
      // Esperar a que todas las conversiones terminen
      try {
        await Promise.allSettled(conversionPromises);
        console.log("Todas las conversiones han terminado");
        
        // Verificar si se ha generado al menos un archivo
        const files = await fs.promises.readdir(tempDir);
        if (files.length === 0) {
          throw new Error("No se pudo generar ningún archivo");
        }
        
        // Crear un archivo ZIP con todas las pistas
        const zipPath = path.join(os.tmpdir(), `${album.title}-${format}-${Date.now()}.zip`);
        console.log(`Creando ZIP en: ${zipPath}`);
        
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 } // Máxima compresión
        });
        
        // Manejar eventos del archivo
        output.on('close', function() {
          console.log(`ZIP creado, tamaño: ${archive.pointer()} bytes`);
          
          // Enviar el ZIP como descarga
          res.download(zipPath, `${album.title}.zip`, (err) => {
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

  // Método auxiliar para convertir formato de audio
  async convertAudioFormat(inputPath, format, outputPath) {
    return new Promise((resolve, reject) => {
      // Definir parámetros según formato
      let ffmpegArgs;
      
      if (format === 'wav') {
        ffmpegArgs = ['-i', inputPath, '-acodec', 'pcm_s16le', outputPath];
      } else if (format === 'flac') {
        ffmpegArgs = ['-i', inputPath, '-c:a', 'flac', outputPath];
      } else {
        // Para mp3, usar alta calidad
        ffmpegArgs = ['-i', inputPath, '-c:a', 'libmp3lame', '-q:a', '0', outputPath];
      }
      
      // Ejecutar ffmpeg con los argumentos
      const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
      
      // Manejar eventos
      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg log: ${data}`);
      });
      
      ffmpegProcess.on('error', (err) => {
        reject(new Error(`Failed to start FFmpeg process: ${err.message}`));
      });
    });
  }

  // Método auxiliar para crear archivo ZIP
  async createZipArchive(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Nivel de compresión máximo
      });
      
      output.on('close', () => {
        resolve(outputPath);
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}

module.exports = new AlbumController();