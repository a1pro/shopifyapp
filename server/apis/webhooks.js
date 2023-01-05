const Shop = require("../models/Shop");

const handleUninstall = async (ctx, next) => {
  try {
    console.log("uninstall webhook");
    var { request } = ctx;
    var shop = request.header["x-shopify-shop-domain"];

    delete global.ACTIVE_SHOPIFY_SHOPS[shop];

    await Shop.findOneAndUpdate(
      { shop },
      {
        app_status: "uninstalled",
        is_app_enable: false,
      },
      { new: true }
    );

    return (ctx.status = 200);
  } catch (error) {
    console.log("Error: ", error);
    return (ctx.status = 200);
  }
};

const handleShopUpdate = async (ctx, next) => {
  let {
    phone,
    country_code,
    country_name,
    email,
    customer_email,
    money_format,
    currency,
    timezone,
    domain,
    zip,
    city,
    shop_owner,

  } = ctx.request.body;

  try {

    console.log("Shop update webhook");

    const shopifyData = {
      phone,
      country_code,
      country_name,
      email,
      customer_email,
      money_format,
      currency,
      domain,
      timezone,
      zip,
      city,
      shop_owner,
    };

    await Shop.findOneAndUpdate({ shop: domain }, shopifyData, {
      new: true,
    });

    return (ctx.status = 200);
  } catch (error) {
    console.log("Error: ", error);
    return (ctx.status = 200);
  }
};
module.exports = {
  handleShopUpdate,
  handleUninstall,
};
