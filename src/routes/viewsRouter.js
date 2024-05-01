import { Router } from 'express';
import { productManagerDB } from '../dao/productManagerDB.js';

const router = Router();
const ProductService = new productManagerDB();

router.get("/", async (req, res) => {
  try {
    // Obtener los datos del usuario de la sesión
    const user = req.session.user;

    // Obtener parámetros de búsqueda del query string
    const { limit = 4, page = 1, category, availability, sort = null } = req.query;

    // Construir el objeto de consulta basado en los parámetros de búsqueda
    let query = {};
    if (category) {
      query.category = category;
    }
    if (availability !== undefined) {
      query.status = availability === "true";
    }

    // Obtener los productos que coinciden con la búsqueda
    const result = await ProductService.getAllProducts(limit, page, query, sort);
    const isValid = !(page <= 0 || page > result.totalPages);

    // Renderizar la página de productos y pasar los datos del usuario a la plantilla
    res.render("products", {
      style: "index.css",
      status: "success",
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null,
      nextLink: result.nextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null,
      isValid: isValid,
      user: user // Pasar los datos del usuario a la plantilla
    });
  } catch (error) {
    console.error(error);
  }
})

router.get("/products", (req, res) => {
  const user = req.session.user;
  res.render("products", { user: user });
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtener parámetros de búsqueda del query string
        const { limit = 10, page = 1, category, availability, sort = null } = req.query;

        // Obtener productos con los parámetros de consulta
        const products = await ProductService.getAllProducts(limit, page, { category, availability }, sort);
        
        // Renderizar la vista con los productos
        res.render('realTimeProducts', {
            title: 'Productos',
            style: 'index.css',
            products: products.docs // Aquí se utiliza la propiedad docs del resultado
        });
    } catch (error) {
        console.error(error);
        // Manejar el error aquí
    }
});

router.get("/chat", (req, res) => {
    res.render(
        "chat",
        {
            title: "Chat usuarios",
            style: "index.css"
        }
    )
});

router.get("/login", (req, res) => {
  res.render(
    "login",
    {
      title: "Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false
    }
  )
});

router.get("/logout", (req, res) => {
  res.render(
    "login",
    {
      title: "Logout",
      style: "index.css"
    }
  )
})

router.get("/register", (req, res) => {
  res.render(
    "register",
    {
      title: "Register",
      style: "index.css",
      failRegister: req.session.failRegister ?? false
    }
  )
})





export default router;
