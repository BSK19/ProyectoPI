const Account = require('../models/Account');

class AccountDao {
  async create(accountData) {
    const account = new Account(accountData);
    return await account.save();
  }
  async findByEmail(email) {
    return await Account.findOne({ email });
  }
  async findById(id) {
    return await Account.findById(id);
  }
  async update(id, updateData) {
    updateData.updatedAt = new Date();
    return await Account.findByIdAndUpdate(id, updateData, { new: true });
  }
  async delete(id) {
    return await Account.findByIdAndDelete(id);
  }
}

module.exports = new AccountDao();