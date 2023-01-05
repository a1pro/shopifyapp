//get all video for home page

const VideoData = require("../models/VideoData");
const { errors } = require("../handlers/errors");

//get all video for store front
const getAllVideo = async (ctx) => {
  try {
    console.log("--------------");

    const { shop, key, id } = ctx.request.query;

    console.log("key", key);

    if (key === "home") {
      var video = await VideoData.findOne({ shop, key: key });
    } else {
      console.log("ddd");
      var video = await VideoData.findOne({
        $and: [{ shop }, { "productId.id": id }],
      });
    }

    console.log("videoData", video);

    return (ctx.body = { video });
  } catch (error) {
    console.log("error in store front to get data", error);

    ctx.status = 500;
    return (ctx.body = errors.OK);
  }
};

const getAllVideoByProduct = async (ctx) => {
  try {
    const { shop, id } = ctx.request.query;

    console.log("-------ddddddd-------", shop, id);

    const video = await VideoData.find({
      $and: [{ shop }, { "productId.id": id }],
    });

    console.log(" -----", video);

    return (ctx.body = { video });
  } catch (error) {
    console.log("error in store front to get data", error);

    ctx.status = 500;
    return (ctx.body = errors.OK);
  }
};

module.exports = { getAllVideo, getAllVideoByProduct };
