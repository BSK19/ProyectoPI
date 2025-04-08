class NewsDTO {
    constructor(news) {
        this.id = news._id;
        this.titulo = news.titulo;
        this.body = news.body;
        this.image = news.image;
        this.fechaPublicacion = news.fechaPublicacion;
        this.autor = news.autor;
        this.createdAt = news.createdAt;
        this.updatedAt = news.updatedAt;
    }
}

module.exports = NewsDTO;