#!/usr/bin/env node
const puppeteer = require("puppeteer");
const path = require("path");
const helpers = require("../helpers/helpers")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


let puppetAttempts = 0;

const scrapeCookies = async (resData, twilioClient) => {
  console.log("scrapeCookies() RUNNING...");
  puppetAttempts++;

  // LAUNCH PAGE ***************************************************************
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  // SET PAGE TIMEOUT VALUES ***************************************************
  const timeoutValue = 1000 * 60 * 2;
  page.setDefaultNavigationTimeout(timeoutValue);
  page.setDefaultTimeout(timeoutValue);


  // PUPPETTER ERROR HANDLER ***************************************************
  const errorRetry = async (err) => {
    console.log("ERROR: Executing errorRety()...\n");
    if (2 > puppetAttempts) {
      await browser.close();
      resData.error = true;
      scrapeCookies(resData);
    } else {
      console.error(err.message);
      console.log("Too many puppeteer errors. Exiting...\n");
      if (twilioClient) {
        console.log("TEXTING TWILIO DEV...")
        helpers.textUsers(twilioClient, [process.env.TWILIO_DEV_NUMBER], process.env.TWILIO_FROM_NUMBER, `scrapeCookies has failed. ERROR: ${err.message.slice(0, 50)}`);
      }
      await browser.close();
    }
  };

  // SET LOCATION *************************************************************
  await page.goto(process.env.SET_LOCATION_URL).catch((e) => errorRetry(e));
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

    let cookies = await page.cookies();
    const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value};`).join(" ")

  // CLOSING BROWSER ********************************************************
      await browser.close();
      return cookieStr;
};

module.exports = scrapeCookies;
