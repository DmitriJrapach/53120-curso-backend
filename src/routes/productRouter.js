import { Router } from 'express';
import { productManagerDB } from '../dao/productManagerDB.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();    
const ProductService = new productManagerDB();

router.get('/', async (req, res) => {
    try {
      let { limit = 10, page = 1, query = {}, sort = null} = req.query;
      const result = await ProductService.getAllProducts(limit, page, query, sort);
      res.send({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : null,
        nextLink: result.nextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : null
      })
    } catch (error) {
      console.error(error)
    }
  })
// router.get('/', async (req, res) => {
//     const result = await ProductService.getAllProducts();

//     res.send({
//         status: 'success',
//         payload: result
//     });
// });

router.get('/:pid', async (req, res) => {

    try {
        const result = await ProductService.getProductByID(req.params.pid);
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

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await ProductService.createProduct(req.body);
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

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await ProductService.updateProduct(req.params.pid, req.body);
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

router.delete('/:pid', async (req, res) => {

    try {
        const result = await ProductService.deleteProduct(req.params.pid);
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

export default router;