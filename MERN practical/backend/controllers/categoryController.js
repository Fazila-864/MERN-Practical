const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { deleteFile } = require("../utils/fileHelper");

const parseIsActive = (value) => value === false || value === 'false' ? false : true;

const getFilename = (imagePath) => {
    if (!imagePath || imagePath === 'null') return null;
    return imagePath.replace(/^uploads\//, '');
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE CATEGORY
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        let image = null;
        if (req.file) {
            image = 'uploads/' + req.file.filename;
        }

        const category = await Category.create({
            name,
            description,
            image,
            isActive: parseIsActive(isActive)
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const message = error.code === 11000
            ? "Category already exists"
            : (error.message || "Category creation failed");
        res.status(400).json({
            success: false,
            message
        });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        const existing = await Category.findById(req.params.id);
        if (!existing) {
            if (req.file) deleteFile(req.file.filename);
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = parseIsActive(isActive);
        if (req.file) updateData.image = 'uploads/' + req.file.filename;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            if (req.file) deleteFile(req.file.filename);
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (req.file) {
            const oldFilename = getFilename(existing.image);
            if (oldFilename) deleteFile(oldFilename);
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const message = error.code === 11000
            ? "Category already exists"
            : (error.message || "Category update failed");
        res.status(400).json({
            success: false,
            message
        });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Category delete nahi ho sakti: is me ${productCount} product hain. Pehle unhe delete ya kisi doosri category me move karein.`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const filename = getFilename(category.image);
        if (filename) deleteFile(filename);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
