/**
 * This module contains model for product */

// ---------------------------------------------------------------------------

/**
 * import modules
 */

// this is the driver for mongodb
const mongoose = require("mongoose");

// ---------------------------------------------------------------------------

/**
 * Schema
 */

const productSchema = mongoose.Schema({
  shop: {
    type: String,
    trim: true,
    required: true,
  },
  productId: {
    type: Object,
    required: true,
  },
  ratings: {
    type: Array, // [total1star, total2star, total3star, total4star, total5star]
    required: true,
  },
});

// create Product model
const Product = mongoose.model("Review", productSchema);

// ---------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Product;
