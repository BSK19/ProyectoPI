const mongoose = require('mongoose');

class AlbumFactory {
  createAlbum(data) {
    console.log('AlbumFactory recibió:', {
      artist: data.artist,
      artistId: data.artistId,
      title: data.title
    });
    
    // Priorizar el campo artist si ya es un ObjectId
    let artistRef = null;
    
    // 1. Comprobar si artist ya es un ObjectId válido
    if (data.artist && data.artist instanceof mongoose.Types.ObjectId) {
      artistRef = data.artist;
      console.log('Usando campo artist existente (ObjectId):', artistRef);
    } 
    // 2. Comprobar si artist es string pero válido para ObjectId
    else if (data.artist && typeof data.artist === 'string' && mongoose.Types.ObjectId.isValid(data.artist)) {
      artistRef = new mongoose.Types.ObjectId(data.artist);
      console.log('Convertido artist string a ObjectId:', artistRef);
    }
    // 3. Si hay artistId, intentar usarlo
    else if (data.artistId && mongoose.Types.ObjectId.isValid(data.artistId)) {
      artistRef = new mongoose.Types.ObjectId(data.artistId);
      console.log('Usando artistId convertido a ObjectId:', artistRef);
    }
    // 4. Caso especial: artist es un objeto con _id
    else if (data.artist && typeof data.artist === 'object' && data.artist._id) {
      if (mongoose.Types.ObjectId.isValid(data.artist._id)) {
        artistRef = new mongoose.Types.ObjectId(data.artist._id);
        console.log('Extraído _id de objeto artist:', artistRef);
      }
    }
    
    if (!artistRef) {
      console.error('⚠️ No se pudo obtener un ID de artista válido:', {
        artist: data.artist,
        artistId: data.artistId
      });
      throw new Error('Se requiere un ID de artista válido para crear un álbum');
    }
    
    console.log('🟢 Artist ID válido encontrado:', artistRef);
    
    return {
      title: data.title,
      artist: artistRef,
      coverImage: data.coverImage || '',
      price: data.price || 0,
      releaseYear: data.releaseYear || new Date().getFullYear(),
      genre: data.genre || '',
      tracks: data.tracks || [],
      ratings: data.ratings || [],
      vinyl: data.vinyl || false,
      cd: data.cd || false,
      cassettes: data.cassettes || false,
      destacado: data.destacado || false,
      description: data.description || '',
      label: data.label || ''
    };
  }
}

module.exports = new AlbumFactory();