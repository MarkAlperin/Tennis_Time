const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sendFetchToServer = async (res, courtsIdx, cookieStr) => {

  const url = "https://sites.onlinecourtreservations.com/savereservation"
  const dateStrings = res.humanTime[0].split("/");
  const bodyStr = `Reservation_Date=${dateStrings[0]}%2F${dateStrings[1]}%2F${dateStrings[2]}&Reservation_Num=&LastBlock=${res.game === "Tennis" ? "44" : "46"}&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=${res.courts[courtsIdx]}&Start_Time=${res.time}&Duration=2&${res.game === "Tennis" ? "" : "Reservation_Type=G&"}Extended_Desc=Complements+of+Mark+%26%23128032%3B+and+Doobs+%26%23128044%3B`;
  const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": `device=PC; facility%5Fnum=${res.game === "Tennis" ? "25" : "88"}; user%5Fid=randi%2Ehedberg; ASPSESSIONIDQGBCDCRC=BDLOGCGBPKAAANHALFPCGDFB`,
    "Referer": "https://sites.onlinecourtreservations.com/Reserve",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
  const options = {
    "headers": headers,
    "body": bodyStr,
    "method": "POST"
  };

  fetch(url, options)
    .then(res => {
      console.log(`res: ${res}\n`)
    }).catch(err => {
      console.error("ERROR RUNNING FETCH: ", err);
    });
};

module.exports = sendFetchToServer;


// fetch("https://sites.onlinecourtreservations.com/savereservation", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "device=PC; facility%5Fnum=88; user%5Fid=randi%2Ehedberg; ASPSESSIONIDQGASDTSD=NHGDLOOCOCLKFJEPBKLNEGGC",
//     "Referer": "https://sites.onlinecourtreservations.com/Reserve",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "Reservation_Date=9%2F6%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=29&Duration=2&Reservation_Type=G&Extended_Desc=",
//   "method": "POST"
// });
fetch("https://sites.onlinecourtreservations.com/savereservation", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "device=PC; facility%5Fnum=88; user%5Fid=randi%2Ehedberg; ASPSESSIONIDQGBCDCRC=BDLOGCGBPKAAANHALFPCGDFB",
    "Referer": "https://sites.onlinecourtreservations.com/Reserve",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "Reservation_Date=9%2F23%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=27&Duration=2&Reservation_Type=G&Extended_Desc=",
  "method": "POST"
});