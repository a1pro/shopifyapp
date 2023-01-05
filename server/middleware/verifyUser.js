let error = require("../handlers/errors");
const Shop = require("../models/Shop");
const jwt = require("jsonwebtoken");

const verifyToken = (payload) => {
  const { exp, nbf, iss, dest, aud } = payload;
  const currentTimeStep = Math.floor(Date.now() / 1000);
  if (
    currentTimeStep > exp ||
    currentTimeStep < nbf ||
    !iss.includes(dest) ||
    aud !== process.env.SHOPIFY_API_KEY
  )
    return false;
  return true;
};

const verifyUser = async (ctx, next) => {
  try {
    var authorization = ctx.request.header.authorization;

    if (!authorization) {
      ctx.status = 401;
      return (ctx.body = error.errors.UNAUTHORIZED);
    }

    authorization = authorization.replace("Bearer ", "");

    const payLoad = jwt.verify(authorization, process.env.SHOPIFY_API_SECRET);

    const isVerified = verifyToken(payLoad);

    if (!isVerified) {
      ctx.status = 401;
      return (ctx.body = error.errors.UNAUTHORIZED);
    }

    const shop = payLoad.dest.replace("https://", "");

    const shopData = await Shop.findOne({ shop }).select([
      "shop",
      "app_status",
      "access_token",
    ]);

    if (shopData && shopData.app_status === "installed") {
      ctx.state["shop"] = shop;
      ctx.state["access_token"] = shopData.access_token;
      await next();
    } else {
      ctx.status = 401;
      return (ctx.body = error.errors.UNAUTHORIZED);
    }
  } catch (err) {
    console.log("Error: ", err);
    ctx.status = 500;
    return (ctx.body = { error: err });
  }
};

module.exports = {
  verifyUser,
};
