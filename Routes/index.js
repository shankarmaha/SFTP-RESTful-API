"use strict";
var express = require("express");

var router = express.Router();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "A node.js SFTP library",
      version: "1.0.0",
      description:
        "SFTP library that can be used to connect to a remote SFTP and execute the operations",
      contact: {
        name: "Shankar Chandrasekar",
        url: "https://www.clearchannelinternational.com",
        email: "shankar.chandrasekar@clearchannelint.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/sftpclient",
      },
    ],
  },
  apis: ["./Models/sftpFile.js", "./Routes/sftpclient.js"],
};


const specs = swaggerJsdoc(options);
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports = router;
