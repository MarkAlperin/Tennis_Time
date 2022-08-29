const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const makeReservation = async (res) => {
  const dateStrings = res.humanTime[0].split("/");
  console.log("reservation: ", res)
  const body = `Reservation_Date=${dateStrings[0]}%2F${dateStrings[1]}%2F${dateStrings[2]}&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=${res.time}&Duration=2&Reservation_Type=G&Extended_Desc=${res.desc ? res.desc : ""}`
  const dody = "Reservation_Date=8%2F30%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=31&Duration=2&Reservation_Type=G&Extended_Desc=";

  console.log("body: ", body);
  console.log("dody: ", dody);

  console.log ("body === dody: ", body === dody);

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
    "cookie": `device=PC; facility%5Fnum=${res.facility}; user%5Fid=randi%2Ehedberg`,
    "Referer": "https://sites.onlinecourtreservations.com/Reserve",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": body,
  "method": "POST"
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
};

module.exports = makeReservation;



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
//     "cookie": "ASPSESSIONIDSEDQBSTC=KDODJJNBIJJFBALLNBAMDFJP; device=PC; facility%5Fnum=88; user%5Fid=randi%2Ehedberg",
//     "Referer": "https://sites.onlinecourtreservations.com/Reserve",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "Reservation_Date=8%2F30%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=31&Duration=2&Reservation_Type=G&Extended_Desc=",
//   "method": "POST"
// });
// Reservation_Date=8%2F30%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=27&Duration=2&Reservation_Type=G&Extended_Desc=
// Reservation_Date=8%2F30%2F2022&Reservation_Num=&LastBlock=46&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=31&Duration=2&Reservation_Type=G&Extended_Desc=