import React, { useState } from "react";
import { Tabs, Page, Card } from "@shopify/polaris";
import Youtube from "./Youtube";
import Help from "./Help";
import Setting from "./Setting";
import Reviews from "./Reviews";
import Widgets from "./Widgets";
import Imports from "./Imports";

export default function VideoProfile(props) {
  // console.log("props", props);

  const artist = props.artist;

  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: "reviews",
      content: "Reviews",
    },
    {
      id: "widgets",
      content: "Widgets",
    },
    {
      id: "import",
      content: "Import reviews",
    },
    {
      id: "settings",
      content: "Settings",
    },
    {
      id: "help",
      content: "Help",
    },
    // { id: "YouTube", content: "YouTube" },
  ];

  return (
    // <Page breadcrumbs={[{ content: "Artist", onAction: () => props.isView() }]}>
    <Page>
      <Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
        {selected === 0 && <Reviews />}
        {selected === 1 && <Widgets />}
        {selected === 2 && <Imports />}
        {selected === 3 && <Setting />}
        {selected === 4 && <Help />}
        {selected === 5 && <Youtube />}
      </Tabs>
    </Page>
  );
}
