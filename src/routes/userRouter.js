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

router.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/register" }),
    (req, res) => {
        res.redirect('/');
    }
);


// router.post(
//     "/login",
//     passport.authenticate("login", { failureRedirect: "/login" }),
//     (req, res) => {
//         if (!req.user) {
//             return res.send(401).send({
//                 status: "error",
//                 message: "Error Login!"
//             });
//         }

//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             email: req.user.email,
//             age: req.user.age,
//             role: req.user.role
//         }

//         return res.redirect("/");
//     }
// );
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await UserService.loginUser(email, password);

        res.cookie('auth', token, { maxAge: 60*60*1000 }).send({
            status: 'success',
            token
        });
        
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send({
        user: req.user
    })
});

router.get('/:uid', passport.authenticate('jwt', {session: false}), authorization, async (req, res) => {
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