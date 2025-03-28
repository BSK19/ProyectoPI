const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AccountDao = require('../model/dao/AccountDao');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await AccountDao.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Busca el usuario por correo (o crea uno nuevo)
      let account = await AccountDao.findByEmail(profile.emails[0].value);
      if (!account) {
        const newAccountData = {
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          profileImage: profile.photos[0].value,
          bio: '',
          role: 'fan'
        };
        account = await AccountDao.create(newAccountData);
      }
      return done(null, account);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;