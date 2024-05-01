import {Router} from 'express';
import passport from 'passport';

const router = Router();

// router.post("/register", async (req, res) => {
//     try {
//         req.session.failRegister = false;

//         if (!req.body.email || !req.body.password) throw new Error("Register error!");

//         const newUser = {
//             first_name: req.body.first_name ?? "",
//             last_name: req.body.last_name ?? "",
//             email: req.body.email,
//             age: req.body.age ?? "",
//             password: createHash(req.body.password)
//         }
//         await userModel.create(newUser);
//         res.redirect("http://localhost:8080/products/login");
//     } catch (e) {
//         console.log(e.message);
//         req.session.failRegister = true;
//         res.redirect("http://localhost:8080/products/register");
//     }
// });

// router.post("/login", auth, checkUserRole, async (req, res) => {
//     try {
//         return res.redirect("http://localhost:8080/products");
//     } catch (error) {
//         console.error('Error during login:', error);
//         req.session.failLogin = true;
//         return res.redirect("http://localhost:8080/products/login");
//     }
// });

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/products/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/products/register" }),
    (req, res) => {
        res.send({
            status: 'success',
            message: 'User registered'
        });
    }
);


router.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/products/login" }),
    (req, res) => {
        if (!req.user) {
            return res.send(401).send({
                status: "error",
                message: "Error Login!"
            });
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }

        return res.redirect("/products");
    }
);


router.post("/logout", (req, res) => {
    console.log("Se está ejecutando la función de logout");
    req.session.destroy(error => {
        res.redirect("http://localhost:8080/products/login");
        console.log("Usuario desconectado")
    })
    
});
export default router;