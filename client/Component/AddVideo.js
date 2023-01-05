import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Modal,
  Select,
  Toast,
  List,
  FormLayout,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import * as authService from "../services/authService";

export default function AddVideo(props) {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState("home");
  const [product, setProduct] = useState([]);
  const [isAddLoader, setIsAddLoader] = useState(false);
  const [badURL, setBadURL] = useState(false);

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

  const options = [
    { label: "Home Page", value: "home" },
    { label: "Product page", value: "product" },
  ];

  //Handle Add videos

  const handleAddVideo = () => {
    setBadURL(false);

    // sanity check
    if (url.indexOf("www.youtube.com/watch?v") === -1) {
      setBadURL(true);
      return;
    }
    if (selected === "product" && product.length === 0) {
      // no products seletect
      return;
    }

    const data = {
      url,
      key: selected,
      productId: product,
    };
    setIsAddLoader(true);
    authService
      .postVideoData(data)
      .then((res) => {
        setToastFlag(true);
        setToastSuccessMessage("Successfully added 🎉");
        setIsAddLoader(false);
        props.DisplayVideoData();
        props.isAddCancel();
      })
      .catch((error) => {
        console.log("error", error);
        setIsAddLoader(false);
        setToastFlag(true);
        setToastErrorMessage("Something went wrong, please try again 🙁");
      });
  };

  const handleProductSelect = (payload) => {
    if (
      payload.selection &&
      Array.isArray(payload.selection) &&
      payload.selection.length > 0
    ) {
      const temp_data = [];
      payload.selection.map((res) => {
        const data12 = {
          title: res.title,
          id: res.id,
          image: res.images.length > 0 ? res.images[0].originalSrc : "",
        };
        temp_data.push(data12);
      });

      setProduct(temp_data);
    }
  };

  return (
    <div>
      {toastMarkup}
      <div style={{ height: "500px" }}>
        <Modal
          open
          onClose={() => {
            props.isAddCancel();
          }}
          title="Add a video"
          primaryAction={{
            loading: isAddLoader ? true : false,
            content: "Save Video",
            onAction: handleAddVideo,
          }}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Video link"
                placeholder="https://www.youtube.com/watch?v=HPJKxAhLw5I"
                value={url}
                onChange={setUrl}
                error={badURL ? "bad url" : ""}
              />

              <Select
                label="Add to"
                options={options}
                onChange={(value) => {
                  setSelected(value);
                  if (value === "home") {
                    setProduct([]);
                  }
                }}
                value={selected}
                error={
                  selected === "product" && product.length === 0
                    ? "You haven't selected any product."
                    : ""
                }
              />
            </FormLayout>

            <ResourcePicker
              resourceType="Product"
              showVariants={false}
              open={selected === "product" ? true : false}
              onSelection={(payload) => {
                console.log("payload", payload);
                handleProductSelect(payload);
              }}
            />
            {selected === "product" && product.length > 0 && (
              <List type="bullet">
                {product.map((item) => {
                  return <List.Item>{item.title}</List.Item>;
                })}
              </List>
            )}
          </Modal.Section>
        </Modal>
      </div>
    </div>
  );
}
