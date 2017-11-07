const d3 = require('d3');

const colourConfig = {
  "erc": {
    'line': '#eebd1c',
    'dots': '#eebd1c',
    'background': '#f6de8d',
  },
  "cs": {
    'line': '#de7302',
    'dots': '#de7302',
    'background': '#ebab67',
  },
  "psc":{
    'line': '#ff667f',
    'dots': '#ff667f',
    'background': '#ffa3b2',
  },
  "pdecat":{
    'line': '#000d80',
    'dots': '#000d80',
    'background': '#666db2',
  },
  "csqp":{
    'line': '#9966cc',
    'dots': '#9966cc',
    'background': '#ccb2e5',
  },
  "pp":{
    'line': '#4dc4ff',
    'dots': '#4dc4ff',
    'background': '#a6e1ff',
  },
  "cup":{
    'line': '#a6202b',
    'dots': '#a6202b',
    'background': '#c9797f',
  },
  "jxsi":{
    'line': '#5ab8a5',
    'dots': '#5ab8a5',
    'background': '#acdbd2',
  },
  "undecided":{
    'line': '#808080',
    'dots': '#808080',
    'background': '#cccccc'
  },
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
  if (name.toString().includes('pdecat')) {
    return `PDeCat`;
  } else if(name.toString().includes('undecided')){
    return `Undecided`;
  } else if(name.toString().includes('other')){
    return `Other`;
  }else if(name.toString() === 'cs'){
    return `Cs`;
  }
  return name.toUpperCase();
}

// box spacer
function spaceBoxes(yPositions, yPos){
  // forEach
  yPositions.map((yPos, i) => {
    let diff = yPositions[i+1] - yPos;
    if(diff < 16){
      let moveBy = 16 - diff;
      return yPos + 16;
    }
    return yPos; 
  })
};

module.exports = { colourSelector, nameCleaner };
