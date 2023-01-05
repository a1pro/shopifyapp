const axios = require("axios");

const url = (shop) => {
  return `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
};

const GET_API = (url, accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await axios({
        url,
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
        responseType: "json",
      });

      resolve(answer);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

const POST_API = (url, accessToken, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await axios({
        url,
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/graphql",
        },
        responseType: "json",
        data,
      });

      resolve(answer.data);
    } catch (error) {
      console.log("error in post api of GraphQl------", error);
      reject(error.data);
    }
  });
};

const POST_API_REST = (url, accessToken, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await axios({
        url,
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
        responseType: "json",
        data,
      });

      resolve(answer.data);
    } catch (error) {
      console.log("error in post api of REST------", error.response.data);
      reject(error);
    }
  });
};

const DELETE_API = (url, accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await axios({
        method: "DELETE",
        url,
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/graphql",
        },
        responseType: "json",
      });
      resolve(answer.data);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

const PUT_API = (url, accessToken, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await axios({
        method: "PUT",
        url,
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
        responseType: "json",
        data: updatedData,
      });
      console.log("answer ---", answer.data);
      resolve(answer.data);
    } catch (error) {
      console.log("error", error.response.data);
      reject(error);
    }
  });
};

module.exports = {
  GET_API,
  POST_API,
  DELETE_API,
  PUT_API,
  url,
  POST_API_REST,
};
