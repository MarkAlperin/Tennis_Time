#!/usr/bin/env node
const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const resData = {
  "_id": "631126bba4793f123d3577e6",
  "date": "2022-09-15T22:00:00.000Z",
  "__v": 0,
  "courts": [
      "1",
      "2"
  ],
  "day": 15,
  "facility": "88",
  "game": "Pickleball",
  "humanTime": [
      "9/15/2022",
      "5:00 PM"
  ],
  "isAttempted": true,
  "isReserved": true,
  "month": "september",
  "time": "35"
};

let puppetAttempts = 0;

const cancelReservation = async (
  // resData,
  courtNum = 0,
  // twilioClient,
  // Reservations,
  logString = '',
) => {
  puppetAttempts++;

  console.log("running")
  console.log("env? ", process.env.SET_LOCATION_URL);
  // LAUNCH PAGE ***************************************************************
  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  // PUPPETTER ERROR HANDLER ***************************************************
  const errorRetry = async (err) => {
    console.log("ERROR: Executing errorRety()...\n", logString);
    if (2 > puppetAttempts) {
      await browser.close();
      resData.error = true;
      cancelReservation(resData);
    } else {
      console.error(err.message);
      console.log("Too many puppeteer errors. Exiting...\n", logString);
      // if (twilioClient) {
        //     twilioClient.messages
        //     .create({
          //       body: `Your ${logString} reservation cancellation has failed. ERROR: ${err.message.slice(0, 50)}`,
          //       from: process.env.TWILIO_FROM_NUMBER,
          //       to: process.env.TWILIO_TO_NUMBER,
          //     });
          // } else {
            //   console.log("TWILIO CLIENT FAILED...\n")
            // }
            //await browser.close();
          }
        };

      await page.goto(process.env.SET_LOCATION_URL).catch((e) => errorRetry(e));
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



    // SELECT DAY ********************************************************
    await page.waitForTimeout(3000).then(() => dates[day - dayModifier].click().catch((e) => errorRetry(e)));

    // CANCEL RESERVATION ********************************************************
    await page.waitForSelector('td[class="G pointer"]')
    await page.click('td[class="G pointer"]');
    console.log("found g pointer")
    await page.waitForSelector('input[id="CancelReservation"]').then(() => console.log("found cancel res button"))
    await page.waitForTimeout(1000, () => console.log("waited 1000ms"))
    // await page.click('input[id="SaveReservation"]').then(() => console.log("clicked cancel res button"))

    page.on('dialog', async dialog => {
      //get alert message
      console.log(dialog.message());
      //accept alert
      await dialog.accept();
    })
    await page.click('input[id="CancelReservation"]').then(() => console.log("clicked cancel res button"))

    await page.waitForSelector('td[class="open pointer"]').then(() => console.log("confirmed open pointer"))
    // Reservations.findByIdAndUpdate(resData._id).exec((err, data) => {
    //     if (!err) {
    //       console.log("UPDATED RESERVATION: ", data);
    //     } else {
    //       console.log("ERROR UPDATING RESERVATION: ", err);
    //     }
    //   });




      // // CLOSING BROWSER ********************************************************
      // await browser.close();

   // await browser.close();


};
cancelReservation();

module.exports = cancelReservation;


// if (twilioClient) {
//   twilioClient.messages.create({
//   body: `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}! 🎾🎾🎾`,
//   from: process.env.TWILIO_FROM_NUMBER,
//   to: process.env.TWILIO_TO_NUMBER,
// });
// } else {
//   console.log("TWILIO CLIENT FAILED...\n");
// }
