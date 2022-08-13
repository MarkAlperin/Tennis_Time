const express = require("express");
const cron = require("node-cron");

const makeReservation = require("../puppeteerScripts/makeReservation");

const date = new Date();
let cronStartString = `${date.getSeconds() + 2} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${(date.getMonth() + 1)} * `;
let cronString = `${date.getSeconds() + 12} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${(date.getMonth() + 1)} * `;
const reservationData = {
  month: "august",
  day: "24",
  year: "2022",
  time: "0830",
  court: "NL4",
  facility: "25",
  duration: "2",
  cronString: cronString,
  error: false,
};

console.log(cronStartString);
cron.schedule(cronStartString, () => {
  console.log("running Make Reservation");
  console.log(makeReservation)
  makeReservation(reservationData);

});
// const cluster = require("cluster");
// if (cluster.isMaster) {
//   //const totalCPUs = require("os").cpus().length;
//   for (let i = 0; i < 1; i++) {
//     cluster.fork({ dateOffset: i });
//   }
// } else {
//   console.log(process.env.dateOffset);
//   const date = { month: "august", day: "11", year: "2022" };
//   //   + parseInt(process.env.dateOffset),
//   makeReservation(date, "2", "0630", "2");
// }
