import { Router } from 'express';
// import { productManagerFS } from '../dao/productManagerFS.js';
import { productManagerDB } from '../dao/productManagerDB.js';

const router = Router();
// const ProductService = new productManagerFS('products.json');
const ProductService = new productManagerDB();

router.get('/', async (req, res) => {
    try {
      let { limit = 2, page = 1, query = {}, sort = null} = req.query;
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

// router.get('/', async (req, res) => {
//     res.render(
//         'index',
//         {
//             title: 'Productos',
//             style: 'index.css',
//             products: await ProductService.getAllProducts()
//         }
//     )
// });

router.get('/realtimeproducts', async (req, res) => {
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
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

export default router;