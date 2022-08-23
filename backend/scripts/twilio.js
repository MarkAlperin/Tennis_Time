const twilio = require("twilio");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log(process.env.TWILIO_ACCOUNT_SID);
console.log(process.env.TWILIO_AUTH_TOKEN);

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const resData = {
  game: "Pickleball",
  humanTime: ["Tuesday", "7:00pm"],
};


console.log("FOUND G POINTER, TEXTING USER VIA TWILIO...");
client.messages.create({
  body: `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}!`,
  from: process.env.TWILIO_FROM_NUMBER,
  to: process.env.TWILIO_TO_NUMBER,
})
.then((message) => console.log(message.sid));