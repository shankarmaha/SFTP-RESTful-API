// index.js 

/**
 * Required External Modules
 */
const express = require("express");
const bodyParser = require("body-parser");

/**
 * App Variables
 */
const app = express();

/**
 * Routes Definitions
 */
var sftpClient = require("./Routes/sftpclient");
var index = require("./Routes/index");

/**
 * Server Activation
 */

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/sftpclient", sftpClient);

app.use("/", index);

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);
});
