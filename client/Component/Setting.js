import React, { useState, useCallback, useEffect } from "react";
import {
  TextStyle,
  SettingToggle,
  Toast,
  Spinner,
  Page,
  Badge,
  Card,
  Stack,
  Select,
  Button,
  TextField,
  RangeSlider,
  Modal,
  Thumbnail,
  MediaCard,
  VideoThumbnail,
} from "@shopify/polaris";
import { TwitterPicker } from "react-color";
import * as authService from "../services/authService";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

export default function Setting(props) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);
  const [borderSelected, setBorderSelected] = useState("rounded");
  const [layoutSelected, setLayoutSelected] = useState("grid");
  const [timingSelected, setTimingSelected] = useState(14);
  const [timingAfterSelected, setTimingAfterSelected] = useState("delivery");
  const [displayRuleSelected, setDisplayRuleSelected] = useState("always-show");
  const [addReviewBtnSelected, setAddReviewBtnSelected] = useState("show");
  const [emailSubject, setEmailSubject] = useState(null);
  const [emailBody, setEmailBody] = useState(null);
  const [ctaText, setCtaText] = useState(null);
  const [ownerVideo, setOwnerVideo] = useState([]);
  const [ratingsRange, setRatingsRange] = useState([0, 5]);
  const [showPreview, setShowPreview] = useState(false);

  //Toast
  const [toastSuccessMesage, setToastSuccessMessage] = useState(null);
  const [toastErrorMesage, setToastErrorMessage] = useState(null);
  const [toastFlag, setToastFlag] = useState(false);

  const layoutOptions = [
    { label: "Grid", value: "grid" },
    { label: "List", value: "list" },
    { label: "Carousel", value: "carousel" },
  ];
  const borderOptions = [
    { label: "Rounded", value: "rounded" },
    { label: "Sharp", value: "sharp" },
  ];
  const timingOptions = [
    { label: "1 day", value: "1" },
    { label: "3 days", value: "3" },
    { label: "7 days", value: "7" },
    { label: "14 days", value: "14" },
    { label: "30 days", value: "30" },
    { label: "45 days", value: "45" },
    { label: "60 days", value: "60" },
  ];
  const timingAfterOptions = [
    { label: "Purchase", value: "purchase" },
    {
      label: "Delivery",
      value: "delivery",
    },
    { label: "Fulfillment", value: "fulfillment" },
  ];
  const displayRuleOptions = [
    { label: "Always show", value: "always-show" },
    { label: "Hide when empty", value: "hide-empty" },
    {
      label: "Always hide",
      value: "always-hide",
    },
  ];
  const addReviewBtnOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const toggleActive = useCallback(
    () => setToastFlag((toastFlag) => !toastFlag),
    []
  );
  const toastMarkup = toastFlag ? (
    toastSuccessMesage ? (
      <Toast content={toastSuccessMesage} onDismiss={toggleActive} />
    ) : (
      <Toast content={toastErrorMesage} onDismiss={toggleActive} error />
    )
  ) : null;

  const contentStatus = active ? "Disable" : "Enable";
  const textStatus = !active ? (
    <Badge status="warning">Disabled</Badge>
  ) : (
    <Badge status="success">Enabled</Badge>
  );

  // Get Status

  useEffect(() => {
    // setLoader(true);
    setLoadingMain(true);
    authService
      .getStatus()
      .then((res) => {
        setLoadingMain(false);
        console.log("res", res);
        console.log("res.data", res.data);
        if (res.data) setActive(res.data.status);
      })
      .catch((err) => {
        setLoadingMain(false);
        console.log("err", err);
      });
  }, []);

  // change App statue

  const changeAppStatus = () => {
    setLoading(true);
    authService
      .changeStatus({ status: !active })
      .then((res) => {
        console.log("res", res);
        setToastSuccessMessage("Sucessfully Changed");
        setToastFlag(true);
        if (res.data && res.data.status === "success") {
          setActive(!active);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setToastFlag(false);
        setToastErrorMessage("please try again. Something went wrong !!");
        console.log("err", err);
      });
  };

  return (
    <div>
      {toastMarkup}
      {loadingMain ? (
        <div className="spinner">
          <Page>
            <Spinner size="small" />
          </Page>
        </div>
      ) : (
        <Page>
          <Modal
            open={showPreview}
            onClose={() => {
              setShowPreview(false);
            }}
            title="Preview the email"
            primaryAction={{
              content: "Close",
              onAction: () => setShowPreview(false),
            }}
            secondaryActions={{ content: "Send a test to yourself" }}
          >
            <Modal.Section>
              <Card>
                <Card.Section>
                  <p>Hello [Name]</p>
                  <br />

                  <p>
                    Thanks for purchasing{" "}
                    <a href="" target="_target">
                      XYZ product
                    </a>{" "}
                    from us!
                  </p>
                  <br />

                  <p>
                    {emailBody ||
                      "Would you mind sharing with us how you like the product? It will help us a lot 🙏"}
                  </p>
                  <br />

                  <VideoThumbnail
                    size="small"
                    thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  />
                  <br />

                  <Button primary>{ctaText || "Leave a review"}</Button>
                </Card.Section>
              </Card>
            </Modal.Section>
          </Modal>

          <SettingToggle
            action={{
              content: contentStatus,
              loading: loading,
              onAction: () => changeAppStatus(),
            }}
            enabled={active}
          >
            Your review widget is{" "}
            <TextStyle variation="strong">{textStatus}</TextStyle>
          </SettingToggle>

          <Card title="General settings" sectioned>
            <Card.Section>
              <Stack distribution="fillEvenly">
                <Stack.Item>When to display</Stack.Item>
                <Select
                  options={displayRuleOptions}
                  onChange={(value) => setDisplayRuleSelected(value)}
                  value={displayRuleSelected}
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>Collect reviews from the widget</Stack.Item>
                <Select
                  options={addReviewBtnOptions}
                  onChange={(value) => setAddReviewBtnSelected(value)}
                  value={addReviewBtnSelected}
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>{`Auto-publish reviews (${ratingsRange[0]} - ${ratingsRange[1]} stars)`}</Stack.Item>
                <RangeSlider
                  labelHidden
                  value={ratingsRange || [0, 5]}
                  output
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) => setRatingsRange(value)}
                  prefix={<p>0</p>}
                  suffix={<p>5</p>}
                />
              </Stack>
            </Card.Section>
          </Card>

          <Card title="Review request" sectioned>
            <Card.Section>
              <Stack distribution="fillEvenly">
                <Stack.Item>Subject</Stack.Item>
                <TextField
                  value={emailSubject}
                  onChange={(value) => setEmailSubject(value)}
                  autoComplete="off"
                  placeholder="Please review your recent purchase 🙏"
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>Body</Stack.Item>
                <TextField
                  value={emailBody}
                  onChange={(value) => setEmailBody(value)}
                  autoComplete="off"
                  multiline={6}
                  placeholder={`Would you mind sharing with us how you like the product? It will help us a lot!`}
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>CTA text</Stack.Item>
                <TextField
                  value={ctaText}
                  onChange={(value) => setCtaText(value)}
                  autoComplete="off"
                  placeholder="Submit your review"
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>Your message in a video</Stack.Item>
                <FilePond
                  // ref={(ref) => (pond = ref)}
                  files={ownerVideo}
                  allowMultiple={false}
                  maxFiles={1}
                  acceptedFileTypes={["video/*"]}
                  name="ownerVideo"
                  onupdatefiles={(fileItems) => {
                    setOwnerVideo({
                      ownerVideo: fileItems.map((fileItem) => fileItem.file),
                    });
                  }}
                  credits={false}
                  labelIdle='<span class="filepond--label-action">👉 Add your own video message</span>'
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>When to send</Stack.Item>
                <Stack vertical={true}>
                  <Select
                    options={timingOptions}
                    onChange={(value) => setTimingSelected(value)}
                    value={timingSelected}
                  />
                  <Select
                    label="After"
                    labelInline
                    options={timingAfterOptions}
                    onChange={(value) => setTimingAfterSelected(value)}
                    value={timingAfterSelected}
                  />
                </Stack>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Card.Subsection>
                <Stack distribution="trailing">
                  <Button onClick={() => setShowPreview(true)}>Preview</Button>
                  <Button primary>Save</Button>
                </Stack>
              </Card.Subsection>
            </Card.Section>
          </Card>

          <Card title="Review display" sectioned>
            <Card.Section>
              <Stack distribution="fillEvenly">
                <Stack.Item>Layout</Stack.Item>
                <Select
                  options={layoutOptions}
                  onChange={(value) => setLayoutSelected(value)}
                  value={layoutSelected}
                />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>Theme color</Stack.Item>
                <TwitterPicker triangle="hide" />
              </Stack>
              <br />
              <Stack distribution="fillEvenly">
                <Stack.Item>Card border</Stack.Item>
                <Select
                  options={borderOptions}
                  onChange={(value) => setBorderSelected(value)}
                  value={borderSelected}
                />
              </Stack>
            </Card.Section>
          </Card>
        </Page>
      )}
    </div>
  );
}
