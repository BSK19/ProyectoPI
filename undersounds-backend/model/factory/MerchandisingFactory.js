const MerchDTO = require('../dto/MerchandisingDTO');
const Merch = require('../models/Merchandising');

class MerchFactory {
    // Crear merchandising nuevo
    static async createMerch(data) {
        const merchDTO = new MerchDTO(data);

        // Validar los datos usando el DTO
        try {
            merchDTO.validate();
        } catch (err) {
            throw new Error(`Error en la validación de merchandising: ${err.message}`);
        }

        // Si la validación pasa, creamos el merchandising en la base de datos
        const newMerch = new Merch({
            name: merchDTO.name,
            description: merchDTO.description,
            price: merchDTO.price,
            image: merchDTO.image,
            type: merchDTO.type,
            artistId: merchDTO.artistId
        });

        // Guardar en la base de datos
        return await newMerch.save();
    }

    // Aquí podrías agregar más métodos si necesitas otros tipos de creación de merchandising
}

module.exports = MerchFactory;