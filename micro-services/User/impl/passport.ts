import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { readFileSync } from 'fs'
import path from 'path'

const authConfig = JSON.parse(readFileSync(path.join(__dirname, '../auth.json'), 'utf-8'));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: authConfig.google.clientId,
    clientSecret: authConfig.google.clientSecret,
    callbackURL: authConfig.google.callbackUrl,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

export default passport;
