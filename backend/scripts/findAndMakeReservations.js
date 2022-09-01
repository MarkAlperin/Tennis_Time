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
    if (!resData.isAttempted && diffDays <= reservationWindowDays) {
      resData.cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
      resData.error = false;
      console.log("resDAta: ", resData);
      for (let courtNum = 0; courtNum < 1; courtNum++) {
        const logString = `${courtNum} ${resData.game} ${resData.humanTime[0]} at ${resData.humanTime[1]}`;
        console.log("RUNNING makeReservation() for: ", logString);
        // makeReservation(resData, courtNum, twilioClient, Reservations, logString);
        makeReservation(resData, courtNum);
      }

      // Reservations.findByIdAndUpdate(resData._id, {
      //   $set: { isScheduled: true },
      // }).exec((err, data) => {
      //   if (!err) {
      //     console.log("UPDATED RESERVATION: ", data);
      //   } else {
      //     console.log("ERROR UPDATING RESERVATION: ", err);
      //   }
      // });
    // } else if (!resData.isRandi) {
    //   Reservations.findByIdAndDelete(resData._id).exec((err, data) => {
    //     if (!err) {
    //       console.log("DELETED RESERVATION: ", data);
    //     } else {
    //       console.log("ERROR DELETING RESERVATION: ", err);
    //     }
    //   });

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


    }
  }
};

module.exports = findAndMakeReservations;

// fetch("https://sites.onlinecourtreservations.com/savereservation", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "ASPSESSIONIDSGCRCQSC=POELFBHDJMNCDCPCODENDLBB; device=PC; facility%5Fnum=25; user%5Fid=randi%2Ehedberg",
//     "Referer": "https://sites.onlinecourtreservations.com/Reserve",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "Reservation_Date=9%2F14%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=0&Start_Time=27&Duration=2&Extended_Desc="
//   "body": "Reservation_Date=9%2F14%2F2022&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=27&Duration=2&Extended_Desc=",
//   "method": "POST"
// });