import React from "react";
import { Heading, Page } from "@shopify/polaris";
import Youtube from "../Component/Youtube";
import VideoProfile from "../Component/VideoProfile";

export default function MainPage() {
  return (
    <Page>
      <Heading>
        <VideoProfile />
      </Heading>
    </Page>
  );
}
