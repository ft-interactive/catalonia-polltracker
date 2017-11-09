const d3 = require('d3');

const colourConfig = {
  "erc": {
    'line': '#eebd1c',
    'dots': '#eebd1c',
    'background': '#FFE6C1',
  },
  "cs": {
    'line': '#de7302',
    'dots': '#de7302',
    'background': '#FED7BB',
  },
  "psc":{
    'line': '#ff667f',
    'dots': '#ff667f',
    'background': '#FFBBC5',
  },
  "pdecat":{
    'line': '#000d80',
    'dots': '#000d80',
    'background': '#92AED3',
  },
  "catcomu":{
    'line': '#9966cc',
    'dots': '#9966cc',
    'background': '#CEB5E3',
  },
  "pp":{
    'line': '#4dc4ff',
    'dots': '#4dc4ff',
    'background': '#C0EDFD',
  },
  "cup":{
    'line': '#a6202b',
    'dots': '#a6202b',
    'background': '#DC9095',
  },
  "jxsi":{
    'line': '#5ab8a5',
    'dots': '#5ab8a5',
    'background': '#A3DCD2',
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
  } else if(name.toString().includes('catcomu')){
    return `CatComu*`;
  } else if(name.toString().includes('other')){
    return `Other`;
  }else if(name.toString() === 'cs'){
    return `Cs`;
  }
  return name.toUpperCase();
}

// box spacer
function boxSpacer(yPositions, yPos){
  yPositions.map((yPos, i) => {
    let diff = yPositions[i+1] - yPos;
    if(diff < 16){
      let moveBy = 16 - diff;
      if(i < yPositions.length / 2){ //move lower half down
        return yPos + moveBy;
      }
      else if(i > yPositions.length / 2){ //move upper half up
        return yPos - moveBy;
      }
    }
    return yPos; 
  })
};

module.exports = { colourSelector, nameCleaner, boxSpacer };
