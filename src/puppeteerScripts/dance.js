// const describe = require('mocha').describe;
// var it = require('mocha').it;
const puppeteer = require("puppeteer");
// const expect = require("chai").expect;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// const userID = process.env.USER_ID;
// const password = process.env.PASSWORD;

// describe("Puppeteer Starting", () => {
const dancePuppet = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  // await page.setViewport({ width: 1440, height: 768 });
  await page.goto(process.env.SET_LOCATION_URL);

  // it("Select a tennis court", async () => {
  await page.select("select#facility_num", "25");

  await Promise.all([
    page.click("input#btnSubmit"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]).catch((e) => console.error(e));
  // });
  // const signInHref = await page.$eval('a[href="SignIn"]', el => el.href).catch(e => console.error(e));
  // console.log("href: ", signInHref);
  await page.waitForSelector('a[href="SignIn"]').catch((e) => console.error(e));
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.$eval('a[href="SignIn"]', (el) => el.click()),
    // page.click('a[href="SignIn"]')
    // page.goto(process.env.SIGN_IN_URL)
  ]);
  console.log(
    "Signing in ------------------------------------------------------------------------"
  );
  await page
    .waitForSelector('input[id="user_id"]')
    .catch((e) => console.error(e));

  await page.type('input[id="user_id"]', process.env.USERNAME);
  await page.type('input[id="password"]', process.env.PASSWORD);

  await Promise.all([
    page.click('input[id="CheckUser"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]).catch((e) => console.error(e));

  await page
    .waitForSelector('input[id="Reservation_Date"]')
    .catch((e) => console.error(e));
  console.log(
    "Setting date ------------------------------------------------------------------------"
  );
  let val = await page.$eval('input[id="Reservation_Date"]', (e) => {
    return e.value;
  });
  console.log("val: ", val);
  await page.focus('input[id="Reservation_Date"]');
  // await page.type('input[id="Reservation_Date"]', "7/31/2022");
  await page.click('img[class="ui-datepicker-trigger"]');
  await page.waitForSelector('a[class="ui-state-default"]');
  let dates = await page.$$('a[class="ui-state-default"]', date => date).catch((e) => console.error(e));
  console.log("dates: ", dates.length);

  // const hrefElement = await page.evaluateHandle(() => document.querySelector('a[class="ui-state-default"]'))
  // console.log("hrefElement: ", hrefElement.jsonValue());

  // // await hrefElement.click();
  // dates[10].click();

  // await browser.close();
};

dancePuppet();
// });
