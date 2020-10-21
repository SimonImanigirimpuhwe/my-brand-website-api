import googleOauth from 'passport-google-oauth';
import passport from 'passport';
import User from '../models/user';
import config from '../../config/config';
import generateToken from '../helpers/jwToken';

const GoodleStrategy = googleOauth.OAuth2Strategy;

const { 
    app: { clientID, clientSecret, callbackURL }
} = config;

passport.use(new GoodleStrategy({
    clientID,
    clientSecret,
    callbackURL
},
async (accessToken, refreshToken, profile, done) => {
    const newUser = {
        platform: 'google',
        profileId: profile.id ,
        name: profile.displayName,
        email: profile.emails[0].value,
        profileImag: profile.photos[0].value
    };
    // eslint-disable-next-line
    console.log(newUser)
    
    try {
        let user = await User.findOne({ googleId: profile.id});

        if (user) {
            done(null, user)
        } else {
            user = await User.create(newUser);
            const token = await generateToken(user)
            done(null, user)
            return token
        }
    } catch (err) {
        // eslint-disable-next-line
        console.log(err)
    }
}))

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
});

export default passport;