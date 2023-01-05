import React, { useState, useCallback } from "react";
import {
  Page,
  Card,
  Stack,
  Layout,
  Icon,
  Heading,
  Link,
  TextField,
  List,
  Select,
} from "@shopify/polaris";
import { CopyBlock, dracula } from "react-code-blocks";

function Widgets() {
  const [position, setPosition] = useState("Right");
  const [ctaText, setCtaText] = useState("");

  const positionOptions = [
    { label: "Right", value: "Right" },
    { label: "Left", value: "Left" },
  ];

  return (
    <div>
      <Page fullWidth={true}>
        <Card title="Featured widget">
          <Card.Section>
            <p>
              Highlight user-selected reviews anywhere on your homepage. Use it
              to showcase your bestselling products and surface the best
              customer reviews.
            </p>
          </Card.Section>
          <Card.Section>
            <List type="number">
              <List.Item>
                <p>
                  Go to your{" "}
                  <a
                    href="https://www.shopify.com/admin/themes"
                    target="_blank"
                  >
                    Shopify Themes menu
                  </a>
                  .
                </p>
              </List.Item>
              <List.Item>
                <p>Click the "Actions" menu, then select "Edit code".</p>
              </List.Item>
              <List.Item>
                <p>
                  Open the template or section you use for the page you wish to
                  add the widget to.
                </p>
              </List.Item>
              <List.Item>
                <p style={{ marginBottom: "1rem" }}>
                  Add the code below to where you want to display the Featured
                  reviews:
                </p>
                <CopyBlock
                  language={"jsx"}
                  text={`<div class="youtube-video"></div>`}
                  theme={dracula}
                  wrapLines={true}
                ></CopyBlock>
              </List.Item>
            </List>
          </Card.Section>
        </Card>
        {/* <Card title="Popup notification">
          <Card.Section>
            <p>
              Show featured reviews in a smart pop-ups to drive more
              conversions.
            </p>
          </Card.Section>
          <Card.Section>
            <List type="number">
              <List.Item>
                <p>Step 1</p>
              </List.Item>
              <List.Item>
                <p style={{ marginBottom: "1rem" }}>Step 2</p>
                <CopyBlock
                  language={"jsx"}
                  text={`<div class="youtube-video"></div>`}
                  theme={dracula}
                  wrapLines={true}
                ></CopyBlock>
              </List.Item>
            </List>
          </Card.Section>
        </Card> */}
        <Card
          title="Sidebar badge"
          primaryFooterAction={{ content: "Activate" }}
        >
          <Card.Section>
            <p>
              Add a floating button on the side to allow your customers to
              easily access all reviews.
            </p>
          </Card.Section>
          <Card.Section>
            <Stack distribution="fillEvenly">
              <Stack.Item>Position</Stack.Item>
              <Select
                options={positionOptions}
                onChange={(value) => setPosition(value)}
                value={position}
              />
            </Stack>
            <br />
            <Stack distribution="fillEvenly">
              <Stack.Item>CTA text</Stack.Item>
              <TextField
                value={ctaText}
                onChange={(value) => setCtaText(value)}
                autoComplete="off"
                placeholder="Reviews"
              />
            </Stack>
          </Card.Section>
        </Card>
      </Page>
    </div>
  );
}
export default Widgets;
