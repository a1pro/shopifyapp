const { errors } = require("../handlers/errors");
const VideoData = require("../models/VideoData");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
//set Data link, ID, key in DB
const postVideoData = async (ctx, next) => {
  try {
    const { productId, url, key } = ctx.request.body;

    const { shop } = ctx.state;

    //check all Condition for mandatory field

    if (!(url && key)) return (ctx.body = errors.MANDATORY_FIELDS);

    if (key === "product") {
      console.log("productId", productId);

      for (const product of productId) {
        console.log("product", product);

        await VideoData.findOneAndUpdate(
          {
            shop,
            "productId.id": product.id,
            url: { $elemMatch: { url: url } },
          },
          {
            $push: { url: { id: uuidv4(), url: url } },
            $set: {
              key: "product",
              "productId.id": product.id,
              "productId.title": product.title,
              "productId.image": product.image,
            },
          },
          { upsert: true }
        );
      }
    } else {
      console.log("#########Home");

      await VideoData.findOneAndUpdate(
        { shop, key, url: { $elemMatch: { url: url } } },
        {
          $push: { url: { id: uuidv4(), url: url } },
          $set: { key: "home", productId: {} },
        },
        { upsert: true }
      );
    }

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in Post Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

//get Data from Db to send Front end
const getVideoData = async (ctx, next) => {
  try {
    const { shop } = ctx.state;
    // const shop = "youtubevideo20.myshopify.com"

    let { page, search, searchProduct } = ctx.request.body;
    console.log("page, search, searchProduct", page, search, searchProduct);
    //filter
    let query = { shop: shop };

    if (search) {
      if (search === "home") {
        var s = ".*" + search + "*.";
        query.key = search;
      } else {
        var s = ".*" + search + "*.";
        query["productId.title"] = { $regex: new RegExp(s), $options: "i" };
      }
    }
    if (searchProduct) {
      if (searchProduct === "home") {
        var s = ".*" + searchProduct + "*.";
        query.key = searchProduct;
      } else {
        var s = ".*" + searchProduct + "*.";
        query["productId.title"] = { $regex: new RegExp(s), $options: "i" };
      }
    }
    console.log("query", query);

    //pagination
    if (page) page = Number(page);
    else page = 1;
    let limit = 10;
    let skip = parseInt(page * limit) - limit;

    //count total number of artist
    var total_records = await VideoData.find(query).countDocuments();

    //gt video data from DB
    var video = await VideoData.find(query).limit(limit).skip(skip);

    var temp_video_home = {};
    var temp_products = [];

    console.log("video", video);
    //merge Data
    // for (const vd of video) {
    //   if (vd.key === "home") {
    //     if (temp_video_home && Object.keys(temp_video_home).length === 0)
    //       temp_video_home = {
    //         id: Math.floor(1000000000 + Math.random() * 9000000000),
    //         title: "home",
    //         image: "",
    //         urlData: [{ _id: vd._id, url: vd.url }],
    //       };
    //     else temp_video_home.urlData.push({ _id: vd._id, url: vd.url });
    //   }
    //   if (vd.key === "product") {
    //     if (temp_products.length === 0)
    //       temp_products.push({
    //         id: Math.floor(1000000000 + Math.random() * 9000000000),
    //         title: vd.productId.title,
    //         image: vd.productId.image,
    //         urlData: [{ _id: vd._id, url: vd.url }],
    //       });
    //     else {
    //       var titles = _.map(temp_products, "title");

    //       if (titles.includes(vd.productId.title)) {
    //         for (const [index, temp_product] of temp_products.entries()) {
    //           if (vd.productId.title === temp_product.title) {
    //             temp_products[index].urlData.push({ _id: vd._id, url: vd.url });
    //           }
    //         }
    //       } else {
    //         temp_products.push({
    //           id: Math.floor(1000000000 + Math.random() * 9000000000),
    //           title: vd.productId.title,
    //           image: vd.productId.image,
    //           urlData: [{ _id: vd._id, url: vd.url }],
    //         });
    //       }
    //     }
    //   }
    // }

    // if (temp_video_home && Object.keys(temp_video_home).length !== 0)
    //   temp_products.splice(0, 0, temp_video_home);
    // // temp_products.push(temp_video_home);

    // console.log("temp_products", temp_products);

    // console.log("video-----------", video, total_records);

    return (ctx.body = { video, total_records });
  } catch (error) {
    console.log("error in get Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const removeVideoData = async (ctx, next) => {
  try {
    let { _id, id } = ctx.request.body;
    const { shop } = ctx.state;

    //delete Data from query
    // await VideoData.findByIdAndRemove({ _id });
    if (id === "home") {
      await VideoData.findOneAndUpdate(
        { shop, key: id },
        { $pull: { url: { id: _id } } }
      );
    } else {
      await VideoData.findOneAndUpdate(
        { shop, "productId.id": id },
        { $pull: { url: { id: _id } } }
      );
    }

    if (id === "home") {
      var url = await VideoData.findOne({ shop, key: id }).select(["url"]);
    } else {
      var url = await VideoData.findOne({ shop, "productId.id": id }).select([
        "url",
      ]);
    }

    console.log("url", url, id);
    if (url && url.url && url.url.length === 0) {
      if (id === "home") await VideoData.findOneAndRemove({ shop, key: id });
      else await VideoData.findOneAndRemove({ shop, "productId.id": id });
    }

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in Remove Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

//get video Product
const getVideoProduct = async (ctx) => {
  try {
    const { shop } = ctx.state;
    // const shop = "youtubevideo20.myshopify.com"

    const products = await VideoData.find({ shop }).select(["productId.title"]);

    if (!(products && Array.isArray(products) && products.length > 0))
      return (ctx.body = errors.DATA_NOT_FOUND);

    const final_product = [];

    for (const product of products) {
      const title = _.map(product.productId, "title");

      if (title.length > 0) {
        for (const item of title) {
          if (!final_product.includes(item && item.toString())) {
            final_product.push(title && title.toString());
          }
        }
      }
    }

    console.log("product", final_product);

    return (ctx.body = final_product);
  } catch (error) {
    console.log("error in Remove Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

module.exports = {
  postVideoData,
  getVideoData,
  removeVideoData,
  getVideoProduct,
};
