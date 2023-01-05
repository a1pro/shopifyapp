/**
 * This module contains model for shop */

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

const videoDataSchema = mongoose.Schema({
  shop: {
    type: String,
    trim: true,
    required: true,
  },
  url: {
    type: Array,
    trim: true,
    required: true,
  },
  productId: {
    type: Object,
  },
  key: {
    type: String,
    trim: true,
  },
});

// create video model
const VideoData = mongoose.model("videoData", videoDataSchema);

// ---------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = VideoData;

// COLLECTION WOULD BE videoData IN MONGODB ATLAS
