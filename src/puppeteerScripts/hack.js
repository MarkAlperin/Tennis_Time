const axios = require('axios');


const url = "https://sites.onlinecourtreservations.com/savereservation";
const postData = "Reservation_Date=8%2F13%2F2022&Reservation_Num=&LastBlock=44&Mode=New&From=Reservations&Player_1=RANDI.HEDBERG&Court_Num=1&Start_Time=15&Duration=1&Extended_Desc=";

const parsedData = {
  "Reservation_Date": "8-13-2022",
  "Reservation_Num": "",
  "Mode": "New",
  "From": "Reservations",
  "Player_1": "RANDI.HEDBERG",
  "Court_Num": "1",
  "Start_Time": "15",
  "Duration": "1",
  "Extended_Desc": "Brought to you by Mark and Doobs"
}

const options = {
  method: 'POST',
  // data: parsedData,
}

const willItBlend = `${url}?${postData}`;
axios.post(willItBlend, options).then(res => {
  console.log(res);
})
.catch(err => {
  console.log(err.message);
})
