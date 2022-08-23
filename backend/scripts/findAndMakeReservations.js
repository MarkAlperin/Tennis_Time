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
    if (!resData.isScheduled && diffDays <= reservationWindowDays) {
      resData.cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
      resData.error = false;
      for (let courtNum = 0; courtNum < 2; courtNum++) {
        const logString = `${courtNum} ${resData.game} ${resData.humanTime[0]} at ${resData.humanTime[1]}`;
        console.log("RUNNING makeReservation() for: ", logString);
        makeReservation(resData, courtNum, twilioClient, Reservations, logString);
      }
    }
  }
};

module.exports = findAndMakeReservations;

// if (cluster.isMaster) {
//   const totalCPUs = require("os").cpus().length;
//   const numCourts = resData.courts.length;
//   const numClusters = numCourts > totalCPUs ? totalCPUs : numCourts;
//   console.log(`Creating ${numClusters} clusters`);
//   for (let i = 0; i < numClusters; i++) {
//     cluster.fork({ clusterInstance: i });
//   }
// } else {
//   console.log("Cluster instance: ", process.env.clusterInstance);
//   resData.court = resData.courts[process.env.clusterInstance];
// }
