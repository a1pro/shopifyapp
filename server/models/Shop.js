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

const shopSchema = mongoose.Schema({
  shop: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    trim: true,
  },
  access_token: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  country_code: {
    type: String,
    trim: true,
    required: true,
  },
  country_name: {
    type: String,
    trim: true,
    required: true,
  },
  access_scope: {
    type: Array,
    trim: true,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  domain: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  customer_email: {
    type: String,
    trim: true,
    required: true,
  },
  money_format: {
    type: String,
    trim: true,
    required: true,
  },
  currency: {
    type: String,
    trim: true,
    required: true,
  },
  timezone: {
    type: String,
    trim: true,
    required: true,
  },
  app_status: {
    type: String,
    trim: true,
    default: "installed",
    required: true,
    enum: ["installed", "uninstalled"],
  },
  zip: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  shop_owner: {
    type: String,
    trim: true,
  },
  is_app_enable: {
    type: Boolean,
    trim: true,
    default: false,
  },
  scriptTagId: {
    type: String,
    trim: true,
  },
  src: {
    type: String,
    trim: true,
  },
});

// create shop model
const Shop = mongoose.model("shop", shopSchema);

// ---------------------------------------------------------------------------

/**
 * export modules
 */

module.exports = Shop;

// COLLECTION WOULD BE shops IN MONGODB ATLAS
