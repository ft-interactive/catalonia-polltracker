const d3 = require('d3');

const colourConfig = {
  "CDU": {
    'line': '#000000',
    'dots': '#cccccc',
  },
  "SPD": {
    'line': '#b80000',
    'dots': '#e9b1b1',
  },
  "FDP":{
    'line': '#f5bb00',
    'dots': '#ffde78',
  },
  "LINKE":{
    'line': '#73008a',
    'dots': '#e4cfe9',
  },
  "AfD":{
    'line': '#52c0ff',
    'dots': '#bee7ff',
  },
  "GRÜNE":{
    'line': '#00aa5b',
    'dots': '#b7e0b7',
  }
}

function colourSelector(name, use="line"){
  const allParties = Object.keys(colourConfig);
  const matchedParties = allParties.filter(party => name.toString().includes(party));
  if (matchedParties.length < 1) return 'gray';
  const party = matchedParties.pop();
  return colourConfig[party][use];
}

// Name cleaner
function nameCleaner(name) {
  if (name.toString().includes('CDU')) {
    return `CDU`;
  } else if (name.toString().includes('GRÜNE')) {
    return `Grüne`;
  } else if (name.toString().includes('LINKE')) {
    return `Linke`;
  }
  return name;
}


module.exports = { colourSelector, nameCleaner };
