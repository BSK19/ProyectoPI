class AccountDTO {
  // Constructor actualizado
  constructor(account) {
    this.id = account._id;
    this.username = account.username;
    this.email = account.email;
    this.role = account.role;
    this.profileImage = account.profileImage;
    this.bannerImage = account.bannerImage;
    this.followers = account.followers;
    this.bio = account.bio;
    this.socialLinks = account.socialLinks;
    
    if (account.role === 'band') {
      this.bandName = account.bandName;
      this.genre = account.genre;      
      if (account.artistId) {
        this.artistId = account.artistId.toString(); // Convertir a string si es un objeto
      }
    }
   
    if (account.role === 'label') {
      this.labelName = account.labelName;
      this.website = account.website;
    }    
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
  }  
  static fromAccountList(accounts) {
    return accounts.map(account => new AccountDTO(account));
  }
}
module.exports = AccountDTO;