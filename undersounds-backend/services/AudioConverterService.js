// Archivo: undersounds-backend/services/AudioConverterService.js
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

// Configurar ffmpeg para usar la versión estática
ffmpeg.setFfmpegPath(ffmpegPath);

class AudioConverterService {
  /**
   * Convierte un archivo de audio al formato especificado
   * @param {string} inputPath - Ruta del archivo de entrada
   * @param {string} outputPath - Ruta del archivo de salida
   * @param {string} format - Formato de salida (mp3, wav, flac)
   * @returns {Promise<string>} - Promesa que resuelve a la ruta del archivo convertido
   */
  convertAudio(inputPath, outputPath, format) {
    return new Promise((resolve, reject) => {
      console.log(`Iniciando conversión a ${format}: ${inputPath} -> ${outputPath}`);
      
      let command = ffmpeg(inputPath);
      
      // Configuración según formato
      if (format === 'wav') {
        command = command.audioCodec('pcm_s16le');
      } else if (format === 'flac') {
        command = command.audioCodec('flac');
      } else {
        // MP3 con alta calidad
        command = command.audioCodec('libmp3lame').audioQuality(0);
      }
      
      // Ejecutar la conversión
      command
        .on('start', (commandLine) => {
          console.log(`Comando ffmpeg ejecutado: ${commandLine}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Progreso de conversión: ${Math.floor(progress.percent)}%`);
          }
        })
        .on('error', (err) => {
          console.error(`Error en la conversión: ${err.message}`);
          reject(err);
        })
        .on('end', () => {
          console.log(`Conversión completada: ${outputPath}`);
          resolve(outputPath);
        })
        .save(outputPath);
    });
  }
  
  /**
   * Verifica si un archivo es compatible con el formato especificado
   * @param {string} filePath - Ruta del archivo a verificar
   * @param {string} targetFormat - Formato objetivo
   * @returns {Promise<boolean>} - Promesa que resuelve a true si el archivo ya está en el formato correcto
   */
  async isFormatCompatible(filePath, targetFormat) {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error(`Error al analizar archivo: ${err.message}`);
          resolve(false);
          return;
        }
        
        // Revisar el formato del archivo
        try {
          const format = metadata.format.format_name.toLowerCase();
          
          if (targetFormat === 'mp3' && format.includes('mp3')) {
            resolve(true);
          } else if (targetFormat === 'wav' && format.includes('wav')) {
            resolve(true);
          } else if (targetFormat === 'flac' && format.includes('flac')) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.error(`Error al verificar formato: ${e.message}`);
          resolve(false);
        }
      });
    });
  }
}

module.exports = new AudioConverterService();