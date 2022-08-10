#!/usr/bin/env node
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const helpers = require("../helpers/helpers");

let puppetAttempts = 0;

const makeReservation = async (resData) => {
  const startTime = performance.now();
  puppetAttempts++;

  // LAUNCH PAGE ***************************************************************
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(process.env.SET_LOCATION_URL).catch((e) => errorRetry(e));

  // PUPPETTER ERROR HANDLER ***************************************************
  const errorRetry = async (err) => {
    console.log("ERROR: Executing errorRety()...");
    if (2 > puppetAttempts) {
      await browser.close();
      await makeReservation(resData);
    } else {
      console.error(err.message);
      console.log("Too many puppeteer errors. Exiting...");
    }
  };

  // SET LOCATION *************************************************************
  await page.select("select#facility_num", "25").catch((e) => errorRetry(e));
  await page.click("input#btnSubmit").catch((e) => errorRetry(e));

  // SIGNING IN  ****************************************************************
  await page.waitForSelector('a[href="SignIn"]').catch((e) => errorRetry(e));
  await page
    .$eval('a[href="SignIn"]', (el) => el.click())
    .catch((e) => errorRetry(e));
  await page.waitForSelector('input[id="user_id"]').catch((e) => errorRetry(e));
  console.log("Signing in...", process.env.USERNAME, process.env.PASSWORD);
  await page
    .type('input[id="user_id"]', process.env.USERNAME)
    .catch((e) => errorRetry(e));
  await page
    .type('input[id="password"]', process.env.PASSWORD)
    .catch((e) => errorRetry(e));
  await page.click('input[id="CheckUser"]').catch((e) => errorRetry(e));

  // SELECT DATE *************************************************************
  await page
    .waitForSelector('img[class="ui-datepicker-trigger"]')
    .catch((e) => errorRetry(e));
  await page
    .click('img[class="ui-datepicker-trigger"]')
    .catch((e) => errorRetry(e));
  await page.waitForSelector('span[class="ui-datepicker-month"]');
  let currentMonth = await page.$eval(
    'span[class="ui-datepicker-month"]',
    (el) => el.innerText.toLowerCase()
  );
  if (currentMonth !== resData.month) {
    await page
      .click('span[class="ui-icon ui-icon-circle-triangle-e"]')
      .catch((e) => errorRetry(e));
  }
  await page.waitForTimeout(200).then(() => console.log("WAITED FOR 200ms"));
  await page
    .waitForSelector('a[class="ui-state-default"]')
    .catch((e) => errorRetry(e));
  let dates = await page
    .$$('a[class="ui-state-default"]', (date) => date)
    .catch((e) => errorRetry(e));
  const day = Number(resData.day);
  const dayModifier = currentMonth === resData.month ? 2 : 1;
  dates[day - dayModifier].click().catch((e) => errorRetry(e));
  await page
    .waitForSelector('td[class="open pointer"]')
    .catch((e) => errorRetry(e));

  const court = helpers.formatCourtIndex(resData.court);
  const time = helpers.formatTimeIndex(resData.time);
  await page
    .evaluate(
      ({ court, time }) => {
        this.Reserve(court, time);
      },
      { court, time }
    )
    .catch((e) => errorRetry(e));

  await page
    .waitForSelector('select[id="Duration"]')
    .catch((e) => errorRetry(e));
  await page
    .select('select[id="Duration"]', resData.duration)
    .catch((e) => errorRetry(e));
  await page
    .type('input[id="Extended_Desc"]', "Tennis Time!")
    .catch((e) => errorRetry(e));
  await page
    .$eval('input[id="SaveReservation"]', (e) => e.click())
    .catch((e) => errorRetry(e));
  //await browser.close();

  console.log("Execution time: " + Math.round(performance.now() - startTime) + "ms");
};

const reservationData = {
  month: "august",
  day: "24",
  year: "2022",
  time: "0830",
  court: "NL4",
  duration: "2",
};
makeReservation(reservationData);

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
