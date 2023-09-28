const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

// Handle incoming GET requests to /products
router.get("/", ProductsController.products_get_allProduct);

// Handle incoming POST requests to /products
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

// Handle incoming GET requests to /productId
router.get("/:productId", ProductsController.products_get_product);

// Handle incoming PATCH requests to /productId
router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

// Handle incoming Delete requests to /productId
router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
