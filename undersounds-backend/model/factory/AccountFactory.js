class AccountFactory {
  createAccount(data) {
    return {
      username: data.username,
      email: data.email,
      password: data.password, 
      role: data.bandName ? 'band' : data.labelName ? 'label' : 'fan',
      profileImage: data.profileImage || '/assets/images/default-user.jpg',
      bannerImage: data.bannerImage || '/assets/images/default.jpg',
      followers: data.followers || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      bio: data.bio || '',
      socialLinks: data.socialLinks || { facebook: '', instagram: '', twitter: '' },
      bandName: data.bandName,
      genre: data.genre,
      labelName: data.labelName,
      website: data.website,
      purchaseHistory: [],
      // Incluir artistId si está presente en los datos
      ...(data.artistId && { artistId: data.artistId })
    };
  }
}

module.exports = new AccountFactory();