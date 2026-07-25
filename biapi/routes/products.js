import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// CRUD Routes
router.get('/', getProducts);              // Read all
router.get('/:id', getProduct);           // Read one
router.post('/', createProduct);           // Create
router.put('/:id', updateProduct);       // Update
router.delete('/:id', deleteProduct);    // Delete

export default router;

