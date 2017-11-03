const d3 = require('d3');

function sortData(data) {

  const partyNames = [ "erc", "cs", "psc", "pdecat", "csqp", "pp", "cup", "catcomu", "icv",
    "mes", "jxsi", "other", "blank", "null", "willnotvote", "undecided", "noanswer", "non-specifiedother"];

  return data.reduce((acc, curr) => {
    let item = {};
    item.surveyPublished = cleanDate(curr.date);
    item.pollster = curr.pollster;
    item.parties = combineParties(curr);
    acc.push(item);
    return acc;
  }, []);

  function combineParties(poll) {
    const partyObj = partyNames.reduce((acc, curr) => {
      let partyName = curr;
      acc[partyName] = poll[curr];
      return acc;
    }, {});
    return partyObj;
  };

  function cleanDate(date){
    let dateString = new String(date);
    let splitDate = dateString.split("-").reverse().join(",");
    return Date.parse(splitDate);
  }
};

module.exports = {
  sortData
};
