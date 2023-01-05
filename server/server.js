import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";

const cors = require("@koa/cors");
const path = require("path");
const DB = require("./db/connect");
const webhookRouter = require("./routers/webhook");
const installRouter = require("./routers/install");
// const extraRouter = require("./routers/extra");
const routers = require("./routers/routers");
const bodyParser = require("koa-bodyparser");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
global.ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(bodyParser({ formLimit: "50mb", jsonLimit: "50mb" }));

  server.use(cors());

  //for script tag

  var fs = require("fs"),
    filePath = path.join(__dirname, "apis/artist_profile.html");

  const proxy_router = new Router();

  proxy_router.get("/proxy", (ctx, next) => {
    console.log("------addScriptTag---sd---");

    try {
      let data = fs.readFileSync(filePath, { encoding: "utf-8" });
      data = data.replace("<%base_url%>", process.env.HOST);
      ctx.set("Content-type", "application/liquid");
      ctx.res.write(data);
      ctx.res.end();

      return;
    } catch (err) {
      ctx.status = 500;
      console.log("ERROR: ", err);
    }
  });

  server.use(proxy_router.routes());

  server.use(webhookRouter);
  server.use(installRouter);
  // server.use(extraRouter);
  server.use(routers);

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(router.allowedMethods());
  server.use(router.routes());
  DB.connectDB().then(() => {
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
});
