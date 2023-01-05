const Router = require("koa-router");
const { verifyUser } = require("../middleware/verifyUser");
const {
  postVideoData,
  getVideoData,
  removeVideoData,
  getVideoProduct,
} = require("../apis/videoData");
const {
  importReviews,
  addReview,
  deleteReview,
  getReviews,
  featureReview,
  approveReview,
  hideReview,
  unfeatureReview,
} = require("../apis/review");
const { changeStatus, getStatus } = require("../apis/changeStatus");
const { scriptTag } = require("../apis/scriptTag");
const { getAllVideo, getAllVideoByProduct } = require("../apis/storeFrontApi");

const router = new Router({
  prefix: "/api",
});

router.post("/import-reviews", verifyUser, importReviews);
router.post("/add-review", verifyUser, addReview);
router.post("/delete-review", verifyUser, deleteReview);
router.post("/get-reviews", verifyUser, getReviews);
router.post("/feature-review", verifyUser, featureReview);
router.post("/unfeature-review", verifyUser, unfeatureReview);
router.post("/approve-review", verifyUser, approveReview);
router.post("/hide-review", verifyUser, hideReview);

//api route for add video data
router.post("/post-video", verifyUser, postVideoData);

//api route for get video data
router.post("/get-video", verifyUser, getVideoData);

//api route for remove video data
router.post("/remove-video", verifyUser, removeVideoData);

//api route for change status
router.post("/change-status", verifyUser, changeStatus);

//api route for get status
router.get("/get-status", verifyUser, getStatus);

//get product located in video
router.get("/get-video-product", verifyUser, getVideoProduct);

//api route for script tag call
router.get("/script", scriptTag);

//api route for get video data for storeFront
router.get("/get-video-store", getAllVideo);

//api route for get video data for product storeFront
router.get("/get-video-product-store", getAllVideoByProduct);

module.exports = router.routes();
