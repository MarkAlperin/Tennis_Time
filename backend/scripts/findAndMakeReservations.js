const cron = require("node-cron");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const twilio = require("twilio");
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const makeReservation = require("../scripts/makeReservation");
const Reservations = require("../db/index.js");
const helpers = require("../helpers/helpers");

const findAndMakeReservations = async (options) => {
  console.log("findAndMakeReservations() RUNNING...");
  const { runNow } = options
  console.log("runNow: ", runNow);
  const reservations = await Reservations.find({}).sort({ date: -1 });

  for (let i = 0; i < reservations.length; i++) {
    const resData = reservations[i];
    const date = new Date();
    const diffTime = Math.abs(new Date(resData.date) - date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const reservationWindowDays = 14.509;

    if (!resData.isAttempted && !resData.isReserved && diffDays <= reservationWindowDays) {
      let cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
      resData.error = false;
      console.log("resData: ", resData);
      for (let courtNum = 0; courtNum < 1; courtNum++) {

        const logString = `${courtNum} ${resData.game} ${resData.humanTime[0]} at ${resData.humanTime[1]}`;
        console.log("RUNNING makeReservation() for: ", logString, "\n");
        makeReservation(resData, courtNum, twilioClient, Reservations, cronString, logString);
      }
      cron.schedule("0 2 14 * * *", async () => {
        let resCheck = await Reservations.findById(resData._id);
        if (!resCheck.isReserved) {
          twilioClient.messages.create({
            body: `Your ${resData.game} reservation for ${resData.humanTime[0]} at ${resData.humanTime[1]} unsuccessful... ☹️`,
            from: process.env.TWILIO_FROM_NUMBER,
            to: process.env.TWILIO_TO_NUMBER,
          });
        }
      });
    } else if (new Date(resData.date) - date < 0) {
      Reservations.findByIdAndDelete(resData._id);
    }
  }
};

module.exports = findAndMakeReservations;
