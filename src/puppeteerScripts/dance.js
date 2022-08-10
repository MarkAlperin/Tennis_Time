#!/usr/bin/env node
const cluster = require("cluster");
const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let puppetAttempts = 0;
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
].reduce((memo, month, indx) => {
  let daysIndx = indx;
  if (indx > 6) {
    daysIndx++;
  }

  const monthData = {
    name: month,
    index: indx,
    days: !(daysIndx % 2) ? 31 : 30,
  };
  if (month === "february") monthData.days = 28;
  memo[month] = monthData;
  memo[indx] = monthData;
  return memo;
}, {});

const dancePuppet = async (date, court, time) => {
  puppetAttempts++;

  // LAUNCH PAGE *************************************************************
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const errorRetry = async (err) => {
    console.log("IN ERROR RETRY DUUUUUUUUUDEEEE!");
    if (2 > puppetAttempts) {
      await browser.close();
      await dancePuppet(date, court, time);
    } else {
      console.error(err.message);
      console.log("TOO MANY NO MORE");
    }
  };
  const page = await browser.newPage();
  await page.goto(process.env.SET_LOCATION_URL)//.catch((e) => errorRetry(e));

  // SET LOCATION *************************************************************
  await page.select("select#facility_num", "25")//.catch((e) => errorRetry(e));
  await page.click("input#btnSubmit")//.catch((e) => errorRetry(e));

  // SIGNING IN  ****************************************************************
  await page.waitForSelector('a[href="SignIn"]')//.catch((e) => errorRetry(e));
  await page
    .$eval('a[href="SignIn"]', (el) => el.click())
    //.catch((e) => errorRetry(e));
  await page.waitForSelector('input[id="user_id"]')//.catch((e) => errorRetry(e));
  await page
    .type('input[id="user_id"]', process.env.USERNAME)
   // .catch((e) => errorRetry(e));
  await page
    .type('input[id="password"]', process.env.PASSWORD)
    .catch((e) => errorRetry(e));
  await page.click('input[id="CheckUser"]')//.catch((e) => errorRetry(e));

  // SELECT DATE *************************************************************
  await page
    .waitForSelector('img[class="ui-datepicker-trigger"]')
    //.catch((e) => errorRetry(e));
  // await page.focus('input[id="Reservation_Date"]')//.catch((e) => errorRetry(e));
  await page
    .click('img[class="ui-datepicker-trigger"]')
   // .catch((e) => errorRetry(e));


  await page.waitForSelector('span[class="ui-datepicker-month"]')
  let currentMonth = await page.$eval('span[class="ui-datepicker-month"]', (el) => el.innerText.toLowerCase());
  if (currentMonth !== date.month) {
    console.log("ADVANCING MONTH");
      await page.click('span[class="ui-icon ui-icon-circle-triangle-e"]')//.catch((e) => errorRetry(e));
  }

  await page.waitForTimeout(200).then(() => console.log("WAITED FOR .2 SECOND"));


  await page
    .waitForSelector('a[class="ui-state-default"]')
   // .catch((e) => errorRetry(e));
  let dates = await page
    .$$('a[class="ui-state-default"]', (date) => date)
  //  .catch((e) => errorRetry(e));

  const day = Number(date.day);
  const dayModifier = currentMonth === date.month ? 2 : 1;
  dates[day - dayModifier].click()


  // CONFIRM DATE *************************************************************
  let dateArray = await page
    .$eval("tr tbody td p b", (e) => {
      return e.innerText.toLowerCase().replace(/,/g, "").split(" ");
    })
    //.catch((e) => errorRetry(e));

  // console.log(months)


  await page
    .waitForSelector('td[class="open pointer"]')
    //.catch((e) => errorRetry(e));
  await page
    .evaluate(
      ({ court, time }) => {
        this.Reserve(court, time);
      },
      { court, time }
    )
    //.catch((e) => errorRetry(e));

  await page
    .waitForSelector('select[id="Duration"]')
   // .catch((e) => errorRetry(e));
  await page
    .type('input[id="Extended_Desc"]', "I solemnly swear I am up to no good");
   // .catch((e) => errorRetry(e));
  // await page.$eval('input[id="SaveReservation"]', (e) => e.click());
  //await browser.close();
};


if (cluster.isMaster) {
  const totalCPUs = require("os").cpus().length;
  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork({ dateOffset: i });
  }
} else {
  console.log(process.env.dateOffset);

  for (let i = 0; i <= 31; i++) {}
  const date = { month: "september", day: "11", year: "2022" };
  //   + parseInt(process.env.dateOffset),
  dancePuppet(date, "2", "14");
}







const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};
