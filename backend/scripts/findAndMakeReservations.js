const makeReservation = require("../scripts/makeReservation");
const Reservations = require("../db/index.js");

const findAndMakeReservations = async () => {
  console.log("findAndMakeReservations() running...");
  const reservations = await Reservations.find({}).sort({ date: -1 });

  for (let i = 0; i < reservations.length; i++) {
    const resData = reservations[i];
    const date = new Date();
    const resDate = new Date(resData.date);
    const diffTime = Math.abs(resDate - date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const reservationWindowDays = 14.509;
    if (diffDays <= reservationWindowDays) {
      // let seconds = date.getSeconds();
      // let minutes = date.getMinutes();
      // let cronString = `${seconds < 50 ? seconds + 10 : seconds - 50} ${
      //   seconds < 50 ? minutes : minutes + 1
      // } ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} * `;
      // resData.cronString = cronString;
      resData.cronString = "0 0 9 * * *";
      resData.error = false;
      for (let courtNum = 0; courtNum < resData.courts.length; courtNum++) {
        makeReservation(resData, courtNum)
      }
        Reservations.findOneAndDelete({ date: resData.date }).exec(
          (err, data) => {
            if (!err) {
              console.log("DELETED RESERVATION: ", data);
            } else {
              console.log("error deleting reservation");
            }
          }
        );
      // resData.court = resData.courts[0];
      // makeReservation(resData);
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

