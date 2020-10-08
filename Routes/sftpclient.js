"use strict";
var express = require("express");
const Client = require("ssh2-sftp-client");

var router = express.Router();

const SftpFile = require("../Models/sftpFile");
const { route } = require(".");

const publicIp = require("public-ip");

/**
 * @swagger
 * tags:
 *   name: SftpFile
 *   description: Sftp Client Library
 */

/**
 * @swagger
 * path:
 *  /getFilesList:
 *    get:
 *      summary: Gets the file list for a given path
 *      tags: [SftpFile]
 *      parameters:
 *        - in: header
 *          name: RequestPath
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: SftpHost
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: UserName
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: Password
 *          schema:
 *            type: string
 *            required: true
 *      responses:
 *        "200":
 *          description: SftpFile object which contains the list of files
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SftpFile'
 */

router.get("/getFilesList", async function (req, res) {
  var requestPath = req.get("RequestPath");
  var sftpConfig = extractSftpConfig(req);
  var client = new Client();

  await client
    .connect(sftpConfig)
    .then(() => {
      return client.list(requestPath);
    })
    .then((data) => {
      var sftpFile = new SftpFile();
      sftpFile.fileList = data;
      sftpFile.status = "Success";
      res.json(sftpFile);
      client.end();
    })
    .catch((err) => {
      console.log(err.message);
      var sftpFile = new SftpFile();
      sftpFile.errorMessage = err.message;
      sftpFile.status = "Error";
      res.json(sftpFile);
    });
});

/**
 * @swagger
 * path:
 *  /getFile:
 *    get:
 *      summary: Retrieve the file contents for provided path and filename
 *      tags: [SftpFile]
 *      parameters:
 *        - in: header
 *          name: RequestPath
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: FileName
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: SftpHost
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: UserName
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: Password
 *          schema:
 *            type: string
 *            required: true
 *      responses:
 *        "200":
 *          description: SftpFile object which contains the file content
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SftpFile'
 */

router.get("/getFile", async function (req, res) {
  let client = new Client();
  var requestPath = req.get("RequestPath");
  var fileName = req.get("FileName");
  var sftpConfig = extractSftpConfig(req);

  await client
    .connect(sftpConfig)
    .then(() => {
      let remotePath = requestPath + "/" + fileName;
      return client.get(remotePath);
    })
    .then((buffer) => {
      var data = Buffer.from(buffer);
      var sftpFile = new SftpFile();
      sftpFile.fileContent = data.toString();
      res.json(sftpFile);
    })
    .catch((err) => {
      console.log(err.message);
      var sftpFile = new SftpFile();
      sftpFile.message = err.message;
      sftpFile.status = "Error";
      res.json(sftpFile);
    });
});

/**
 * @swagger
 * path:
 *  /createFile:
 *    post:
 *      summary: Create the file on the remote path
 *      tags: [SftpFile]
 *      parameters:
 *        - in: header
 *          name: RemotePath
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: SftpHost
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: UserName
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: Password
 *          schema:
 *            type: string
 *            required: true
 *      responses:
 *        "200":
 *          description: SftpFile object which contains the file content
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SftpFile'
 */

router.post("/createFile", async function (req, res) {
  let client = new Client();
  var data = req.body;
  var remotePath = req.get("RemotePath");
  var sftpConfig = extractSftpConfig(req);

  await client
    .connect(sftpConfig)
    .then(() => {
      return client.put(Buffer.from(data), remotePath);
    })
    .then(() => {
      return client.end();
    })
    .then(() => {
      var sftpFile = new SftpFile();
      sftpFile.message = "File created successfully";
      sftpFile.status = "Success";
      res.json(sftpFile);
    })
    .catch((err) => {
      console.log(err.message);
      var sftpFile = new SftpFile();
      sftpFile.message = err.message;
      sftpFile.status = "Error";
      res.json(sftpFile);
    });
});

/**
 * @swagger
 * path:
 *  /deleteFile:
 *    post:
 *      summary: Deletes the file using the path
 *      tags: [SftpFile]
 *      parameters:
 *        - in: header
 *          name: FilePath
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: SftpHost
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: UserName
 *          schema:
 *            type: string
 *            required: true
 *        - in: header
 *          name: Password
 *          schema:
 *            type: string
 *            required: true
 *      responses:
 *        "200":
 *          description: SftpFile object which contains the file content
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SftpFile'
 */

router.post("/deleteFile", async function (req, res) {
  let client = new Client();
  let filePath = req.get("FilePath");
  var sftpConfig = extractSftpConfig(req);

  await client
    .connect(sftpConfig)
    .then(() => {
      return client.delete(filePath);
    })
    .then(() => {
      return client.end();
    })
    .then(() => {
      var sftpFile = new SftpFile();
      sftpFile.message = "File deleted successfully";
      sftpFile.status = "Success";
      res.json(sftpFile);
    })
    .catch((err) => {
      var sftpFile = new SftpFile();
      sftpFile.errorMessage = err.message;
      sftpFile.status = "Error";
      res.json(sftpFile);
    });
});

function extractSftpConfig(req) {
  var sftpHost = req.get("SftpHost");
  var sftpUserName = req.get("UserName");
  var sftpPassword = req.get("Password");

  const sftpConfig = {
    host: sftpHost,
    username: sftpUserName,
    password: sftpPassword,
    port: 22,
    algorithms: {
      kex: [
        "diffie-hellman-group1-sha1",
        "ecdh-sha2-nistp256",
        "ecdh-sha2-nistp384",
        "ecdh-sha2-nistp521",
        "diffie-hellman-group-exchange-sha256",
        "diffie-hellman-group14-sha1",
      ],
      cipher: [
        "3des-cbc",
        "aes128-ctr",
        "aes192-ctr",
        "aes256-ctr",
        "aes128-gcm",
        "aes128-gcm@openssh.com",
        "aes256-gcm",
        "aes256-gcm@openssh.com",
      ],
      serverHostKey: [
        "ssh-rsa",
        "ecdsa-sha2-nistp256",
        "ecdsa-sha2-nistp384",
        "ecdsa-sha2-nistp521",
      ],
      hmac: ["hmac-sha2-256", "hmac-sha2-512", "hmac-sha1"],
    },
    debug: writeToConsole,
  };

  function writeToConsole(msg) {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    console.log(
      year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        " - " +
        msg
    );
  }

  return sftpConfig;
}

module.exports = router;
