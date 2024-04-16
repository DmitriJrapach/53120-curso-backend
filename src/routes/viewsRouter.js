import { Router } from 'express';
import { productManagerDB } from '../dao/productManagerDB.js';

const router = Router();
const ProductService = new productManagerDB();

router.get('/', async (req, res) => {
  try {
      // Obtener parámetros de búsqueda del query string
      const { limit = 4, page = 1, category, availability, sort = null } = req.query;

      // Construir el objeto de consulta basado en los parámetros de búsqueda
      let query = {};
      if (category) {
          query.category = category;
      }
      if (availability !== undefined) {
          query.status = (availability === 'true');
      }
      
      // Obtener los productos que coinciden con la búsqueda
      const result = await ProductService.getAllProducts(limit, page, query, sort);
      const isValid = !(page <= 0 || page > result.totalPages);
      res.render(
        "index",
        {
        style: "index.css",
        status: 'success',
        products: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null,
        nextLink: result.nextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null,
        isValid: isValid 
      })
    } catch (error) {
      console.error(error)
    }
})

// router.get('/realtimeproducts', async (req, res) => {
//     try {
//         // Obtener parámetros de búsqueda del query string
//         const { limit = 10, page = 1, category, availability, sort = null } = req.query;

//         // Obtener productos con los parámetros de consulta
//         const products = await ProductService.getAllProducts(limit, page, { category, availability }, sort);
        
//         // Renderizar la vista con los productos
//         res.render('realTimeProducts', {
//             title: 'Productos',
//             style: 'index.css',
//             products: products.docs // Aquí se utiliza la propiedad docs del resultado
//         });
//     } catch (error) {
//         console.error(error);
//         // Manejar el error aquí
//     }
// });

router.get("/chat", (req, res) => {
    res.render(
        "chat",
        {
            title: "Chat usuarios",
            style: "index.css"
        }
    )
});

export default router;