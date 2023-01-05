var base_url = "<%baseurl%>";

const script1 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      var script = document.createElement("script");
      document.head.appendChild(script);
      script.type = "text/javascript";
      script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";

      var style1 = document.createElement("style");

      const style_temp = `<style>
                  
      .da-wrapper {
          max-width:1280px;
          text-align: center;
          margin:0 auto;
          padding-left:10px;
        }
        
      .da-grid {
          //background: white;
          max-width: 1220px;
          margin:0 auto;
        }
        
      .da-grid:after {
          content: '';
          display: block;
          clear: both;
        }
        
        /* ---- grid-item ---- */
  
      .da-grid-sizer,
          .da-grid-item { width:300px; height: 250px; }
        
      .da-grid-item {
          float: left;
          padding-bottom: 3px;
        }
  
      .da-grid-item iframe {
          display: block;
          width: 100%;

        }

        iframe {
          border-radius: 11px;
        }
        
      .da-grid-item--height2 { 
          height: 320px;
        }
        .da-grid-item--height3 { 
          height: 390px;
        }
        .da-grid-item--height4 { 
          height: 460px;
        }
      </style>`;
      style1.innerHTML = style_temp;

      document.head.appendChild(style1);

      script.onload = () => {
        var script1 = document.createElement("script");
        document.head.appendChild(script1);
        script1.type = "text/javascript";
        script1.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js";

        script1.onload = () => {
          var script2 = document.createElement("script");
          document.head.appendChild(script2);
          script2.type = "text/javascript";
          script2.src =
            "https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.min.js";

          script2.onload = jQueryCode;

          resolve();
        };
      };
    } catch (error) {
      resolve();
    }
  });
};

const script2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      var style1 = document.createElement("style");
      style1.innerHTML = style_temp;

      document.head.appendChild(style1);

      var script1 = document.createElement("script");
      document.head.appendChild(script1);
      script1.type = "text/javascript";
      script1.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js";

      script1.onload = () => {
        var script2 = document.createElement("script");
        document.head.appendChild(script2);
        script2.type = "text/javascript";
        script2.src =
          "https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.min.js";

        script2.onload = jQueryCode;

        resolve();
      };
    } catch (error) {
      resolve();
    }
  });
};

jQueryCode = function () {
  //test comment
  jQuery(document).ready(async function ($) {
    var shop_name = Shopify.shop;

    console.log("shop_name", shop_name);

    const handleUrl = (url) => {
      // return url.replace("watch?v=", "embed/")
      if (url.includes("watch?v=")) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        const video_id = match && match[2].length === 11 ? match[2] : null;

        return `https://www.youtube.com/embed/${video_id}`;
      } else {
        return url.replace(
          /(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,
          "www.youtube.com/embed/$1"
        );
      }
    };

    if (
      ShopifyAnalytics.meta.page.pageType === "product" ||
      ShopifyAnalytics.meta.page.pageType === "home"
    ) {
      if (
        ShopifyAnalytics.meta &&
        ShopifyAnalytics.meta.product &&
        ShopifyAnalytics.meta.product.id
      ) {
        var url =
          base_url +
          "/api/get-video-store?shop=" +
          shop_name +
          "&&key=" +
          ShopifyAnalytics.meta.page.pageType +
          "&&id=gid://shopify/Product/" +
          ShopifyAnalytics.meta.product.id;
      } else {
        var url =
          base_url +
          "/api/get-video-store?shop=" +
          shop_name +
          "&&key=" +
          ShopifyAnalytics.meta.page.pageType +
          "&&id=" +
          null;
      }

      $.ajax({
        type: "GET",
        crossOrigin: true,
        url: url,
        success: (data) => {
          const video = data && data.video;

          var temp_html = "";
          video.url.map((res, index) => {
            // const num = Math.random() * (video.length - 0) + 0;

            var wRand = Math.random();
            var hRand = Math.random();

            // const pri = index % 4 === 0 ? index : null;
            // const ev = index % 3 === 0 ? index : null;

            var heightClass =
              hRand > 0.85
                ? "da-grid-item--height4"
                : hRand > 0.6
                ? "da-grid-item--height3"
                : hRand > 0.35
                ? "da-grid-item--height2"
                : "";

            console.log("heightClass", heightClass);

            temp_html += `<div class="da-grid-item ${heightClass}">
                                            <iframe width="100%" height="100%" src="${handleUrl(
                                              res.url
                                            )}"  allowfullscreen ></iframe>
                                      </div>`;
          });

          if (
            ShopifyAnalytics.meta.page.pageType === "home" ||
            ShopifyAnalytics.meta.page.pageType === "product"
          ) {
            console.log("home");

            if ($(".youtube-video")[0]) {
              $(".youtube-video")[0].innerHTML = `
                              <div class="da-grid">
                                 <div class="da-grid-sizer"></div>
                                 ${temp_html}
                              </div>`;
            } else {
              document.getElementsByTagName("main")[0].innerHTML =
                document.getElementsByTagName("main")[0].innerHTML +
                `
                              <div class="da-grid">
                                 <div class="da-grid-sizer"></div>
                                 ${temp_html}
                              </div>`;
            }

            var $grid = $(".da-grid").masonry({
              itemSelector: ".da-grid-item",
              percentPosition: true,
              gutter: 5,
              columnWidth: ".da-grid-sizer",
            });

            // $(".da-grid").isotope({
            //   itemSelector: ".da-grid-item",

            //   masonry: {
            //     percentPosition: true,
            //     columnWidth: 10,
            //     horizontalOrder: true,
            //     // isFitWidth: true,
            //     resize: true,
            //     initLayout: true,
            //   },
            // });
          }
        },
      });
    }
  });
};

if (window.jQuery) {
  script2();
} else {
  script1();
}
