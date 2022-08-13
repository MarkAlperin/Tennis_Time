
const formatCourtIndex = (courtStr) => {
  const courts = [
    "NL1",
    "NL2",
    "NL3",
    "NL4",
    "SL1",
    "SL2",
    "WS1",
    "WS2",
    "WS3",
    "WS4",
  ];
  if (courts.includes(courtStr)) {
    const courtIndex = courts.indexOf(courtStr) + 1;
    return courtIndex.toString();
  } else {
    return null;
  }
};

  const formatTimeIndex = (timeStr) => {
    const times = [
      "0630",
      "0700",
      "0730",
      "0800",
      "0830",
      "0900",
      "0930",
      "1000",
      "1030",
      "1100",
      "1130",
      "1200",
      "1230",
      "1300",
      "1330",
      "1400",
      "1430",
      "1500",
      "1530",
      "1600",
      "1630",
      "1700",
      "1730",
      "1800",
      "1830",
      "1900",
      "1930",
      "2000",
      "2030",
      "2100",
      "2130",
    ];
    if (times.includes(timeStr)) {
      const tableIndex = times.indexOf(timeStr) + 14;
      return tableIndex.toString();
    } else {
      return null;
    }
  };

  const getMethods = (obj) => {
    let properties = new Set();
    let currentObj = obj;
    do {
      Object.getOwnPropertyNames(currentObj).map((item) =>
        properties.add(item)
      );
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
  }, {})

  module.exports = {
    formatTimeIndex,
    formatCourtIndex,
    getMethods,
    months,
  };

