
const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  upload.single('image'),
  createProduct
);

router.put(
  '/:id',
  upload.single('image'),
  updateProduct
);

router.delete(
  '/:id',
  deleteProduct
);

module.exports = router;
