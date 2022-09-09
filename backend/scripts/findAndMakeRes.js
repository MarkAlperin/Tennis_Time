const cron = require("node-cron");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const twilio = require("twilio");
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const confirmRes = require("./confirmRes");
const scrapeCookies = require("./scrapeCookies")
const DB = require("../db/index.js");
const helpers = require("../helpers/helpers");
const sendFetchToServer = require("./sendFetchToServer");

const findAndMakeRes = async (options) => {
  let cookieStr;
  const date = new Date();
  const { runNow } = options
  console.log("findAndMakeReservations() RUNNING...");

  const reservations = await DB.reservations.find({}).sort({ date: -1 });
  const impendingReservations = reservations.filter(res => (!res.isReserved && (helpers.confirmWindow(res, date))))
  const expiredReservations = reservations.filter(res => new Date(res.date) - date < 0)

  console.log("reservations: ", reservations);
  console.log("impending: ", impendingReservations)
  console.log("expired: ", expiredReservations)

  // for (const res in expiredReservations) {
  //   DB.reservations.findByIdAndDelete(res._id);
  // }

  if (impendingReservations.length) {
    cookieStr = await scrapeCookies(impendingReservations[0], twilioClient)
    console.log('RETURNED COOKIES: ', cookieStr)
  }


  for (let i = 0; i < impendingReservations.length; i++) {
    const resData = impendingReservations[i];

      let cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
      resData.error = false;
      console.log("resData: ", resData);
      for (let courtNum = 0; courtNum < 1; courtNum++) {
        const logString = `${courtNum} ${resData.game} ${resData.humanTime[0]} at ${resData.humanTime[1]}`;
        console.log("RUNNING makeReservation() for: ", logString, "\n");

        console.log("cronstring: ", cronString)
        cron.schedule(cronString, async () => {

          //sendFetchToServer(resData, courtNum, cookieStr);

          // Reservations.findByIdAndUpdate(resData._id, {
          //   $set: { isAttempted: true },
          //   }).exec((err, data) => {
          //     if (!err) {
          //       console.log("UPDATED RESERVATION isAttempted: ", data);
          //     } else {
          //       console.log("ERROR UPDATING RESERVATION: ", err);
          //     }
          //   });

            const phoneNums = [process.env.TWILIO_TO_NUMBER, process.env.TWILIO_DEV_NUMBER];
            const body = `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]} as been requested. Awaiting confirmation...`;
            helpers.textUsers(twilioClient, phoneNums, process.env.TWILIO_FROM_NUMBER, body);
        });

          //confirmRes(resData, courtNum, twilioClient, Reservations, cronString, logString);
      }


  }
};

module.exports = findAndMakeRes;