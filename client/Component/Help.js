import React, { useEffect } from "react";
import {
  Page,
  Card,
  Stack,
  Layout,
  Icon,
  Heading,
  Link,
  TextStyle,
  List,
} from "@shopify/polaris";
import { CopyBlock, dracula } from "react-code-blocks";

function Help() {
  return (
    <div>
      <Page title="Help">
        <div className="faq_container">
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <div className="faq">
                  <div>
                    <Heading>Quick Answers</Heading>
                    <div className="faq_answer" style={{ marginTop: "10px" }}>
                      For support and app related queries, feel free to email us{" "}
                      <Link
                        external
                        onClick={() =>
                          typeof window !== undefined &&
                          window.open("mailto: test@test.com", "_blank")
                        }
                      >
                        {" "}
                        here
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </Layout.Section>
          </Layout>
        </div>
        <br />
        <div>
          <Layout>
            <Layout.Section oneHalf>
              <Card title="Instructions to Add code manually" sectioned>
                <div>
                  <TextStyle>
                    If you want to change position of the widget then please add
                    below code in your theme code by following below
                    instructions
                  </TextStyle>
                  <br />
                  <br />
                  <List type="number">
                    <List.Item>
                      Edit the <b>theme.liquid</b> file : Login to{" "}
                      <b>Shopify admin</b> -{">"} select <b>"Online store"</b>{" "}
                      on left hand side -{">"} select <b>"Themes"</b>
                    </List.Item>
                    <List.Item>
                      In the top header menu <b>Current theme</b> in, click on
                      the <b>"Actions"</b> button and select the option{" "}
                      <b>"Edit Code"</b>
                    </List.Item>
                  </List>
                  <br />
                  <br />
                  <TextStyle>For Product Page: </TextStyle>
                  <br />
                  <List type="bullet">
                    <List.Item>
                      On dawn theme, find <b>main-product.liquid</b>
                    </List.Item>
                    <List.Item>
                      for other themes find <b>product.liquid</b> or{" "}
                      <b>product-template.liquid</b> file
                    </List.Item>
                    <List.Item>
                      place below div on position where you want to show the
                      widget
                    </List.Item>
                  </List>
                </div>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card title="Code Viewer" sectioned>
                <div className={"codeSnippet"}>
                  <CopyBlock
                    language={"jsx"}
                    text={`<div class="youtube-video"></div>`}
                    theme={dracula}
                    wrapLines={true}
                  ></CopyBlock>
                </div>
              </Card>
            </Layout.Section>
          </Layout>
        </div>
      </Page>
    </div>
  );
}
export default Help;
