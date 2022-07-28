const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../.env")});


console.log('Starting setLocation...');
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(process.env.SET_LOCATION_URL);

  await page.select('select#facility_num', '25');
  await Promise.all([
    page.waitForNavigation(),
    page.click('input#btnSubmit')
  ]).catch(e => console.error(e));

  // const signInHref = await page.$eval('a.SignIn', el => el.href);
  // console.log("href: ", signInHref);
  await Promise.all([
    page.waitForNavigation(),
    page.$eval('a.SignIn', el => el.click())
  ]);
  // await browser.close();
})();
