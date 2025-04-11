const NewsDAO = require('../model/dao/NewsDAO');
const NewsFactory = require('../model/factory/NewsFactory');
const NewsDTO = require('../model/dto/NewsDTO');

class NewsController {
    // Crea una noticia
    async createNews(req, res) {
        try {
            const newsData = req.body;
            // Se crea la instancia usando el factory
            const newsInstance = NewsFactory.createNews(newsData);
            const createdNews = await NewsDAO.createNews(newsInstance);
            return res.status(201).json(new NewsDTO(createdNews));
        } catch (error) {
            return res.status(500).json({ error: `Error al crear la noticia: ${error.message}` });
        }
    }

    // Obtiene todas las noticias
    async getNews(req, res) {
        try {
            const newsList = await NewsDAO.getNews();
            const newsDTOList = newsList.map(news => NewsFactory.createNewsDTO(news));
            return res.status(200).json(newsDTOList);
        } catch (error) {
            return res.status(500).json({ error: `Error al obtener las noticias: ${error.message}` });
        }
    }

    // Obtiene una noticia por id
    async getNewsById(req, res) {
        try {
            const { id } = req.params;
            const news = await NewsDAO.getNewsById(id);
            if (!news) {
                return res.status(404).json({ error: 'Noticia no encontrada' });
            }
            return res.status(200).json(NewsFactory.createNewsDTO(news));
        } catch (error) {
            return res.status(500).json({ error: `Error al obtener la noticia con id ${req.params.id}: ${error.message}` });
        }
    }

    // Actualiza una noticia
    async updateNews(req, res) {
        try {
            const { id } = req.params;
            const newsData = req.body;
            const updatedNews = await NewsDAO.updateNews(id, newsData);
            if (!updatedNews) {
                return res.status(404).json({ error: 'Noticia no encontrada' });
            }
            return res.status(200).json(NewsFactory.createNewsDTO(updatedNews));
        } catch (error) {
            return res.status(500).json({ error: `Error al actualizar la noticia con id ${req.params.id}: ${error.message}` });
        }
    }

    // Elimina una noticia
    async deleteNews(req, res) {
        try {
            const { id } = req.params;
            const deletedNews = await NewsDAO.deleteNews(id);
            if (!deletedNews) {
                return res.status(404).json({ error: 'Noticia no encontrada' });
            }
            return res.status(200).json({ message: 'Noticia eliminada correctamente' });
        } catch (error) {
            return res.status(500).json({ error: `Error al eliminar la noticia con id ${req.params.id}: ${error.message}` });
        }
    }
}

module.exports = new NewsController();