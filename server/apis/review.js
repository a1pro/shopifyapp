const { errors } = require("../handlers/errors");
const Review = require("../models/Review");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

const importReviews = async (ctx, next) => {
  try {
    const { reviews, source, productId } = ctx.request.body;

    const { shop } = ctx.state;

    //check all conditions for mandatory field

    if (!reviews) return (ctx.body = errors.MANDATORY_FIELDS);

    reviews.map(async (review) => {
      var reviewObj = null;

      if (source === "Loox") {
        // ✅
        const date = new Date(review.data[5]);
        reviewObj = {
          shopId: shop,
          productId: review.data[0],
          rating: review.data[1],
          submitter: { name: review.data[2], email: review.data[3] },
          text: review.data[4],
          media: review.data[6] ? { type: "photo", url: review.data[6] } : null,
          isVerified: review.data[7],
          source: source,
          createdAt: date.getTime(),
        };
      } else if (source === "AliExpress") {
        reviewObj = {
          shopId: shop,
          productId: review.data[0],
          rating: review.data[1],
          submitter: { name: review.data[2], email: review.data[3] },
          text: review.data[4],
          media: { type: "photo", url: review.data[6] },
          isVerified: review.data[7],
          source: source,
          createdAt: review.data[5],
        };
      } else if (source === "Testimonial.to") {
        // ✅
        const date = new Date(review.data[1]);
        reviewObj = {
          shopId: shop,
          productId: productId,
          rating: 5,
          submitter: {
            name: review.data[2],
            email: review.data[3],
            avatar: review.data[4],
          },
          text: review.data[5] || "",
          media: review.data[6]
            ? {
                type: "video",
                url: review.data[6],
                thumbnail: review.data[7],
                gif: review.data[8],
              }
            : null,
          isVerified: true,
          source: source,
          createdAt: date.getTime(),
        };
      } else if (source === "Yotpo") {
        reviewObj = {
          shopId: shop,
          productId: review.data[0],
          rating: review.data[1],
          submitter: { name: review.data[2], email: review.data[3] },
          text: review.data[4],
          media: { type: "photo", url: review.data[6] },
          isVerified: review.data[7],
          source: source,
          createdAt: review.data[5],
        };
      } else if (source === "Stamped.io") {
        reviewObj = {
          shopId: shop,
          productId: review.data[0],
          rating: review.data[1],
          submitter: { name: review.data[2], email: review.data[3] },
          text: review.data[4],
          media: { type: "photo", url: review.data[6] },
          isVerified: review.data[7] || false,
          source: source,
          createdAt: review.data[5],
        };
      } else if (source === "Judge.Me") {
        // ✅
        const date = new Date(review.data[7]);
        reviewObj = {
          shopId: shop,
          productId: review.data[9],
          rating: review.data[2],
          submitter: { name: review.data[5], email: review.data[3] },
          text: review.data[6],
          media: review.data[4] ? { type: "photo", url: review.data[4] } : null,
          isVerified: review.data[11] || false,
          source: source,
          createdAt: date.getTime(),
        };
      } else {
        // ✅
        // general CSV file
        reviewObj = {
          shopId: shop,
          productId: review.data[0],
          rating: review.data[1],
          submitter: { name: review.data[2], email: review.data[3] },
          text: review.data[4],
          media: review.data[6] ? { type: "photo", url: review.data[6] } : null,
          isVerified: review.data[7],
          source: source,
          createdAt: review.data[5],
        };
      }

      const newReview = new Review(reviewObj);
      await newReview.save();

      // TODO: update Product
    });

    // TODO: send email notification to admin

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in Post Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const addReview = async (ctx, next) => {
  try {
    const { productId, reviews } = ctx.request.body;

    const { shop } = ctx.state;

    //check all conditions for mandatory field

    if (!review) return (ctx.body = errors.MANDATORY_FIELDS);

    await Review.findOneAndUpdate(
      {
        shopId: shop,
        productId: productId,
      },
      {
        shopId: shop,
        productId: productId,
        ...review,
        createdAt: Date.now(),
      },
      { upsert: true }
    );

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in Post Video Data", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const approveReview = async (ctx, next) => {
  try {
    const { productId, review } = ctx.request.body;

    const { shop } = ctx.state;

    //check all Condition for mandatory field

    if (!review) return (ctx.body = errors.MANDATORY_FIELDS);

    await Review.findOneAndUpdate(
      {
        shopId: shop,
        productId: productId,
        _id: review._id,
      },
      {
        isApproved: true,
      },
      { upsert: true }
    );

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in approving the review", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const hideReview = async (ctx, next) => {
  try {
    const { productId, review } = ctx.request.body;

    const { shop } = ctx.state;

    //check all Condition for mandatory field

    if (!review) return (ctx.body = errors.MANDATORY_FIELDS);

    await Review.findOneAndUpdate(
      {
        shopId: shop,
        productId: productId,
        _id: review._id,
      },
      {
        isApproved: false,
      },
      { upsert: true }
    );

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in hiding the review", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const featureReview = async (ctx, next) => {
  try {
    const { productId, review } = ctx.request.body;

    const { shop } = ctx.state;

    console.log("feature review", productId, review);

    //check all Condition for mandatory field

    if (!review) return (ctx.body = errors.MANDATORY_FIELDS);

    await Review.findOneAndUpdate(
      {
        shopId: shop,
        productId: productId,
        _id: review._id,
      },
      {
        isFeatured: true,
      },
      { upsert: true }
    );

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in hiding the review", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const unfeatureReview = async (ctx, next) => {
  try {
    const { productId, review } = ctx.request.body;

    const { shop } = ctx.state;

    console.log("unfeature review", productId, review);

    //check all Condition for mandatory field

    if (!review) return (ctx.body = errors.MANDATORY_FIELDS);

    await Review.findOneAndUpdate(
      {
        shopId: shop,
        productId: productId,
        _id: review._id,
      },
      {
        isFeatured: false,
      },
      { upsert: true }
    );

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in hiding the review", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

const deleteReview = async (ctx, next) => {
  try {
    let { review } = ctx.request.body;
    const { shop } = ctx.state;

    await Review.findOneAndRemove({
      shopId: shop,
      productId: review.productId,
      _id: review._id,
    });

    return (ctx.body = errors.OK);
  } catch (error) {
    console.log("error in deleting review", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

//get reviews from DB to send to front-end TODO
const getReviews = async (ctx, next) => {
  try {
    const { shop } = ctx.state;

    let {
      page,
      search,
      reviewStatus,
      reviewType,
      starRange,
    } = ctx.request.body;
    console.log(
      "page, search, status, range",
      page,
      search,
      reviewStatus,
      reviewType,
      starRange
    );

    //filter
    let query = { shopId: shop };

    if (search) {
      var s = ".*" + search + "*.";
      query["$or"] = [
        {
          productId: { $regex: new RegExp(s), $options: "i" },
        },
        {
          "submitter.name": { $regex: new RegExp(s), $options: "i" },
        },
        {
          "submitter.email": { $regex: new RegExp(s), $options: "i" },
        },
        { text: { $regex: new RegExp(s), $options: "i" } },
      ];
    }

    if (reviewStatus) {
      if (reviewStatus === "Featured") {
        query["isFeatured"] = { $eq: true };
      } else if (reviewStatus === "Published") {
        query["isApproved"] = { $eq: true };
      } else if (reviewStatus === "Hidden") {
        query["isApproved"] = { $eq: false };
      } else if (reviewStatus === "Pending") {
        query["isApproved"] = { $eq: null };
      }
    }

    if (reviewType) {
      if (reviewType === "Video & photo reviews") {
        query["media"] = { $ne: null }; // media not equal to null
      } else if (reviewType === "Text reviews") {
        query["media"] = { $eq: null };
      }
    }

    if (starRange) {
      query["rating"] = { $gte: starRange[0], $lte: starRange[1] };
    }

    //pagination
    if (page) page = Number(page);
    else page = 1;
    let limit = 10;
    let skip = parseInt(page * limit) - limit;

    //count total number of artist
    var total_reviews = await Review.find(query).countDocuments();

    //gt video data from DB
    var reviews = await Review.find(query).limit(limit).skip(skip);

    console.log("reviews", reviews);

    return (ctx.body = { reviews, total_reviews });
  } catch (error) {
    console.log("error in get all reviews", error);
    ctx.status = 500;
    return (ctx.body = errors.SERVER_ERROR);
  }
};

module.exports = {
  importReviews,
  addReview,
  approveReview,
  hideReview,
  featureReview,
  unfeatureReview,
  getReviews,
  deleteReview,
};
