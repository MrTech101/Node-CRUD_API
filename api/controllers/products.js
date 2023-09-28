const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_allProduct = (req, res, next) => {
    Product.find()
      .select("name price _id productImage")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http:localhost:8080/products/" + doc._id,
              },
            };
          }),
        };
        if (docs.length == 0) {
          res.status(200).json({
            message: "NO Entry Found",
          });
        } else {
          res.status(200).json(response);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Product has been created",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: result.productImage,
            request: {
              type: "POST",
              url: "http://localhost:8080" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }

  exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .select("name price _id productImage")
      .exec()
      .then((doc) => {
        console.log("From Database", doc);
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: "GET",
              description: "Get all the Products",
              url: "http://localhost:8080/products",
            },
          });
        } else {
          res.status(404).json({
            message: "No Valid Entry Found For Provided ID",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }

  exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Product has been Updated",
          request: {
            type: "PATCH",
            url: "http://localhost:8080/products/" + id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.products_delete_product =(req, res, next) => {
    const id = req.params.productId;
    Product.deleteMany({
      _id: id,
    })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Product Deleted",
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }