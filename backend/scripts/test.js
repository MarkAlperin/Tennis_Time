const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const twilio = require("twilio");
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log("RUNNING TWILIO TEST.JS...");
const body = "Is this working?";

const phoneNums = [process.env.TWILIO_TO_NUMBER, process.env.TWILIO_DEV_NUMBER];
Promise.all(
  phoneNums.map((phoneNum) => {
    return twilioClient.messages.create({
      to: phoneNum,
      from: process.env.TWILIO_FROM_NUMBER,
      body: body,
    });
  })
)
  .then((messages) => {
    console.log("Messages sent!");
  })
  .catch((err) => console.error(err));
