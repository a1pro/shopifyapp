/**
 * This module contains model for review */

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

const reviewSchema = mongoose.Schema({
  shopId: {
    type: String,
    trim: true,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  submitter: {
    type: Object, // name, email, id
  },
  text: {
    type: String,
  },
  media: {
    type: Object, // type, source
  },
  isVerified: {
    type: Boolean,
  },
  isFeatured: {
    type: Boolean,
  },
  isApproved: {
    type: Boolean,
  },
  source: {
    type: String,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

// create review model
const Review = mongoose.model("Review", reviewSchema);

// ---------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Review;
