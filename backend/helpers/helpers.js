
const makeCronString = (date) => {
  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let cronString = `${seconds < 30 ? seconds + 30 : seconds - 30} ${
    seconds < 30 ? minutes : minutes + 1
  } ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} * `;
  return cronString;
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
};
