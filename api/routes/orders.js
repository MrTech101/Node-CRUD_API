const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

// Handle incoming GET requests to /orders
router.get("/",checkAuth ,OrdersController.orders_get_all);

// Handle incoming POST requests to /orders
router.post("/",checkAuth ,OrdersController.orders_create_order);

// Handle incoming GET requests to /orderId
router.get("/:orderId",checkAuth ,OrdersController.orders_get_order);

// Handle incoming Delete requests to /orderId
router.delete("/:orderId",checkAuth ,OrdersController.orders_delete_order);

module.exports = router;
