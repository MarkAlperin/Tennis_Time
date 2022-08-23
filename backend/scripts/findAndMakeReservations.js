const makeReservation = require("../scripts/makeReservation");
const Reservations = require("../db/index.js");
const helpers = require("../helpers/helpers");

const findAndMakeReservations = async (options) => {
  console.log("findAndMakeReservations() RUNNING...", new Date());
  const { runNow } = options
  console.log("runNow: ", runNow);
  const reservations = await Reservations.find({}).sort({ date: -1 });

  for (let i = 0; i < reservations.length; i++) {
    const resData = reservations[i];
    console.log("length: ", reservations.length);
    const date = new Date();
    const diffTime = Math.abs(new Date(resData.date) - date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const reservationWindowDays = 14.509;
    console.log("diff <= reswindow: ", diffDays <= reservationWindowDays);
    if (!resData.isScheduled && diffDays <= reservationWindowDays) {

      resData.cronString = runNow ? helpers.makeCronString(date, runNow) : "0 0 14 * * *";
      resData.error = false;
      for (let courtNum = 0; courtNum < 2; courtNum++) {
        console.log("RUNNING makeReservation() for courtNum", courtNum);
        const result = await makeReservation(resData, courtNum);
        console.log("result: ",courtNum, result);
      }
      Reservations.findByIdAndUpdate(resData._id, {
        $set: { isScheduled: true },
      }).exec((err, data) => {
        if (!err) {
          console.log("UPDATED RESERVATION: ", data);
        } else {
          console.log("ERROR UPDATING RESERVATION: ", err);
        }
      });
    } else if (!resData.isRandi) {
      Reservations.findByIdAndDelete(resData._id).exec((err, data) => {
        if (!err) {
          console.log("DELETED RESERVATION: ", data);
        } else {
          console.log("ERROR DELETING RESERVATION: ", err);
        }
      });
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
