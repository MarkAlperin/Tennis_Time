const makeCronString = (date, runNow) => {
  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let cronString;
  if (runNow) {
    cronString = `${seconds < 50 ? seconds + 10 : seconds - 50} ${
      seconds < 50 ? minutes : minutes + 1
    } ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} * `;
  } else {
    cronString = `${seconds < 30 ? seconds + 30 : seconds - 30} ${
      seconds < 30 ? minutes : minutes + 1
    } ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} * `;
  }
  return cronString;
};

const textUsers = (twilioClient, phoneNums, fromNum, body) => {
  Promise.all(
    phoneNums.map((phoneNum) => {
      console.log(phoneNum)
      return twilioClient.messages.create({
        to: phoneNum,
        from: fromNum,
        body: body,
      });
    })
)
  .then((messages) => {
    console.log("Messages sent!");
  })
  .catch((err) => console.error(err));
};

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

module.exports = {
  makeCronString,
  getMethods,
  months,
  textUsers,
};
