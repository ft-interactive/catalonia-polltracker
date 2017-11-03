const d3 = require('d3');

const colourConfig = {
  "erc": {
    'line': '#F3B600',
    'dots': '#F3B600',
  },
  "cs": {
    'line': '#F27E2C',
    'dots': '#F27E2C',
  },
  "psc":{
    'line': '#E3626C',
    'dots': '#E3626C',
  },
  "pdecat":{
    'line': '#141C63',
    'dots': '#141C63',
  },
  "csqp":{
    'line': '#81557F',
    'dots': '#81557F',
  },
  "pp":{
    'line': '#6591E8',
    'dots': '#6591E8',
  },
  "cup":{
    'line': '#BF0010',
    'dots': '#BF0010',
  },
  "jxsi":{
    'line': '#5AB8A5',
    'dots': '#5AB8A5',
  },
  // "undecided":{
  //   'line': '#000000',
  //   'dots': '#000000',
  // },
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
