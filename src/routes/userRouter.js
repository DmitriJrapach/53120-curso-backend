import {Router} from 'express';
import passport from 'passport';
import UserManager from "../dao/userManagerDB.js";
import {authorization} from "../middleware/auth.js"

const router = Router();
const UserService =  new UserManager();



router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const result = await UserService.addUser({ first_name, last_name, email, age, password });
        res.send({
            status: 'success',
            message: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.loginUser(email, password);

        res.cookie('auth', user.token, { maxAge: 60*60*1000 }).send({
            status: 'success',
            token: user.token,
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/current', (req, res, next) => {
    console.log("Middleware de Passport JWT");
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        console.log("Después de passport.authenticate");
        if (err) { return next(err); }
        if (!user) { 
            console.log("Usuario no autenticado");
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) { return next(err); }
            console.log("Usuario autenticado");
            next();
        });
    })(req, res, next);
}, async (req, res) => {
    console.log("Después del Middleware");
    res.send({
        user: req.user
    });
});

// router.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
//     res.send({
//         user: req.user
//     })
// });

router.get('/:uid', passport.authenticate('jwt', { session: false }), authorization, async (req, res) => {
    try {
        const result = await UserService.getUser(req.params.uid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


router.post("/logout", (req, res) => {
    console.log("Se está ejecutando la función de logout");
    req.session.destroy(error => {
        res.redirect("http://localhost:8080/login");
        console.log("Usuario desconectado")
    })
    
});
export default router;