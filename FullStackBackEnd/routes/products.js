const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/", auth, async (req, res) => {
  const product = new Product({ ...req.body, user: req.user.userId });
  await product.save();
  res.status(201).json(product);
});

router.put("/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.user.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not Authorized" });

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.user.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not Authorized" });

  await product.remove();
  res.json({ message: "Product deleted" });
});

module.exports = router;
