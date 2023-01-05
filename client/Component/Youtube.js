import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  TextField,
  TextStyle,
  Card,
  ResourceItem,
  ResourceList,
  Page,
  Pagination,
  Modal,
  TextContainer,
  Thumbnail,
  Filters,
  Toast,
  Autocomplete,
  Spinner,
  Avatar,
  Layout,
} from "@shopify/polaris";
import YouTube from "react-youtube";
import AddVideo from "./AddVideo";
import _ from "lodash";
import { ImageMajor } from "@shopify/polaris-icons";
// import * as authService from "../../services/authService";
import * as authService from "../services/authService";
import SettingStatus from "./SettingStatus";
export default function Youtube() {
  const [isAdd, setIsAdd] = useState(false);
  const [queryValue, setQueryValue] = useState("");
  const [youtubeList, setYoutubeList] = useState([]);
  const [active, setActive] = useState(false);
  const [deletes, setDeletes] = useState({ flag: false, id: "" });
  const [isYoutubeId, setIsYoutubeId] = useState("");
  const [deletevideoLoader, setDeleteVideoLoader] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [loadStatus, setLoadStatus] = useState(false);

  const [isVideoDisplay, setIsVideoDisplay] = useState({
    flag: false,
    data: [],
    id: "",
    title: "",
  });

  //toast messages
  const [toastSuccessMesage, setToastSuccessMessage] = useState(null);
  const [toastErrorMesage, setToastErrorMessage] = useState(null);
  const [toastFlag, setToastFlag] = useState(false);
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [activeSetting, setActiveSetting] = useState(false);

  //search filter

  const [productWith, setProductWith] = useState(null);

  //search product with
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchName, setSearchName] = useState([]);

  const toggleActive = useCallback(
    () => setToastFlag((toastFlag) => !toastFlag),
    []
  );

  //open delete modal

  const [opendeletemodal, setOpenDeleteModal] = useState(false);

  const toastMarkup = toastFlag ? (
    toastSuccessMesage ? (
      <Toast content={toastSuccessMesage} onDismiss={toggleActive} />
    ) : (
      <Toast content={toastErrorMesage} onDismiss={toggleActive} error />
    )
  ) : null;

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPages, setSelectedPages] = useState(10);
  const [totalRecords, setTotalRecords] = useState(1);

  //Display video data

  console.log("isVideoDisplay", isVideoDisplay);

  const DisplayVideoData = (page) => {
    page = page ? (page < 1 ? 1 : page) : 1;
    const data = {
      search: queryValue,
      page,
      searchProduct: searchName.toString(),
    };

    setLoadVideo(true);
    authService
      .getVideoData(data)
      .then((res) => {
        if (res.data && res.data.video) {
          setYoutubeList(res.data.video);
          setTotalRecords(res.data.total_records);
          if (isVideoDisplay.flag) {
            if (isVideoDisplay.title === "home") {
              var temp_video_data = _.find(res.data.video, [
                "key",
                isVideoDisplay.title,
              ]);
            } else {
              var temp_video_data = _.find(res.data.video, [
                "productId.id",
                isVideoDisplay.title,
              ]);
            }
            if (!temp_video_data) {
              // no more videos in this product, close the modal
              setIsVideoDisplay({ flag: false, data: [], id: "", title: "" });
              setLoadVideo(false);
              return;
            }
            setIsVideoDisplay({
              flag: isVideoDisplay.flag,
              data: temp_video_data.url,
              id: isVideoDisplay.id,
              title: isVideoDisplay.title,
            });
          }
          setLoadVideo(false);
        } else {
          setLoadVideo(false);
          setToastFlag(true);
          setToastErrorMessage("Something went wrong !");
        }
      })
      .catch((error) => {
        setLoadVideo(false);
        setToastFlag(true);
        setToastErrorMessage("Something went wrong !");
        console.log("error", error);
      });
  };

  useEffect(() => {
    DisplayVideoData();
  }, [queryValue, selectedPages, searchName]);

  //Handle pagination

  function hasNext() {
    var total = 1;
    if (totalRecords > selectedPages) {
      if (totalRecords > 0) {
        var total_page = parseInt(totalRecords) / parseInt(selectedPages);
        if (total_page > 0) {
          if (totalRecords % selectedPages !== 0) {
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

  //delete modal
  // const handleClose = (() =>
  //   setOpenDeleteModal(!opendeletemodal), [opendeletemodal]
  // );

  const handleClose = () => {
    setActive(false);
    setDeletes({ flag: false, id: "" });
  };

  //delete youtube video

  const DeleteVideo = () => {
    setDeletes({ flag: false, id: deletes._id });
    setDeleteVideoLoader(true);
    authService
      .removeVideoData({ _id: deletes.id, id: isVideoDisplay.title })
      .then((res) => {
        console.log("res delete", res);
        setDeletes({ flag: false, id: "" });
        setDeleteVideoLoader(false);
        setToastFlag(true);
        setToastSuccessMessage("Successfully Deleted..");
        DisplayVideoData(); // get(display) video data
      })
      .catch((error) => {
        setDeleteVideoLoader(false);
        setToastFlag(true);
        setToastErrorMessage("Something went wrong !");
        console.log("error", error);
      });
  };

  useEffect(() => {
    // setLoader(true);
    setLoadStatus(true);
    authService
      .getStatus()
      .then((res) => {
        setLoadStatus(false);
        if (res.data) setActiveSetting(res.data.status);
      })
      .catch((err) => {
        setLoadStatus(false);
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    setLoadVideo(true);
    authService
      .getVideoProduct()
      .then((res) => {
        setLoadVideo(false);

        if (res.data) {
          const temp = [];
          res.data.map((item) => {
            const data = { label: item, value: item };
            temp.push(data);
          });
          setDeselectedOptions(temp);
          setOptions(temp);
        }
      })
      .catch((error) => {
        setLoadVideo(false);
        console.log("error", error);
      });
  }, []);

  const updateVideo = useCallback(
    (value) => {
      setSearchName([value]);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setSearchName(selectedValue);
    },
    [options]
  );

  const textField = (
    <Autocomplete.TextField
      // onFocus={updateVideo}
      onChange={updateVideo}
      label="Product with"
      // value={productWith}
      // onChange={handleProductWithChange}
      value={searchName && searchName.length > 0 && searchName[0]}
      labelHidden
    />
  );

  const filters = [];

  // const filters = [
  //   {
  //     key: "productwith",
  //     label: "Product with",
  //     filter: (
  //       <div>
  //         {/* <div style={{ height: "225px" }}> */}
  //         <Autocomplete
  //           options={options}
  //           selected={selectedOptions}
  //           onSelect={updateSelection}
  //           textField={textField}
  //         />
  //         {/* </div> */}
  //       </div>
  //     ),
  //     shortcut: true,
  //   },
  // ];

  const getProductString = (productId) => {
    var temp = "";
    productId.map((item, i) => {
      temp += `${i !== 0 ? ", " : ""}` + `${item.title.toString()}`;
    });
    return temp;
  };

  return (
    <div>
      {toastMarkup}
      {loadStatus ? (
        <div className="spinner">
          <Page>
            <Spinner size="small" />
          </Page>
        </div>
      ) : (
        <Page>
          <div>
            <div className="btn-add-youtube">
              <Button onClick={() => setIsAdd(true)} primary>
                Add a video
              </Button>
            </div>
            <br />
          </div>
          <br />

          <Card>
            <ResourceList
              loading={loadVideo}
              resourceName={{
                singular: "page",
                plural: "pages",
              }}
              filterControl={
                <Filters
                  queryValue={queryValue}
                  onQueryChange={setQueryValue}
                  onQueryClear={() => {
                    setQueryValue("");
                  }}
                  filters={[]}
                  appliedFilters={[]}
                  filters={filters}
                ></Filters>
              }
              items={youtubeList}
              renderItem={(item) => {
                const { _id, url, productId, key } = item;
                const media = (
                  <Thumbnail
                    source={
                      productId && productId.image && productId.image
                        ? productId.image
                        : ImageMajor
                    }
                    size="small"
                    alt="Small document"
                  />
                );
                return (
                  <ResourceItem
                    id={_id}
                    media={media}
                    onClick={() => {
                      setIsVideoDisplay({
                        flag: true,
                        id: _id,
                        data: url,
                        title: key === "home" ? key : productId.id,
                        page: key === "home" ? key : productId.title,
                      });
                    }}
                  >
                    <div className="view-data1">
                      <div style={{ minWidth: "45%" }}>
                        <TextStyle>
                          {key === "home" ? key : productId.title}
                        </TextStyle>
                      </div>
                      <div style={{ minWidth: "40%", marginLeft: "15px" }}>
                        <TextStyle>{url.length}</TextStyle>
                      </div>

                      <div style={{ minWidth: "10%" }}>
                        <Button
                          size="slim"
                          // destructive
                          // loading={isVideoDisplay.id === id && deletevideoLoader}
                          onClick={() => {
                            setIsVideoDisplay({
                              flag: true,
                              id: _id,
                              data: url,
                              title: key === "home" ? key : productId.id,
                            });
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </ResourceItem>
                );
              }}
            />
            <div className="pagination" style={{ marginTop: "1rem" }}>
              <Pagination
                hasPrevious={
                  parseInt(currentPage) === 1
                    ? false
                    : youtubeList.length > 0
                    ? true
                    : false
                }
                previousTooltip="Previous"
                onPrevious={() => {
                  setCurrentPage(parseInt(currentPage) - 1);
                  DisplayVideoData(parseInt(currentPage) - 1);
                }}
                hasNext={hasNext()}
                nextTooltip="Next"
                onNext={() => {
                  setCurrentPage(parseInt(currentPage) + 1);
                  DisplayVideoData(parseInt(currentPage) + 1);
                }}
              />
            </div>
          </Card>

          {/* redirect add video page */}
          {isAdd && (
            <AddVideo
              isAddCancel={() => {
                setIsAdd(false);
              }}
              DisplayVideoData={() => {
                DisplayVideoData();
              }}
            />
          )}

          <Modal
            open={isVideoDisplay.flag}
            onClose={() => {
              setIsVideoDisplay({ flag: false, data: [], id: "", title: "" });
            }}
            title={`Manage all videos - ${isVideoDisplay.page}`}
            large
          >
            <Modal.Section>
              <Layout>
                {isVideoDisplay.data.map((item) => {
                  const { id, url, type } = item;

                  return (
                    <Layout.Section oneThird>
                      <Card className="youtube-card">
                        <Card.Section className="p-0">
                          {/* <TextStyle variation="strong">{url}</TextStyle> */}

                          <YouTube
                            opts={{
                              height: "200",
                              width: "100%",
                            }}
                            videoId={url.split("=")[1]}
                          />
                        </Card.Section>

                        <Card.Section>
                          <Button
                            monochrome
                            outline
                            size="slim"
                            destructive
                            loading={deletes.id === id && deletevideoLoader}
                            onClick={() => {
                              setDeletes({ flag: true, id: id });
                            }}
                          >
                            {" "}
                            Delete
                          </Button>
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                  );
                })}
              </Layout>
            </Modal.Section>
          </Modal>

          {/* model for delete Youtube video */}
          <Modal
            open={deletes.flag}
            onClose={handleClose}
            title="Delete this video?"
            primaryAction={{
              content: "Delete",
              onAction: DeleteVideo,
            }}
          >
            <Modal.Section>
              <TextContainer>
                <TextStyle variation="strong">
                  Are you sure you want to delete this video?
                </TextStyle>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </Page>
      )}
    </div>
  );
}
