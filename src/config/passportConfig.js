import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt, { ExtractJwt } from 'passport-jwt';
import userModel from '../dao/models/userModel.js'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
    // Estrategia JWT
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
    );

    // Estrategia de GitHub
    passport.use(new GitHubStrategy({
      clientID: 'Iv1.bf30467e040e4f77',
      clientSecret: '16eff215a1f72eb31659e611a8b264dd2a95a69b',
      callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          console.log(profile); 
          // Generar el email ficticio
          const email = `github_${profile.id}@example.com`;

          // Buscar usuario por ID de GitHub o por email ficticio
          let user = await userModel.findOne({ $or: [{ githubId: profile.id }, { email: email }] });

          if (!user) {
              // Si no existe, crear un nuevo usuario
              let newUser = {
                  username: profile.username,
                  first_name: "GitHub",
                  last_name: "Usuario",
                  age: 18,
                  email: email, // Email ficticio
                  password: "12345",
                  githubId: profile.id  // Guardar el ID de GitHub para futuras búsquedas
              };
              let result = await userModel.create(newUser);
              return done(null, result);
          } else {
              // Si existe, iniciar sesión con el usuario existente
              return done(null, user);
          }
      } catch(error) {
          return done(error);
      }
    }
  ));

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