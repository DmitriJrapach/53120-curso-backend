import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../dao/models/userModel.js';

const initializePassport = () => {
    // Estrategia JWT
    passport.use(
        new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: "secretKey"
        }, async (jwt_payload, done) => {
            try {
                console.log("JWT Payload:", jwt_payload);
                const user = await userModel.findById(jwt_payload._id);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    );

    // Estrategia de GitHub
    passport.use(new GitHubStrategy({
        clientID: 'Iv1.bf30467e040e4f77',
        clientSecret: '16eff215a1f72eb31659e611a8b264dd2a95a69b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = `github_${profile.id}@example.com`;
            let user = await userModel.findOne({ $or: [{ githubId: profile.id }, { email: email }] });

            if (!user) {
                const newUser = {
                    username: profile.username,
                    first_name: "GitHub",
                    last_name: "Usuario",
                    age: 18,
                    email: email,
                    password: "12345",
                    githubId: profile.id
                };
                let result = await userModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }
    return token;
}

export default initializePassport;
