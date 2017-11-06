const d3 = require('d3');

const colourConfig = {
  "erc": {
    'line': '#eebd1c',
    'dots': '#eebd1c',
  },
  "cs": {
    'line': '#de7302',
    'dots': '#de7302',
  },
  "psc":{
    'line': '#ff667f',
    'dots': '#ff667f',
  },
  "pdecat":{
    'line': '#000d80',
    'dots': '#000d80',
  },
  "csqp":{
    'line': '#9966cc',
    'dots': '#9966cc',
  },
  "pp":{
    'line': '#4dc4ff',
    'dots': '#4dc4ff',
  },
  "cup":{
    'line': '#a6202b',
    'dots': '#a6202b',
  },
  "jxsi":{
    'line': '#5ab8a5',
    'dots': '#5ab8a5',
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
