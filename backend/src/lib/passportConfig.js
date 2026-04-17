import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://api.hwagfu.dev/api/auth/login/google/callback`
},
(_, __, profile, done) => done(null, profile)
));

export default passport;