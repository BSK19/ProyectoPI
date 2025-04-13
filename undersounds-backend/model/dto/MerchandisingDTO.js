class MerchDTO {
    constructor(data) {
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.image = data.image;
        this.type = data.type;
        this.artistId = data.artistId || null; // Opcional
    }

    // Validaciones
    validate() {
        if (
            this.name == null ||
            this.description == null ||
            this.price == null ||
            this.image == null ||
            this.type == null
        ) {
            throw new Error("Faltan campos obligatorios en el merchandising.");
        }
    
        if (typeof this.price !== 'number') {
            throw new Error("El precio debe ser un número.");
        }
    
        if (![0, 1, 2, 3, 4].includes(this.type)) {
            throw new Error("El tipo de merchandising es inválido. (0 = vinilo, 1 = CD, 2 = camiseta)");
        }
    }
}

module.exports = MerchDTO;