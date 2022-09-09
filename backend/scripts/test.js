const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const twilio = require("twilio");
const helpers = require("../helpers/helpers");
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log("RUNNING TWILIO TEST.JS...");
const body = "Is this working?";

const phoneNums = [process.env.TWILIO_TO_NUMBER, process.env.TWILIO_DEV_NUMBER];

helpers.textUsers(twilioClient, phoneNums, process.env.TWILIO_FROM_NUMBER, body);
