const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:5000", // Replace with the actual backend URL
      ws: true,
    })
  );
};
