const router = require('express').Router();
const Product = require('../models/productModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require("multer")
const Notification = require("../models/notificationsModel")

//add a new product
router.post('/add-product', authMiddleware, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        //send notification to admins
        const admins = await User.find({ role: "admin" });
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New product added by ${req.user.name}`,
                title: "New Product",
                onclick: `/admin`,
                read: false,
            });
            await newNotification.save();

        });
        res.send({
            success: true,
            message: "Product added succesfully",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all products
router.post("/get-products", async (req, res) => {
    try {
        const { seller, category = [], yearsused = [], status } = req.body
        let filters = {}
        if (seller) {
            filters.seller = seller;
        }
        if (status) {
            filters.status = status;
        }

        // filter by category
        if (category.length > 0) {
            filters.category = { $in: category }
        };

        //filter by age
        if (yearsused.length > 0) {
            yearsused.forEach((item) => {
                const fromYearsUsed = item.split("-")[0];
                const toYearsUsed = item.split("-")[1];
                filters.yearsused = { $gte: fromYearsUsed, $lte: toYearsUsed };
            })
        };



        const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });
        res.send({
            success: true,
            data: products,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//edit products
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);

        res.send({
            success: true,
            message: "Product updated sucessfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//get a product by id
router.get("/get-product-by-id/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller");

        res.send({
            success: true,
            data: product,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//delete product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.send({
            success: true,
            message: "Product deleted sucessfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//get image from pc
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now + file.originalname)
    },
});

router.post('/upload-image-to-product', authMiddleware, multer({ storage: storage }).single('file'), async (req, res) => {
    try {
        //handle image upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "campusconnect",
        });
        const productId = req.body.productId;
        await Product.findByIdAndUpdate(productId, {
            $push: { Images: result.secure_url },
        });
        res.send({
            success: true,
            message: "Image uploaded sucessfully",
            data: result.secure_url,
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});


//update product status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { status });

        // send notification to seller
        const newNotification = new Notification({
            user: updatedProduct.seller,
            message: `Your product ${updatedProduct.name} has been ${status}`,
            title: "Product Status Updated",
            onClick: `/ profile`,
            read: false,
        });

        await newNotification.save();
        res.send({
            success: true,
            message: "Product status updated successfully",
        });
    }
    catch (error) {
        res.send(
            {
                success: false,
                message: error.message,
            }
        );
    }
})



module.exports = router;