const News = require('../models/News');

class NewsDAO {
    async createNews(newsData) {
        try {
            const news = new News(newsData);
            return await news.save();
        } catch (error) {
            throw new Error(`Error al crear la noticia: ${error.message}`);
        }
    }

    async getNews(filter = {}) {
        try {
            return await News.find(filter).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener las noticias: ${error.message}`);
        }
    }

    async getNewsById(id) {
        try {
            return await News.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener la noticia con id ${id}: ${error.message}`);
        }
    }

    async updateNews(id, newsData) {
        try {
            newsData.updatedAt = Date.now();
            return await News.findByIdAndUpdate(id, newsData, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar la noticia con id ${id}: ${error.message}`);
        }
    }

    async deleteNews(id) {
        try {
            return await News.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar la noticia con id ${id}: ${error.message}`);
        }
    }
}

module.exports = new NewsDAO();