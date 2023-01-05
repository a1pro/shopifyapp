import React, { useState, useCallback, useEffect } from "react";
import {
  TextStyle,
  SettingToggle,
  Toast,
  Spinner,
  Page,
  Badge,
} from "@shopify/polaris";
import * as authService from "../services/authService";

export default function SettingStatus(props) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);

  //Toast
  const [toastSuccessMesage, setToastSuccessMessage] = useState(null);
  const [toastErrorMesage, setToastErrorMessage] = useState(null);
  const [toastFlag, setToastFlag] = useState(false);

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
          props.activeSetting();
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

      <SettingToggle
        action={{
          content: contentStatus,
          loading: loading,
          onAction: () => changeAppStatus(),
        }}
        enabled={active}
      >
        This app is <TextStyle variation="strong">{textStatus}</TextStyle>.
      </SettingToggle>
    </div>
  );
}
