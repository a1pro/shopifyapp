require("dotenv").config();

var fs = require("fs"),
  path = require("path"),
  filePath = path.join(__dirname, "script.js");

const scriptTag = (ctx) => {
  const shop = ctx.query.shop;
  let data = fs.readFileSync(filePath, { encoding: "utf-8" });
  data = data.replace("<%baseurl%>", process.env.HOST);

  ctx.res.writeHead(200, { "Content-Type": "text/javascript" });
  ctx.res.write(data);
  ctx.res.end();
};
module.exports = { scriptTag };
