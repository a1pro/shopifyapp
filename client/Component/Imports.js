import React, { useState, useEffect, useCallback } from "react";
import {
  Page,
  Select,
  Card,
  Stack,
  List,
  Modal,
  Toast,
  TextField,
} from "@shopify/polaris";
import { CSVReader } from "react-papaparse";
import * as updateReview from "../services/updateReview";

function Imports() {
  const [source, setSource] = useState("");
  const [productId, setProductId] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState();
  const [reviews, setReviews] = useState(null);
  const [counter, setCounter] = useState(0);
  const [isAddLoader, setIsAddLoader] = useState(false);

  //toast messages
  const [toastSuccessMessage, setToastSuccessMessage] = useState(null);
  const [toastErrorMessage, setToastErrorMessage] = useState(null);
  const [toastFlag, setToastFlag] = useState(false);

  const toggleActive = useCallback(
    () => setToastFlag((toastFlag) => !toastFlag),
    []
  );

  const toastMarkup = toastFlag ? (
    toastSuccessMessage ? (
      <Toast content={toastSuccessMessage} onDismiss={toggleActive} />
    ) : (
      <Toast content={toastErrorMessage} onDismiss={toggleActive} error />
    )
  ) : null;

  useEffect(() => {
    if (source !== "" && source) {
      setShowUploadModal(true);
    }
  }, [source]);

  const handleSelectChange = useCallback((value) => setSource(value), []);

  const options = [
    { label: "Select a source", value: "" },
    // { label: "AliExpress", value: "AliExpress" },
    { label: "Loox", value: "Loox" },
    { label: "Testimonial.to", value: "Testimonial.to" },
    // { label: "Yotpo", value: "Yotpo" },
    // { label: "Stamped.io", value: "Stamped.io" },
    { label: "Judge.Me", value: "Judge.Me" },
  ];

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setReviews(null);
    setSource("");
    setProductId("");
    setShowUploadModal(false);
  };

  const handleOnDrop = (data) => {
    setReviews(data.slice(1));
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    setReviews(null);
  };

  const importReviews = () => {
    setIsAddLoader(true);
    updateReview
      .importReviews({
        reviews: reviews,
        source: source,
        productId: productId,
      })
      .then((res) => {
        setToastFlag(true);
        setToastSuccessMessage(
          "We're importing " + reviews.length + " reviews..."
        );
        setIsAddLoader(false);
        setShowUploadModal(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsAddLoader(false);
        setToastFlag(true);
        setToastErrorMessage("Something went wrong, please try again 🙁");
        setShowUploadModal(false);
      });
  };

  return (
    <div>
      {toastMarkup}
      <Modal
        open={showUploadModal}
        onClose={handleCloseUploadModal}
        title={`Import reviews from ${
          source !== "" && source ? source : "a CSV file"
        }`}
        primaryAction={{
          loading: isAddLoader ? true : false,
          content: "Confirm to import",
          onAction: importReviews,
        }}
      >
        <Modal.Section>
          {source === "Testimonial.to" && (
            <div>
              <TextField
                label="ProductId"
                value={productId}
                onChange={(value) => setProductId(value)}
                autoComplete="off"
                placeholder={`blue-hoddie`}
              />

              <br />
            </div>
          )}
          <CSVReader
            onDrop={handleOnDrop}
            onError={handleOnError}
            addRemoveButton
            removeButtonColor="#659cef"
            onRemoveFile={handleOnRemoveFile}
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
          {reviews && reviews.length > 0 && (
            <p style={{ marginTop: "2rem", textAlign: "center" }}>
              Click confirm button to import {reviews.length} reviews. We will
              email you once the import is completed.
            </p>
          )}
        </Modal.Section>
      </Modal>
      <Page>
        <Card title="Import from supported apps">
          <Card.Section>
            <Select
              options={options}
              onChange={handleSelectChange}
              value={source}
            />
          </Card.Section>
        </Card>
        <br />
        <p style={{ textAlign: "center", fontSize: "2rem", fontWeight: 600 }}>
          Or 👇
        </p>
        <br />
        <Card
          title="Import from a CSV file"
          primaryFooterAction={{
            content: "Upload a file",
            onAction: () => openUploadModal(),
          }}
        >
          <Card.Section title="Requirements">
            <List>
              <List.Item>Only supports CSV file</List.Item>
              <List.Item>
                Fill in the data that meets all requirements
              </List.Item>
            </List>
          </Card.Section>
        </Card>
      </Page>
    </div>
  );
}
export default Imports;
