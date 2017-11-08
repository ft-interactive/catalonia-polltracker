
function splitResultsByParty(averageData, allParties){
  const allResults = [];

  //Split results by party
  for (let party in allParties) {
    let holdingArray = [];
    let partyName = allParties[party];

    for (let poll in averageData) {
      let date = averageData[poll].date;
      let partyResult = averageData[poll].averages[partyName];
      if (partyResult !== 0 && partyResult !== NaN) {
        holdingArray.push({
          date: date,
          result: partyResult
        });
      }
    }
    const holdingArrayNumbers = holdingArray.filter(poll => !Number.isNaN(poll.result));

    let partyObject = {
      partyName,
      averageVote: holdingArrayNumbers
    };
    allResults.push(partyObject);
  }

  const missingParties = checkAllPartiesHaveData(allResults);
  if(missingParties.length > 0) {
    console.log(`MISSING DATA: these parties have no results -> ${missingParties.map(party => party.partyName)} the build will fail`);
  }
  //Sort parties into order by size of latest average result
  allResults.sort((a, b) => {
    let aLastResult = a.averageVote.slice(0)[0].result;
    let bLastResult = b.averageVote.slice(0)[0].result;
    return bLastResult - aLastResult;
  })

  return allResults;
}

function checkAllPartiesHaveData(allResults){
  return allResults.filter(party => {
    return party.averageVote.length === 0;
  })
};

module.exports = { splitResultsByParty };
