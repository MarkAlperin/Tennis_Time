#!/usr/bin/env node
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const path = require("path");
const sendFetchToServer = require("./sendFetchToServer");
const helpers = require("../helpers/helpers")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


let puppetAttempts = 0;

const makeReservation = async (
  resData,
  courtNum,
  twilioClient,
  Reservations,
  cronString,
  logString,
) => {
  const inPositionTime = performance.now();
  console.log("makeReservation() RUNNING...\n", logString);
  puppetAttempts++;

  // LAUNCH PAGE ***************************************************************
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(process.env.SET_LOCATION_URL).catch((e) => errorRetry(e));

  // PUPPETTER ERROR HANDLER ***************************************************
  const errorRetry = async (err) => {
    console.log("ERROR: Executing errorRety()...\n", logString);
    if (2 > puppetAttempts) {
      await browser.close();
      resData.error = true;
      makeReservation(resData);
    } else {
      console.error(err.message);
      console.log("Too many puppeteer errors. Exiting...\n", logString);
      if (twilioClient) {
        helpers.textUsers(twilioClient, [process.env.TWILIO_DEV_NUMBER], process.env.TWILIO_FROM_NUMBER, `Your ${logString} reservation has failed. ERROR: ${err.message.slice(0, 50)}`);
      }
      await browser.close();
    }
  };

  // SET LOCATION *************************************************************
  await page
    .select("select#facility_num", resData.facility)
    .catch((e) => errorRetry(e));
  await page.click("input#btnSubmit").catch((e) => errorRetry(e));

  // SIGNING IN  ****************************************************************
  await page.waitForSelector('a[href="SignIn"]').catch((e) => errorRetry(e));
  await page
    .$eval('a[href="SignIn"]', (el) => el.click())
    .catch((e) => errorRetry(e));
  await page.waitForSelector('input[id="user_id"]').catch((e) => errorRetry(e));
  console.log("Signing in...\n", process.env.USERNAME);
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
  await page.waitForTimeout(200).then(() => console.log("WAITED FOR 200ms\n"));
  await page
    .waitForSelector('a[class="ui-state-default"]')
    .catch((e) => errorRetry(e));
  let dates = await page
    .$$('a[class="ui-state-default"]', (date) => date)
    .catch((e) => errorRetry(e));
  const day = resData.day;
  const dayModifier = currentMonth === resData.month ? 2 : 1;

  // COLLECT COOKIES ********************************************************
  let cookies = await page.cookies();
  const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value};`).join(" ")

  // SCHEDULE CRON JOB ********************************************************
  console.log(`IN POSITION... TIME: ${Math.round(performance.now() - inPositionTime)}ms`);
  console.log("SCHEDULING CRON JOB...\n");

  if (resData.error) {
    const date = new Date();
    cronString = `${date.getSeconds() + 1} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} * `;
  }

  cron.schedule(cronString, async () => {
    const startTime = performance.now();
    await sendFetchToServer(resData, courtNum, cookieStr);
    console.log(`Inner CRON JOB RUNNING...`);
    console.log(`FETCH COMPLETE... Execution time:  ${Math.round(performance.now() - startTime)} ms\n`);

    // SELECT DAY ********************************************************
    await page.waitForTimeout(3000).then(() => dates[day - dayModifier].click().catch((e) => errorRetry(e)));

    // CONFIRM RESERVATION / SEND USER FEEDBACK / UPDATE DB ********************************************************
    console.log(`WAITING FOR SELECTOR... ${Math.round(performance.now() - startTime)} ms\n`);
    await page.waitForSelector('td[class="G pointer"]')
    .then(() => {
      console.log("FOUND G POINTER, TEXTING USER VIA TWILIO...\n", logString);
      if (twilioClient) {
        const phoneNums = [process.env.TWILIO_DEV_NUMBER, process.env.TWILIO_TO_NUMBER];
        const body = `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}! 🎾🎾🎾`;
        helpers.textUsers(twilioClient, phoneNums, process.env.TWILIO_FROM_NUMBER, body);
      } else {
        console.log("TWILIO CLIENT FAILED...\n");
      }
    Reservations.findByIdAndUpdate(resData._id, {
      $set: { isReserved: true, isAttempted: true },
      }).exec((err, data) => {
        if (!err) {
          console.log("UPDATED RESERVATION: ", data);
        } else {
          console.log("ERROR UPDATING RESERVATION: ", err);
        }
      });
    }).catch( async (e) => {
      console.error(e);
      console.log("ERROR: G POINTER NOT FOUND\n",  logString);

      Reservations.findByIdAndUpdate(resData._id, {
        $set: { isAttempted: true },
      }).exec((err, data) => {
        if (!err) {
          console.log("UPDATED FAILED RESERVATION: ", data);
        } else {
          console.log("ERROR UPDATING FAILED RESERVATION: ", err);
        }
      });

      // CLOSING BROWSER ********************************************************
      await browser.close();
      console.log(`Failed ${logString}, closing browser... Execution time:  ${Math.round(performance.now() - startTime)} ms\n`);
    });
    await browser.close();
    console.log(`Finished running makeReservation() num: ${courtNum}, Execution time:  ${Math.round(performance.now() - startTime)} ms\n`);
  })
};

module.exports = makeReservation;

      //     twilioClient.messages
      //     .create({
      //       body: `Your ${logString} reservation has failed. ERROR: ${err.message.slice(0, 50)}`,
      //       from: process.env.TWILIO_FROM_NUMBER,
      //       to: process.env.TWILIO_DEV_NUMBER,
      //     });
      // } else {
      //   console.log("TWILIO CLIENT FAILED...\n")

      //   twilioClient.messages.create({
      //   body: `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}! 🎾🎾🎾`,
      //   from: process.env.TWILIO_FROM_NUMBER,
      //   to: process.env.TWILIO_TO_NUMBER,
      // });