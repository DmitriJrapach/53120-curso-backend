import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';

import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/functionsUtils.js";

const localStrategy = local.Strategy;
const initializatePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age, role} = req.body;

            try {
                let user = await userModel.findOne({ email: username});
                if (user) {
                    console.log("User already exist!");
                    return done(null, false);
                }

                const newUser = { first_name, last_name, email, age, role, password: createHash(password)}
                const result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ))

    passport.use('login', new localStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    const errorMessage = "User does not exist";
                    console.log(errorMessage);
                    return done(errorMessage)
                }
                
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch(error) {
                console.log(error.message);
                return done(error.message);
            }
        }
    ));

    // passport.serializeUser((user, done) => done(null, user._id));

    // passport.deserializeUser(async (id, done) => {
    //     const user = await userModel.findById(id);
    //     done(null, user);
    // })

    const CLIENT_ID = "Iv1.bf30467e040e4f77";
    const SECRET_ID = "968df71058136ac7f84188074390cf84af49f2c2";

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile); 
            let user = await userModel.findOne({username: profile._json.login})
            if(!user) {
                let newUser = {
                    username: profile._json.login,
                    name: profile._json.name,
                    password: ''
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializatePassport;