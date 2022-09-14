const cron = require("node-cron");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const twilio = require("twilio");
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const DB = require("../db/index.js");
const scrapeCookies = require("./scrapeCookies")
const sendFetchToServer = require("./sendFetchToServer");
const confirmRes = require("./confirmRes");
const helpers = require("../helpers/helpers");

const findAndMakeRes = async (options) => {
  let cookieStr;
  const date = new Date();
  const { runNow } = options
  console.log("findAndMakeReservations() RUNNING...");

  const reservations = await DB.reservations.find({}).sort({ date: -1 });
  const impendingReservations = reservations.filter(res => (!res.isReserved && helpers.confirmWindow(res, date)))
  const expiredReservations = reservations.filter(res => new Date(res.date) - date < 0)
  console.log("impREs: ", impendingReservations)

  for (const res of expiredReservations) {
    await DB.reservations.findByIdAndDelete(res._id);
  }

  if (impendingReservations.length) {
    cookieStr = await scrapeCookies(impendingReservations[0], twilioClient)
    console.log("Retrieved cookies: ", cookieStr);
  }

  for (let i = 0; i < impendingReservations.length; i++) {
    const resData = impendingReservations[i];

    let cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
    resData.error = false;

    for (let courtNum = 0; courtNum < 1; courtNum++) {
      const logString = `${courtNum} ${resData.game} ${resData.humanTime[0]} at ${resData.humanTime[1]}`;
      console.log("Making reservation for: ", logString, "\n");

      cron.schedule(cronString, async () => {

        sendFetchToServer(resData, courtNum, cookieStr);

        const phoneNums = [process.env.TWILIO_TO_NUMBER, process.env.TWILIO_DEV_NUMBER];
        let body = `Your ${resData.game} reservation for ${resData.humanTime[0]} at ${resData.humanTime[1]} has been requested. Awaiting confirmation...`;
        helpers.textUsers(twilioClient, phoneNums, process.env.TWILIO_FROM_NUMBER, body);

        console.log("RUNNING confirmRes()")
        const isConfirmed = await confirmRes(resData, twilioClient, DB.reservations, logString);
        console.log("isConfirmed: ", isConfirmed);

        DB.reservations.findByIdAndUpdate(resData._id, {
          $set: { isAttempted: true, isReserved: isConfirmed ? true : false },
          }).exec((err, data) => {
            if (!err) {
              console.log("UPDATED RESERVATION: ", data);
            } else {
              console.log("ERROR UPDATING RESERVATION: ", err);
            }
          });

          body = isConfirmed ? `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}! 🎾🎾🎾` :
                  cookieStr ? `Your ${resData.game} reservation for ${resData.humanTime[0]} at ${resData.humanTime[1]} could not be confirmed. Please check manually 🧐` :
                  `Your ${resData.game} reservation for ${resData.humanTime[0]} at ${resData.humanTime[1]} was unsuccessful... 🙁`;
          helpers.textUsers(twilioClient, phoneNums, process.env.TWILIO_FROM_NUMBER, body);
      });
    }
  }
};

module.exports = findAndMakeRes;