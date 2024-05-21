import { Router } from 'express';
import passport from 'passport';
import UserManager from "../dao/userManagerDB.js";
import { authorization } from "../middleware/auth.js"

const router = Router();
const UserService = new UserManager();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log("Datos recibidos de GitHub:", req.user);
    
    req.session.user = req.user;
    res.redirect('/products');
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

        // Guardar el token en una cookie
        res.cookie('auth', user.token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        
        // Guardar datos del usuario en la sesión
        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        };

        // Redirigir a la página de productos
        res.redirect('/products');
    } catch (error) {
        res.redirect('/login');
    }
});

router.get('/current', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) { return next(err); }
            next();
        });
    })(req, res, next);
}, async (req, res) => {
    res.send({
        user: req.user
    });
});

router.get('/:uid', passport.authenticate('jwt', { session: false }), authorization, async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await UserService.getUser(uid);
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
    req.session.destroy(error => {
        res.redirect("/login");
    });
});

export default router;
