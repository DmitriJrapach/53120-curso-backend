// import { Router } from 'express';
// import { productManagerDB } from '../dao/productManagerDB.js';

// const router = Router();
// const ProductService = new productManagerDB();

// function isAuthenticated(req, res, next) {
//     if (req.session.user) {
//         return next();
//     }
//     res.redirect('/login');
// }

// router.get("/products", isAuthenticated, async (req, res) => {
//     try {
//         const user = req.session.user;
//         const { limit = 4, page = 1, category, availability, sort = null } = req.query;

//         let query = {};
//         if (category) query.category = category;
//         if (availability !== undefined) query.status = availability === "true";

//         const result = await ProductService.getAllProducts(limit, page, query, sort);
//         const isValid = !(page <= 0 || page > result.totalPages);

//         res.render("products", {
//             style: "index.css",
//             status: "success",
//             products: result.docs,
//             totalPages: result.totalPages,
//             prevPage: result.prevPage,
//             nextPage: result.nextPage,
//             page: result.page,
//             hasPrevPage: result.hasPrevPage,
//             hasNextPage: result.hasNextPage,
//             prevLink: result.prevPage ? `/products?page=${result.prevPage}` : null,
//             nextLink: result.nextPage ? `/products?page=${result.nextPage}` : null,
//             isValid: isValid,
//             user: user
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });

// router.get('/realtimeproducts', isAuthenticated, async (req, res) => {
//     try {
//         const user = req.session.user;
//         const { limit = 10, page = 1, category, availability, sort = null } = req.query;

//         const products = await ProductService.getAllProducts(limit, page, { category, availability }, sort);
        
//         res.render('realTimeProducts', {
//             title: 'Productos',
//             style: 'index.css',
//             products: products.docs,
//             user: user
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });

// router.get("/chat", isAuthenticated, (req, res) => {
//     const user = req.session.user;
//     res.render("chat", {
//         title: "Chat usuarios",
//         style: "index.css",
//         user: user
//     });
// });

// router.get("/login", (req, res) => {
//     res.render("login", {
//         title: "Login",
//         style: "index.css",
//         failLogin: req.session.failLogin ?? false
//     });
// });

// router.get("/logout", (req, res) => {
//     req.session.destroy(error => {
//         if (error) {
//             return res.status(500).send({
//                 status: 'error',
//                 message: 'Error al cerrar la sesión'
//             });
//         }
//         res.redirect("/login");
//     });
// });

// router.get("/register", (req, res) => {
//     res.render("register", {
//         title: "Register",
//         style: "index.css",
//         failRegister: req.session.failRegister ?? false
//     });
// });

// export default router;
// src/routes/viewRouter.js
import { Router } from 'express';
import viewController from '../controllers/viewController.js';

const router = Router();

router.get("/products", viewController.isAuthenticated, viewController.getProducts);

router.get('/realtimeproducts', viewController.isAuthenticated, viewController.getRealTimeProducts);

router.get("/chat", viewController.isAuthenticated, viewController.chat);

router.get("/login", viewController.login);

router.get("/logout", viewController.logout);

router.get("/register", viewController.register);

export default router;
