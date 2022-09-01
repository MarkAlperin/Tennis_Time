const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const sendFetchToServer = async (res, courtsIdx, cookieStr) => {

  const url = "https://sites.onlinecourtreservations.com/savereservation"
  const dateStrings = res.humanTime[0].split("/");
  const bodyStr = `Reservation_Date=${dateStrings[0]}%2F${dateStrings[1]}%2F${dateStrings[2]}&Reservation_Num=&LastBlock=${res.game === "Tennis" ? "44" : "46"}&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=${res.courts[courtsIdx]}&Start_Time=${res.time}&Duration=2&Extended_Desc=`;
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
    "cookie": cookieStr,
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
      console.log("FETCH COOKIES: ", cookieStr)
      return res;
    }).catch(err => {
      console.error("ERROR RUNNING FETCH: ", err);
    });
};

module.exports = sendFetchToServer;
