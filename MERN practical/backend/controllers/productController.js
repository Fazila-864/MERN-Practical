const Product = require('../models/productModel');
const { deleteFile } = require('../utils/fileHelper');

const parseIsActive = (value) => (value === false || value === 'false' ? false : true);

const getFilename = (imagePath) => {
  if (!imagePath || imagePath === 'null') return null;
  return imagePath.replace(/^uploads\//, '');
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    let image = 'null';
    if (req.file) {
      image = 'uploads/' + req.file.filename;
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      isActive: parseIsActive(req.body.isActive),
      image
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {

    const existing = await Product.findById(req.params.id);
    if (!existing) {
      if (req.file) deleteFile(req.file.filename);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.stock !== undefined) updateData.stock = req.body.stock;
    if (req.body.isActive !== undefined) updateData.isActive = parseIsActive(req.body.isActive);
    if (req.file) updateData.image = 'uploads/' + req.file.filename;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (req.file) {
      const oldFilename = getFilename(existing.image);
      if (oldFilename) deleteFile(oldFilename);
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const filename = getFilename(product.image);
    if (filename) deleteFile(filename);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
