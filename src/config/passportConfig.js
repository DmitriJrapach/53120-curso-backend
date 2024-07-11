import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../dao/models/userModel.js';
import cartModel from '../dao/models/cartModel.js'; // Importar el modelo de carrito
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import UserManager from '../dao/userDao.js';

const initializePassport = () => {
    // Estrategia JWT
    passport.use(
        new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: "secretKey"
        }, async (jwt_payload, done) => {
            try {
                // console.log("JWT Payload:", jwt_payload);
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
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = `github_${profile.id}@example.com`;
            let user = await userModel.findOne({ $or: [{ githubId: profile.id }, { email: email }] });
    
            if (!user) {
                const newUser = {
                    first_name: "GitHub",
                    last_name: "Usuario",
                    age: 18,
                    email: email,
                    password: ("12345")
                };
    
                // Aquí utilizamos addUser en lugar de crear directamente el usuario
                const userManager = new UserManager();
                let result = await userManager.addUser(newUser);
                console.log ("add user", result)
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
        console.log('Serializing user:', user);
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let myUser = await userModel.findById(id);
        done(null, myUser);
    })
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }
    return token;
}

export default initializePassport;
