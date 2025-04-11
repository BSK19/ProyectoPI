const News = require('../models/News');
const NewsDTO = require('../dto/NewsDTO');

class NewsFactory {
    // Crea una instancia del modelo News a partir de datos crudos
    static createNews(data) {
        return new News({
            titulo: data.titulo,
            body: data.body,
            image: data.image || '',
            fechaPublicacion: data.fechaPublicacion,
            autor: data.autor,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        });
    }

    // Convierte una instancia del modelo (o documento) News a un DTO
    static createNewsDTO(news) {
        return new NewsDTO(news);
    }
}

module.exports = NewsFactory;