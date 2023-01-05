import axios from "axios";
var host = null;

import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

if (typeof window !== "undefined") {
  host = window.location.hostname;
}

var baseUrl = "https://" + host + "/api/";

var tempURL = "http://localhost:8080/api/";

var url = host && host.includes("localhost") ? tempURL : baseUrl;

const BaseService = axios.create({
  baseURL: url,
});

if (typeof window !== undefined) {
  BaseService.interceptors.request.use(function (config) {
    const app = createApp({
      apiKey: API_KEY,
      shopOrigin: window.shop,
      host: window.host,
    });

    return getSessionToken(app) // requires an App Bridge instance
      .then((token) => {
        // append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });
}

export default BaseService;
