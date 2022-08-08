const cluster = require("cluster");
const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let puppetAttempts = 0;
const dancePuppet = async (day, court, time) => {
  puppetAttempts++;
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto(process.env.SET_LOCATION_URL);

  await page.select("select#facility_num", "25");

  await page.click("input#btnSubmit")
  await page.waitForSelector('a[href="SignIn"]').catch((e) => console.error(e));


    page.$eval('a[href="SignIn"]', (el) => el.click())

  await page
    .waitForSelector('input[id="user_id"]')
    .catch((e) =>
      console.error(
        e.message,
        "USERNAME: ",
        process.env.USERNAME,
        "PASSWORD: ",
        process.env.PASSWORD
      )
    );

  await page.type('input[id="user_id"]', process.env.USERNAME);
  await page.type('input[id="password"]', process.env.PASSWORD);

  await Promise.all([
    page.click('input[id="CheckUser"]'),
    // page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]).catch((e) =>
    console.error(
      e.message,
      "USERNAME: ",
      process.env.USERNAME,
      "PASSWORD: ",
      process.env.PASSWORD
    )
  );

  await page.waitForSelector('input[id="Reservation_Date"]').catch((e) => {
    if (puppetAttempts < 3) {
      dancePuppet(day);
      console.error(
        e.message,
        "USERNAME: ",
        process.env.USERNAME,
        "PASSWORD: ",
        process.env.PASSWORD
      );
    }
  });
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
  let dates = await page
    .$$('a[class="ui-state-default"]', (date) => date)
    .catch((e) => console.error(e));

  // const hrefElement = await page.evaluateHandle(() => document.querySelector('a[class="ui-state-default"]'))
  // console.log("hrefElement: ", hrefElement.jsonValue());

  // // await hrefElement.click();

  // console.log("dates: ", dates);
  dates[day].click();


  await page
    .waitForSelector('td[class="open pointer"]')
    .catch((e) => console.error(e.message));
  await page.evaluate(({court, time}) => {
    this.Reserve(court, time);
  }, {court, time});




  await page.waitForSelector('select[id="Duration"]').catch((e) => console.error(e.message));
  await page.type('input[id="Extended_Desc"]', "I solemnly swear I am up to no good");
  // await page.evaluate(() => {
  //   const url = "https://sites.onlinecourtreservations.com/savereservation";
  //   const postData =
  //     "Reservation_Date=8%2F13%2F2022&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=15&Duration=1&Extended_Desc=";
  //     console.log(url);
  //   fetch(url, { method: "POST", body: postData })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // });
  await page.$eval('input[id="SaveReservation"]', e => e.click());

};
const day = 11

if (cluster.isMaster) {
  const totalCPUs = require("os").cpus().length;
  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork({ dateOffset: i });
  }
} else {
  console.log(process.env.dateOffset);
  const court = 1;

  dancePuppet(day + parseInt(process.env.dateOffset), "1", "14");
}
// dancePuppet();
// });   Court_Num=1&Start_Time=15&Reservation_Num=&Mode=New&Page=&From=Reservations&Event_Num=&Reservation_Date=8%2F13%2F2022

// A request was made: https://sites.onlinecourtreservations.com/savereservation
// The request's method is: POST
// The request's postData is: Reservation_Date=8%2F13%2F2022&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=15&Duration=1&Extended_Desc=
