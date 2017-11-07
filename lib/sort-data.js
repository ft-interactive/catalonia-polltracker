const d3 = require('d3');

function sortData(data, listOfParties) {

  const partyNames = listOfParties;

  const formattedData = data.reduce((acc, curr) => {
    let item = {};
    item.surveyPublished = cleanDate(curr.date);
    item.pollster = curr.pollster;
    item.parties = combineParties(curr, partyNames);
    acc.push(item);
    return acc;
  }, []);

  const orderedData = orderByDate(formattedData);
  return orderedData;
};

function combineParties(poll, partyNames) {
  const partyObj = partyNames.reduce((acc, curr) => {
    let partyName = curr.toLowerCase();
    acc[partyName] = poll[curr];
    return acc;
  }, {});
  return partyObj;
};

function cleanDate(date){
  let dateString = new String(date);
  let splitDate = dateString.split("-").reverse().join(",");
  return Date.parse(splitDate);
};

function orderByDate(allPolls){
  return allPolls.sort((a,b) => {
    return b.surveyPublished - a.surveyPublished;
  })
};

module.exports = {
  sortData
};
