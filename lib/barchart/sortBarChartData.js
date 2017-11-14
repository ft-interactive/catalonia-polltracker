
function getIndependenceData(averageData){

  const partiesProIndependence = ['erc', 'pdecat', 'cup'];
  const partiesAntiIndependence = ['pp', 'psc', 'cs'];
  const partiesAmbigIndependence = ['catcomu'];

  // get latest result, this should be the first one.
  const latest = averageData.shift();

  //sum up pro-independence vote
  const pro = sumParties(partiesProIndependence, latest);

  //sum up anti-independence vote
  const anti = sumParties(partiesAntiIndependence, latest);

  //sum up ambiguous vote
  const ambig = sumParties(partiesAmbigIndependence, latest);

  return [{pro}, {anti}, {ambig}]; // return array of objects
};

function sumParties(partyArr, result){
  return partyArr.reduce((acc,curr) => {
    return acc += result.averages[curr];
  }, 0);
};


module.exports = {getIndependenceData};
