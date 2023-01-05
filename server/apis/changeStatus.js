const Shop = require("../models/Shop");
const api = require("../handlers/api");
const { errors } = require("../handlers/errors");

const changeStatus = async (ctx, next) => {
  try {
    const { shop, access_token } = ctx.state;
    // const shop = "youtubevideo20.myshopify.com";
    // const access_token = "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";
    // const status = true;

    const { status } = ctx.request.body;

    const api_version = process.env.SHOPIFY_API_VERSION;

    console.log("status", status);

    // url for graphql
    const url = String(`https://${shop}/admin/api/${api_version}/graphql.json`);

    if (status) {
      //script tag url
      const srcForScriptTag = String(`${process.env.HOST}/api/script`);

      //query
      const query = `mutation MyMutation {
                 scriptTagCreate(input: {displayScope: ONLINE_STORE, src: "${srcForScriptTag}"}) {
                   scriptTag {
                     id
                     src
                   }
                 }
               }`;

      // call an api for script tag
      const scriptTag = await api.POST_API(url, access_token, query);

      console.log("scriptTag", scriptTag);

      //get ID and src from script tag data
      const id = scriptTag.data.scriptTagCreate.scriptTag.id;
      const scriptSrc = scriptTag.data.scriptTagCreate.scriptTag.src;

      console.log("scriptSrc", scriptSrc, "ID", id);

      //data for store in DB
      const shopifyData = {
        shop: shop,
        scriptTagId: id,
        src: scriptSrc,
        is_app_enable: true,
      };

      //store Data in DB
      await Shop.updateOne({ shop }, { $set: shopifyData });

      console.log(
        "data is added in script tag in DB, and script tag generated"
      );
    } else {
      //get script tag data from DB
      const scriptTagData = await Shop.findOne({ shop }).select([
        "scriptTagId",
        "src",
      ]);

      console.log("scriptTag data of shop from db", scriptTagData.scriptTagId);

      //query
      const query = `
                    mutation MyMutation {
                    scriptTagDelete(id: "${scriptTagData.scriptTagId}") {
                        deletedScriptTagId
                        userErrors {
                        message
                        field
                        }
                    } } `;

      // delete script tag
      const scriptTag = await api.POST_API(url, access_token, query);

      console.log("scriptTag of Delete tag", scriptTag.data);

      // data for store in DB
      const shopifyData = {
        scriptTagId: "",
        src: "",
        is_app_enable: false,
      };

      // delete script tag data in DB
      await Shop.updateOne({ shop }, { $set: shopifyData });

      console.log("script tag is deleted");
    }

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("Error in appEnableDisable!", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const getStatus = async (ctx, next) => {
  try {
    const { shop } = ctx.state;
    // const shop = "youtubevideo20.myshopify.com";

    const status = await Shop.findOne({ shop }).select(["is_app_enable"]);

    console.log("status", status);

    return (ctx.body = { status: status.is_app_enable });
  } catch (error) {
    console.log("Error in appEnableDisable!", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

module.exports = { changeStatus, getStatus };
