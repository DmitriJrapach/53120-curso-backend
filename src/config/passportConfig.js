import passport from "passport";
import jwt, { ExtractJwt } from 'passport-jwt';

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
    passport.use(
        "jwt",
        new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: "secretKey"
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error)
            }
        })
    )
}

const cookieExtractor = (req) => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }

    return token;
}

export default initializePassport;