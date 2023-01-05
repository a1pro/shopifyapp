const { registerWebhook } = require("@shopify/koa-shopify-webhooks");
const Shop = require("../models/Shop");
const error = require("../handlers/errors");
const koaAuth = require("@shopify/koa-shopify-auth");
const axios = require("axios");
// const { addScript } = require("../apis/theme");

module.exports = koaAuth.default({
  accessMode: "offline",
  async afterAuth(ctx) {
    const { HOST } = process.env;
    const host = ctx.query.host;
    // Access token and shop available in ctx.state.shopify
    // console.log("ctx.state.shopify", ctx.state.shopify);
    const { shop, accessToken, scope } = ctx.state.shopify;
    global.ACTIVE_SHOPIFY_SHOPS[shop] = scope;

    //register webhooks

    const registration = await registerWebhook({
      address: `${HOST}/webhook/uninstalled`,
      topic: "APP_UNINSTALLED",
      accessToken,
      shop,
      apiVersion: process.env.SHOPIFY_API_VERSION,
    });

    if (registration.success) {
      console.log("Successfully registered webhook!");
    } else {
      console.log("Failed to register webhook", registration.result);
    }

    const shop_update = await registerWebhook({
      address: `${HOST}/webhook/shop-update`,
      topic: "SHOP_UPDATE",
      accessToken,
      shop,
      apiVersion: process.env.SHOPIFY_API_VERSION,
    });

    if (shop_update.success) {
      console.log("Successfully registered webhook : shop_update!");
    } else {
      console.log("Failed to register webhook", shop_update.result);
    }

    if (accessToken != "" && accessToken != undefined) {
      try {
        const accessShopUrl = `https://${shop}/admin/shop.json`;

        // set header
        const request_headers = {
          "X-Shopify-Access-Token": accessToken,
        };

        const resShop = await axios({
          url: accessShopUrl,
          method: "GET",
          responseType: "json",
          headers: request_headers,
        });

        const responseShop = resShop && resShop.data && resShop.data.shop;

        if (!responseShop) {
          ctx.status = 400;
          ctx.body = error.errors.SERVER_ERROR;
          return ctx;
        }

        const shopifyData = {
          shop: shop,
          access_token: accessToken,
          phone: responseShop.phone,
          name: responseShop.name,
          country_code: responseShop.country_code,
          country_name: responseShop.country_name,
          access_scope: process.env.SCOPES.split(","),
          timestamp: new Date().getTime(),
          domain: responseShop.domain,
          primary_locale: responseShop.primary_locale,
          email: responseShop.email,
          customer_email: responseShop.customer_email,
          money_format: responseShop.money_format,
          app_status: "installed",
          currency: responseShop.currency,
          timezone: responseShop.iana_timezone,
          address1: responseShop.address1,
          address2: responseShop.address2,
          zip: responseShop.zip,
          city: responseShop.city,
          shop_owner: responseShop.name,
        };

        const shopData = await Shop.findOne({ shop }).select(["accessToken"]);

        if (shopData) {
          if (shopData.access_token !== accessToken) {
            console.log("AccessToken changed");
            await Shop.updateOne({ shop }, { $set: shopifyData });
          }
        } else {
          console.log("new data is going to add");
          const SHOP = new Shop(shopifyData);
          await SHOP.save();
        }


        ctx.redirect(`/?shop=${shop}&host=${host}`);
      } catch (e) {
        console.log("error---", e);

        let result = error.errors.SERVER_ERROR;
        result.data = e;
        ctx.status = 400;
        ctx.body = result;
        return ctx;
      }
    } else {
      ctx.status = 400;
      ctx.body = { error: "AccessToken not found" };
      return ctx;
    }

    // Redirect to app with shop parameter upon auth
    return ctx.redirect(`/?shop=${shop}&host=${host}`);
  },
});
