class AccountDTO {
    constructor(account) {
      this.id = account._id;
      this.username = account.username;
      this.email = account.email;
      this.role = account.role;
      this.profileImage = account.profileImage;
      this.bio = account.bio;
      if (account.role === 'band') {
        this.bandName = account.bandName;
        this.genre = account.genre;
      }
      if (account.role === 'label') {
        this.labelName = account.labelName;
        this.website = account.website;
      }
    }
  }
  
  module.exports = AccountDTO;