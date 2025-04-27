import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const authConfig = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || ''
    }
};

// Check if any Google OAuth configuration is missing and log a warning
const missingConfigs = [];
if (!authConfig.google.clientId) missingConfigs.push('GOOGLE_CLIENT_ID');
if (!authConfig.google.clientSecret) missingConfigs.push('GOOGLE_CLIENT_SECRET');
if (!authConfig.google.callbackUrl) missingConfigs.push('GOOGLE_CALLBACK_URL');

if (missingConfigs.length > 0) {
    console.warn(`Warning: Google OAuth is not fully configured. Missing: ${missingConfigs.join(', ')}`);
    console.warn('Google OAuth login will not be available.');
} else {
    // Only set up Google Strategy if all required configuration is present
    passport.use(new GoogleStrategy({
        clientID: authConfig.google.clientId,
        clientSecret: authConfig.google.clientSecret,
        callbackURL: authConfig.google.callbackUrl,
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));
}

export default passport;
