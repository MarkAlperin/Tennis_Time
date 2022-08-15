

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

  const formatTimeIndex = (time) => {
    const times = [
      "630",
      "70",
      "730",
      "80",
      "830",
      "90",
      "930",
      "100",
      "1030",
      "110",
      "1130",
      "120",
      "1230",
      "130",
      "1330",
      "140",
      "1430",
      "150",
      "1530",
      "160",
      "1630",
      "170",
      "1730",
      "180",
      "1830",
      "190",
      "1930",
      "200",
      "2030",
      "210",
      "2130",
    ];
    const timeStr = `${time.getHours()}${time.getMinutes()}`;
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
  }, {});

  module.exports = {
    formatTimeIndex,
    formatCourtIndex,
    getMethods,
    months,
  };

