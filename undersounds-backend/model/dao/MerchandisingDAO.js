const Merch = require('../models/Merchandising');

class MerchDAO {
  async getByArtistId(artistId) {
    return await Merch.find({ artistId }).exec();
  }

  async createMerch(merchData) {
    const merch = new Merch(merchData);
    return await merch.save();
  }

  async getBasicMerchByType(type) {
    return await Merch.find({ type })
      .select('name image price')
      .exec();
  }

  async getBasicMerchByArtistAndType(artistId, type) {
    return await Merch.find({ artistId, type })
      .select('name image price')
      .exec();
  }

  async getAllMerch() {
    return await Merch.find().exec();
  }

  async getById(id) {
    return await Merch.findById(id).exec();
  }
}

module.exports = new MerchDAO();