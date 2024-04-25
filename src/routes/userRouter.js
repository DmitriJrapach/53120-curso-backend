import {Router} from 'express';
import {auth} from '../middleware/auth.js';
import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtils.js';

const router = Router();

router.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;

        if (!req.body.email || !req.body.password) throw new Error("Register error!");

        const newUser = {
            first_name: req.body.first_name ?? "",
            last_name: req.body.last_name ?? "",
            email: req.body.email,
            age: req.body.age ?? "",
            password: createHash(req.body.password)
        }
        await userModel.create(newUser);
        res.redirect("http://localhost:8080/products/login");
    } catch (e) {
        console.log(e.message);
        req.session.failRegister = true;
        res.redirect("http://localhost:8080/products/register");
    }
});

router.post("/login", auth, async (req, res) => {
    try {
        return res.redirect("http://localhost:8080/products");
    } catch (error) {
        console.error('Error during login:', error);
        req.session.failLogin = true;
        return res.redirect("http://localhost:8080/products/login");
    }
});
router.post("/logout", (req, res) => {
    console.log("Se está ejecutando la función de logout");
    req.session.destroy(error => {
        res.redirect("http://localhost:8080/products/login");
        console.log("Usuario desconectado")
    })
    
});
export default router;