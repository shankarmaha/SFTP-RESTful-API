"use strict";

class SftpFile {
  constructor() {
    this.fileContent = "";
    this.fileList = [];
    this.status = "";
    this.errorMessage = "";
    this.message = "";
  }
}

module.exports = SftpFile;

/**
 * @swagger
 *    definitions:
 *      SftpFile:
 *        type: object
 *        required:
 *          - fileContent
 *          - fileList
 *          - status
 *          - errorMessage
 *          - message
 *        properties:
 *          fileContent:
 *            type: string
 *          fileList:
 *            type: array
 *          status:
 *            type: string
 *          errorMessage:
 *            type: string
 *          message:
 *            type: string
 *        example:
 *           fileContent: "Test message"
 *           fileList: []
 *           status: "Success"
 *           errorMessage: ""
 *           message: ""
 *
 */
