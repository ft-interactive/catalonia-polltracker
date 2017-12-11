const d3 = require('d3');

const colourConfig = {
  "erc": {
    'line': '#eebd1c',
    'dots': '#eebd1c',
    'background': '#FFE6C1',
    'bar': '#eebd1c'
  },
  "cs": {
    'line': '#de7302',
    'dots': '#de7302',
    'background': '#FED7BB',
    'bar': '#bf7a02'
  },
  "psc":{
    'line': '#ff667f',
    'dots': '#ff667f',
    'background': '#FFBBC5',
    'bar': '#ff667f'
  },
  "juntsxcat":{
    'line': '#000d80',
    'dots': '#000d80',
    'background': '#92AED3',
    'bar': '#000d80'
  },
  "catcomu":{
    'line': '#9966cc',
    'dots': '#9966cc',
    'background': '#CEB5E3',
    'bar': '#9966cc'
  },
  "pp":{
    'line': '#4dc4ff',
    'dots': '#4dc4ff',
    'background': '#C0EDFD',
    'bar': '#4dc4ff'
  },
  "cup":{
    'line': '#a6202b',
    'dots': '#a6202b',
    'background': '#DC9095',
    'bar': '#a6202b'
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
  if (name.toString().includes('juntsxcat')) {
    return `JuntsXCat`;
  } else if(name.toString().includes('undecided')){
    return `Undecided`;
  } else if(name.toString().includes('catcomu')){
    return `CatComu*`;
  } else if(name.toString().includes('other')){
    return `Other`;
  } else if(name.toString() === 'cs'){
    return `Cs`;
  } else if(name.toString() === 'pro'){
    return `Separatist`;
  } else if(name.toString() === 'anti'){
    return `Unionist`;
  } else if(name.toString() === 'ambig'){
    return `Non-aligned`;
  }
  return name.toUpperCase();
}

module.exports = { colourSelector, nameCleaner};
