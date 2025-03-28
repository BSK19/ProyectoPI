class AccountFactory {
    createAccount(data) {
      return {
        username: data.username,
        email: data.email,
        password: data.password, 
        role: data.bandName ? 'band' : data.labelName ? 'label' : 'fan',
        profileImage: data.profileImage || '/assets/images/default-user.jpg',
        bio: data.bio || '',
        socialLinks: data.socialLinks || { facebook: '', instagram: '', twitter: '' },
        bandName: data.bandName,
        genre: data.genre,
        labelName: data.labelName,
        website: data.website,
        purchaseHistory: []
      };
    }
  }
  
  module.exports = new AccountFactory();