#!/usr/bin/env node
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


let puppetAttempts = 0;

const makeReservation = async (resData, courtNum, twilioClient) => {
  const inPositionTime = performance.now();
  console.log("makeReservation() RUNNING...");
  puppetAttempts++;

  // LAUNCH PAGE ***************************************************************
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(process.env.SET_LOCATION_URL).catch((e) => errorRetry(e));

  // PUPPETTER ERROR HANDLER ***************************************************
  const errorRetry = async (err) => {
    console.log("ERROR: Executing errorRety()...");
    if (2 > puppetAttempts) {
      await browser.close();
      resData.error = true;
      makeReservation(resData);
    } else {
      console.error(err.message);
      console.log("Too many puppeteer errors. Exiting...");
      await browser.close();

    }
  };

  // SET LOCATION *************************************************************
  await page.select("select#facility_num", resData.facility).catch((e) => errorRetry(e));
  await page.click("input#btnSubmit").catch((e) => errorRetry(e));

  // SIGNING IN  ****************************************************************
  await page.waitForSelector('a[href="SignIn"]').catch((e) => errorRetry(e));
  await page
    .$eval('a[href="SignIn"]', (el) => el.click())
    .catch((e) => errorRetry(e));
  await page.waitForSelector('input[id="user_id"]').catch((e) => errorRetry(e));
  console.log("Signing in...", process.env.USERNAME);
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
  const day = resData.day;
  const dayModifier = currentMonth === resData.month ? 2 : 1;

  // SCHEDULE CRON JOB ********************************************************
  console.log("inPositionTime: ", Math.round(performance.now() - inPositionTime), " ms");
  console.log("SCHEDULING CRON JOB...", resData.cronString, new Date());

  if (resData.error) {
    const date = new Date();
    resData.cronString = `${date.getSeconds() + 1} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${(date.getMonth() + 1)} * `;
  }

  cron.schedule(resData.cronString, async () => {
    console.log("Inner CRON JOB RUNNING...");
    const startTime = performance.now();
    dates[day - dayModifier].click().catch((e) => errorRetry(e));
    await page
      .waitForSelector('td[class="open pointer"]')
      .catch((e) => errorRetry(e));

    const { time } = resData;
    const court = resData.courts[courtNum];
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
      .select('select[id="Duration"]', "2")
      .catch((e) => errorRetry(e));
    await page
      .type('input[id="Extended_Desc"]', "Tennis Time!")
      .catch((e) => errorRetry(e));
    await page
      .$eval('input[id="SaveReservation"]', (e) => e.click())
      .catch((e) => errorRetry(e));

    await page.waitForSelector('td[class="G pointer"]')
    console.log("FOUND G POINTER, TEXTING USER VIA TWILIO...");
    twilioClient.messages.create({
      body: `Your ${resData.game} reservation has been made for ${resData.humanTime[0]} at ${resData.humanTime[1]}!`,
      to: process.env.PHONE_NUMBER,
      from: process.env.TWILIO_NUMBER,
    })
    .then((message) => console.log(message.sid));

    await browser.close();
    console.log(`Finished running makeReservation() num: ${courtNum}, Execution time:  ${Math.round(performance.now() - startTime)} ms`);
    return true;
  });
};

module.exports =  makeReservation;
