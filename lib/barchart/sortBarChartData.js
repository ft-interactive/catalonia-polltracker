
function getIndependenceData(averageData){

  const partiesProIndependence = ['erc', 'juntsxcat', 'cup'];
  const partiesAntiIndependence = ['pp', 'psc', 'cs'];
  const partiesAmbigIndependence = ['catcomu'];

  // get latest result, this should be the first one.
  const latest = averageData.shift();

  //sum up pro-independence vote
  const pro = collateParties(partiesProIndependence, latest);

  //sum up anti-independence vote
  const anti = collateParties(partiesAntiIndependence, latest);

  //sum up ambiguous vote
  const ambig = collateParties(partiesAmbigIndependence, latest);

  return { pro,
          anti,
          ambig }; // return array of objects
};

function collateParties(partyArr, result){
  return partyArr.reduce((acc,curr) => {
    let partyResult = { party: curr, vote: result.averages[curr]};
    acc.push(partyResult);
    return acc;
  }, []);
};


module.exports = {getIndependenceData};
