import React, { useCallback, useState, useEffect } from "react";
import {
  Page,
  Badge,
  Modal,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  TextField,
  RangeSlider,
  Avatar,
  Filters,
  ChoiceList,
  Link,
  Stack,
  Icon,
  Heading,
  Pagination,
  Button,
  Popover,
  ActionList,
} from "@shopify/polaris";
import { StarFilledMinor, CircleTickMinor } from "@shopify/polaris-icons";
import StarRatings from "react-star-ratings";
import { formatDistance } from "date-fns";
import parse from "html-react-parser";
import { useDebounce } from "use-debounce";
import * as updateReview from "../services/updateReview";

function disambiguateLabel(key, value) {
  switch (key) {
    case "minStar":
      return `Reviews between ${value[0]} and ${value[1]} stars`;
    case "reviewType":
      return `${value}`;
    case "reviewStatus":
      console.log(value);
      return value.map((val) => `${val}`).join(", ");
    default:
      return value;
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}

function Reviews() {
  const [reviewStatus, setReviewStatus] = useState(null);
  const [reviewType, setReviewType] = useState(null);
  const [minStar, setMinStar] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [queryDebounce] = useDebounce(queryValue, 500);
  const [allReviews, setAllReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [updatingFeaturedList, setUpdatingFeaturedList] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [processed, setProcessed] = useState(null);
  const [popoverActive, setPopoverActive] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [openReplyModal, setOpenReplyModal] = useState(false);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPages, setSelectedPages] = useState(10);
  const [totalReviews, setTotalReviews] = useState(1);

  useEffect(() => {
    fetchAllReviews();
  }, [selectedPages, queryDebounce, reviewStatus, reviewType, minStar]);

  //Handle pagination
  function hasNext() {
    var total = 1;
    if (totalReviews > selectedPages) {
      if (totalReviews > 0) {
        var total_page = parseInt(totalReviews) / parseInt(selectedPages);
        if (total_page > 0) {
          if (totalReviews % selectedPages !== 0) {
            total = Math.floor(total_page) + 1;
          } else {
            total = Math.floor(total_page);
          }
          if (total === currentPage) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const fetchAllReviews = (page, scrollToTop) => {
    page = page ? (page < 1 ? 1 : page) : 1;
    console.log("query string", queryDebounce);
    setLoadingReviews(true);
    updateReview
      .getReviews({
        page: page,
        search: queryDebounce,
        reviewStatus: reviewStatus ? reviewStatus[0] : null,
        reviewType: reviewType ? reviewType[0] : null,
        starRange: minStar,
      })
      .then((res) => {
        if (res.data && res.data.reviews) {
          setAllReviews(res.data.reviews);
          setTotalReviews(res.data.total_reviews);
          scrollToTop && window.scrollTo(0, 0);
          setLoadingReviews(false);
        } else {
          setLoadingReviews(false);
          console.log("Something went wrong !");
        }
      })
      .catch((error) => {
        setLoadingReviews(false);
        console.log("Something went wrong !");
        console.log("error", error);
      });
  };

  const deleteReview = (review) => {
    setIsDeleting(true);
    updateReview
      .deleteReview({ review: review, productId: review.productId })
      .then((res) => {
        setIsDeleting(false);
        setProcessed(null);
        setPopoverActive(false);
        fetchAllReviews(parseInt(currentPage));
      })
      .catch((error) => {
        console.log("Something went wrong !");
        console.log("error", error);
        setIsDeleting(false);
      });
  };

  const addToFeaturedList = (review) => {
    setUpdatingFeaturedList(true);
    updateReview
      .featureReview({ review: review, productId: review.productId })
      .then(() => {
        approveReview(review);
      })
      .then((res) => {
        setUpdatingFeaturedList(false);
        setProcessed(null);
        setPopoverActive(false);
        fetchAllReviews(parseInt(currentPage));
      })
      .catch((error) => {
        console.log("Something went wrong !");
        console.log("error", error);
        setUpdatingFeaturedList(false);
      });
  };

  const removeFromFeaturedList = (review) => {
    setUpdatingFeaturedList(true);
    updateReview
      .unfeatureReview({ review: review, productId: review.productId })
      .then((res) => {
        setUpdatingFeaturedList(false);
        setProcessed(null);
        setPopoverActive(false);
        fetchAllReviews(parseInt(currentPage));
      })
      .catch((error) => {
        console.log("Something went wrong !");
        console.log("error", error);
        setUpdatingFeaturedList(false);
      });
  };

  const approveReview = (review) => {
    setUpdatingStatus(true);
    updateReview
      .approveReview({ review: review, productId: review.productId })
      .then((res) => {
        setUpdatingStatus(false);
        setProcessed(null);
        setPopoverActive(false);
        fetchAllReviews(parseInt(currentPage));
      })
      .catch((error) => {
        console.log("Something went wrong !");
        console.log("error", error);
        setUpdatingStatus(false);
      });
  };

  const hideReview = (review) => {
    setUpdatingStatus(true);
    updateReview
      .hideReview({ review: review, productId: review.productId })
      .then(() => {
        removeFromFeaturedList(review);
      })
      .then((res) => {
        setUpdatingStatus(false);
        setProcessed(null);
        setPopoverActive(false);
        fetchAllReviews(parseInt(currentPage));
      })
      .catch((error) => {
        console.log("Something went wrong !");
        console.log("error", error);
        setUpdatingStatus(false);
      });
  };

  const handleReviewStatusChange = useCallback(
    (value) => setReviewStatus(value),
    []
  );
  const handleReviewTypeChange = useCallback(
    (value) => setReviewType(value),
    []
  );
  const handleMinStarChange = useCallback((value) => setMinStar(value), []);
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleQueryRemove = useCallback(() => setQueryValue(null), []);
  const handleReviewStatusRemove = useCallback(() => setReviewStatus(null), []);
  const handleMinStarRemove = useCallback(() => setMinStar(null), []);
  const handleReviewTypeRemove = useCallback(() => setReviewType(null), []);
  const handleFiltersClearAll = useCallback(() => {
    handleReviewStatusRemove();
    handleMinStarRemove();
    handleReviewTypeRemove();
    handleQueryRemove();
  }, [
    handleReviewStatusRemove,
    handleMinStarRemove,
    handleReviewTypeRemove,
    handleQueryRemove,
  ]);

  const filters = [
    {
      key: "reviewStatus",
      label: "Review status",
      filter: (
        <ChoiceList
          title="Review status"
          titleHidden
          choices={[
            { label: "All reviews", value: "All" },
            { label: "Featured", value: "Featured" },
            { label: "Published", value: "Published" },
            { label: "Pending", value: "Pending" },
            { label: "Hidden", value: "Hidden" },
          ]}
          selected={reviewStatus || []}
          onChange={handleReviewStatusChange}
        />
      ),
      shortcut: true,
    },
    {
      key: "reviewType",
      label: "Review type",
      filter: (
        <ChoiceList
          title="Review type"
          titleHidden
          choices={[
            { label: "Video & photo reviews", value: "Video & photo reviews" },
            { label: "Text reviews", value: "Text reviews" },
          ]}
          selected={reviewType || []}
          onChange={handleReviewTypeChange}
        />
      ),
      shortcut: true,
    },
    {
      key: "minStar",
      label: "Star rating",
      filter: (
        <RangeSlider
          label="Star rating"
          labelHidden
          value={minStar || [0, 5]}
          output
          min={0}
          max={5}
          step={1}
          onChange={handleMinStarChange}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(reviewStatus)) {
    const key = "reviewStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, reviewStatus),
      onRemove: handleReviewStatusRemove,
    });
  }
  if (!isEmpty(reviewType)) {
    const key = "reviewType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, reviewType),
      onRemove: handleReviewTypeRemove,
    });
  }
  if (!isEmpty(minStar)) {
    const key = "minStar";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, minStar),
      onRemove: handleMinStarRemove,
    });
  }

  return (
    <div>
      <Modal
        small
        open={openReplyModal}
        onClose={() => {
          setProcessed(null);
          setOpenReplyModal(false);
        }}
        title="Public reply to this review"
        primaryAction={{
          content: "Reply",
          onAction: () => setOpenReplyModal(),
        }}
        secondaryActions={[
          {
            content: "Close",
            onAction: () => setOpenReplyModal(false),
          },
        ]}
      >
        <Modal.Section>
          {processed && processed.text !== "" && (
            <div>
              <p>
                <span style={{ fontWeight: 600 }}>Review:</span>{" "}
                {parse(processed.text)}
              </p>
              <br />
            </div>
          )}
          <TextField
            labelHidden
            value={reviewReply}
            onChange={(value) => setReviewReply(value)}
            multiline={4}
            autoComplete="off"
          />
        </Modal.Section>
      </Modal>
      <Page title={`${totalReviews} review`}>
        <div>
          <Card>
            <ResourceList
              loading={loadingReviews}
              resourceName={{ singular: "review", plural: "reviews" }}
              filterControl={
                <Filters
                  queryPlaceholder="Search by name, email or product"
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryRemove}
                  onClearAll={handleFiltersClearAll}
                />
              }
              items={allReviews}
              renderItem={(review) => {
                const {
                  _id,
                  shopId,
                  productId,
                  submitter,
                  isVerified,
                  isFeatured,
                  isApproved,
                  createdAt,
                  rating,
                  text,
                  media,
                } = review;

                return (
                  <ResourceItem id={_id}>
                    {review.media ? (
                      review.media.type === "video" ? (
                        <div>
                          <Stack distribution="equalSpacing">
                            <Heading>
                              <Stack spacing="tight">
                                <Link url={submitter.email}>
                                  {submitter.name}
                                </Link>
                                <p style={{ fontWeight: 600 }}>reviewed</p>
                                <Link url={`${shopId}/products/${productId}`}>
                                  {productId}
                                </Link>
                                {isApproved && (
                                  <Badge size="small" status="info">
                                    Published
                                  </Badge>
                                )}
                                {isVerified && (
                                  <Badge size="small" status="success">
                                    Verified
                                  </Badge>
                                )}
                                {isFeatured && (
                                  <Badge size="small" status="warning">
                                    Featured
                                  </Badge>
                                )}
                              </Stack>
                            </Heading>

                            <p style={{ color: "gray" }}>
                              {formatDistance(createdAt, Date.now())} ago
                            </p>
                          </Stack>
                          <br />
                          <StarRatings
                            rating={rating}
                            starRatedColor="#FFCC00"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="2px"
                            name="rating"
                          />
                          <p>{parse(text)}</p>
                          <video
                            alt=""
                            width="250px"
                            height="auto"
                            style={{
                              marginTop: "2rem",
                              objectFit: "cover",
                              objectPosition: "center",
                              borderRadius: "5px",
                            }}
                            poster={media.gif}
                            controls={true}
                          >
                            <source src={media.url} type="video/mp4" />
                          </video>
                          <br />
                          <Stack distribution="trailing">
                            <Popover
                              active={
                                popoverActive &&
                                processed &&
                                processed._id === review._id
                              }
                              activator={
                                <Button
                                  onClick={() => {
                                    console.log(review, popoverActive);
                                    setProcessed(review);
                                    setPopoverActive(!popoverActive);
                                  }}
                                  disclosure
                                >
                                  More
                                </Button>
                              }
                              onClose={() => setPopoverActive(!popoverActive)}
                            >
                              <ActionList
                                items={[
                                  {
                                    content: "Reply",
                                    onAction: () => {
                                      setPopoverActive(false);
                                      setOpenReplyModal(true);
                                    },
                                  },
                                  {
                                    loading: updatingFeaturedList
                                      ? true
                                      : false,
                                    content: isFeatured
                                      ? "Remove from featured list"
                                      : "Add to featured list",
                                    onAction: () =>
                                      isFeatured
                                        ? removeFromFeaturedList(review)
                                        : addToFeaturedList(review),
                                  },
                                  {
                                    loading: isDeleting,
                                    content: "Delete review",
                                    destructive: true,
                                    onAction: () => deleteReview(review),
                                  },
                                ]}
                              />
                            </Popover>

                            <Button
                              primary
                              loading={
                                updatingStatus &&
                                processed &&
                                processed._id === review._id
                              }
                              outline={isApproved}
                              destructive={isApproved}
                              onClick={() => {
                                setProcessed(review);
                                isApproved
                                  ? hideReview(review)
                                  : approveReview(review);
                              }}
                            >
                              {isApproved ? "Hide" : "Publish"}
                            </Button>
                          </Stack>
                        </div>
                      ) : (
                        // review.media.type === "photo"
                        <div>
                          <Stack distribution="equalSpacing">
                            <Heading>
                              <Stack spacing="tight">
                                <Link url={submitter.email}>
                                  {submitter.name}
                                </Link>
                                <p style={{ fontWeight: 600 }}>reviewed</p>
                                <Link url={`${shopId}/products/${productId}`}>
                                  {productId}
                                </Link>
                                {isApproved && (
                                  <Badge size="small" status="info">
                                    Published
                                  </Badge>
                                )}
                                {isVerified && (
                                  <Badge size="small" status="success">
                                    Verified
                                  </Badge>
                                )}
                                {isFeatured && (
                                  <Badge size="small" status="warning">
                                    Featured
                                  </Badge>
                                )}
                              </Stack>
                            </Heading>

                            <p style={{ color: "gray" }}>
                              {formatDistance(createdAt, Date.now())} ago
                            </p>
                          </Stack>
                          <br />
                          <StarRatings
                            rating={rating}
                            starRatedColor="#FFCC00"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="2px"
                            name="starRatings"
                          />
                          <p>{parse(text)}</p>

                          <img
                            alt=""
                            width="250px"
                            height="auto"
                            style={{
                              marginTop: "2rem",
                              objectFit: "cover",
                              objectPosition: "center",
                              borderRadius: "5px",
                            }}
                            src={media.url}
                          />
                          <br />
                          <Stack distribution="trailing">
                            <Popover
                              active={
                                popoverActive &&
                                processed &&
                                processed._id === review._id
                              }
                              activator={
                                <Button
                                  onClick={() => {
                                    console.log(review, popoverActive);
                                    setProcessed(review);
                                    setPopoverActive(!popoverActive);
                                  }}
                                  disclosure
                                >
                                  More
                                </Button>
                              }
                              onClose={() => setPopoverActive(!popoverActive)}
                            >
                              <ActionList
                                items={[
                                  {
                                    content: "Reply",
                                    onAction: () => {
                                      setPopoverActive(false);
                                      setOpenReplyModal(true);
                                    },
                                  },
                                  {
                                    loading: updatingFeaturedList
                                      ? true
                                      : false,
                                    content: isFeatured
                                      ? "Remove from featured list"
                                      : "Add to featured list",
                                    onAction: () =>
                                      isFeatured
                                        ? removeFromFeaturedList(review)
                                        : addToFeaturedList(review),
                                  },
                                  {
                                    loading: isDeleting,
                                    content: "Delete review",
                                    destructive: true,
                                    onAction: () => deleteReview(review),
                                  },
                                ]}
                              />
                            </Popover>

                            <Button
                              primary
                              loading={
                                updatingStatus &&
                                processed &&
                                processed._id === review._id
                              }
                              outline={isApproved}
                              destructive={isApproved}
                              onClick={() => {
                                setProcessed(review);
                                isApproved
                                  ? hideReview(review)
                                  : approveReview(review);
                              }}
                            >
                              {isApproved ? "Hide" : "Publish"}
                            </Button>
                          </Stack>
                        </div>
                      )
                    ) : (
                      <div>
                        <Stack distribution="equalSpacing">
                          <Heading>
                            <Stack spacing="tight">
                              <Link url={submitter.email}>
                                {submitter.name}
                              </Link>
                              <p style={{ fontWeight: 600 }}>reviewed</p>
                              <Link url={`${shopId}/products/${productId}`}>
                                {productId}
                              </Link>
                              {isApproved && (
                                <Badge size="small" status="info">
                                  Published
                                </Badge>
                              )}
                              {isVerified && (
                                <Badge size="small" status="success">
                                  Verified
                                </Badge>
                              )}
                              {isFeatured && (
                                <Badge size="small" status="warning">
                                  Featured
                                </Badge>
                              )}
                            </Stack>
                          </Heading>

                          <p style={{ color: "gray" }}>
                            {formatDistance(createdAt, Date.now())} ago
                          </p>
                        </Stack>
                        <br />
                        <StarRatings
                          rating={rating}
                          starRatedColor="#FFCC00"
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="2px"
                          name="starRatings"
                        />
                        <p>{parse(text)}</p>
                        <br />
                        <Stack distribution="trailing">
                          <Popover
                            active={
                              popoverActive &&
                              processed &&
                              processed._id === review._id
                            }
                            activator={
                              <Button
                                onClick={() => {
                                  console.log(review, popoverActive);
                                  setProcessed(review);
                                  setPopoverActive(!popoverActive);
                                }}
                                disclosure
                              >
                                More
                              </Button>
                            }
                            onClose={() => setPopoverActive(!popoverActive)}
                          >
                            <ActionList
                              items={[
                                {
                                  content: "Reply",
                                  onAction: () => {
                                    setPopoverActive(false);
                                    setOpenReplyModal(true);
                                  },
                                },
                                {
                                  loading: updatingFeaturedList ? true : false,
                                  content: isFeatured
                                    ? "Remove from featured list"
                                    : "Add to featured list",
                                  onAction: () =>
                                    isFeatured
                                      ? removeFromFeaturedList(review)
                                      : addToFeaturedList(review),
                                },
                                {
                                  loading: isDeleting,
                                  content: "Delete review",
                                  destructive: true,
                                  onAction: () => deleteReview(review),
                                },
                              ]}
                            />
                          </Popover>

                          <Button
                            primary
                            loading={
                              updatingStatus &&
                              processed &&
                              processed._id === review._id
                            }
                            outline={isApproved}
                            destructive={isApproved}
                            onClick={() => {
                              setProcessed(review);
                              isApproved
                                ? hideReview(review)
                                : approveReview(review);
                            }}
                          >
                            {isApproved ? "Hide" : "Publish"}
                          </Button>
                        </Stack>
                      </div>
                    )}
                  </ResourceItem>
                );
              }}
            />
            <div className="pagination" style={{ marginTop: "1rem" }}>
              <Pagination
                hasPrevious={
                  parseInt(currentPage) === 1
                    ? false
                    : allReviews.length > 0
                    ? true
                    : false
                }
                previousTooltip="Previous"
                onPrevious={() => {
                  setCurrentPage(parseInt(currentPage) - 1);
                  fetchAllReviews(parseInt(currentPage) - 1, true);
                }}
                hasNext={hasNext()}
                nextTooltip="Next"
                onNext={() => {
                  setCurrentPage(parseInt(currentPage) + 1);
                  fetchAllReviews(parseInt(currentPage) + 1, true);
                }}
              />
            </div>
          </Card>
        </div>
      </Page>
    </div>
  );
}
export default Reviews;
