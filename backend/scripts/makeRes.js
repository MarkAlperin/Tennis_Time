const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const makeReservation = async (res, courtNum) => {
  const dateStrings = res.humanTime[0].split("/");



  const url = "https://sites.onlinecourtreservations.com/savereservation"
  const body = `Reservation_Date=${dateStrings[0]}%2F${dateStrings[1]}%2F${dateStrings[2]}&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=${res.courts[courtNum]}&Start_Time=${res.time}&Duration=2&Extended_Desc=`
  const dody = "Reservation_Date=9%2F15%2F2022&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=24&Duration=2&Extended_Desc="
  const cookies = `device=PC; facility%5Fnum=${res.facility}; user%5Fid=randi%2Ehedberg; ${res.cookies.join(" ")}`;
  const dookies = "device=PC; facility%5Fnum=25; user%5Fid=randi%2Ehedberg; ASPSESSIONIDSGCRCQSC=MEPLFBHDJEELHBGAKCEKLHHL; ASPSESSIONIDCUBSBSQB=GCLNDNDAAHIGOEDOAEMDAMPL";
  const sookies = `${res.cookies.join(" ")}`;
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
    "cookie": `device=PC; facility%5Fnum=${res.facility}; user%5Fid=randi%2Ehedberg; ${res.cookies.join(" ")}`,
    "Referer": "https://sites.onlinecourtreservations.com/Reserve",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
  const options = {
    "headers": headers,
    "body": body,
    "method": "POST"
  };

  console.log(body);
  console.log(dody);
  console.log(body === dody)
  console.log(cookies);
  console.log(sookies);
  console.log(dookies);




  fetch("https://sites.onlinecourtreservations.com/savereservation", {
    "headers": {
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
      "cookie": sookies,
      "Referer": "https://sites.onlinecourtreservations.com/Reserve",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": body,
    "method": "POST"
  })
    .then(res => {
      console.log("RAN FETCH...");
    }).catch(err => {
      console.error("ERROR RUNNING FETCH: ", err);
    });
};

module.exports = makeReservation;
