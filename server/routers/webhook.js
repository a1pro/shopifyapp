const Router = require("koa-router");
const Shop = require("../models/Shop");
const { handleUninstall, handleShopUpdate } = require("../apis/webhooks");
const router = new Router({ prefix: "/webhook" });

router.post("/uninstalled", handleUninstall);

router.post("/shop-update", handleShopUpdate);

//GDPR API

router.post("/customers-data-request", (ctx) => {
  return (ctx.status = 200);
});

router.post("/customer-redact", (ctx) => {
  return (ctx.status = 200);
});

router.post("/shop-redact", async (ctx) => {
  try {
    console.log("Shop redact - ctx", ctx.request.body);

    let { shop_domain, shop_id } = ctx.request.body;

    await Shop.findOneAndRemove({ shop: shop_domain });

    return (ctx.status = 200);
  } catch (error) {
    return (ctx.status = 200);
  }
});

module.exports = router.routes();
