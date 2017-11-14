const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
const bertha = require('bertha-client');
const chartFrame = require('g-chartframe');

const {sortData} = require('./lib/sort-data.js');
const {averageData} = require('./lib/average-data.js');
const { writeChartToFile, writeHoldingPage } = require('./lib/write-files.js');
const {makePolltracker} = require('./lib/polltracker/index.js');
const {makeBarchart} = require('./lib/barchart/index.js');

// Catalan data comes from Bertha sheet
const spreadsheetKey = '1k0Om8fwwSnxOolpkGGOjBHlffEeMvQwtVM6gQs_AfYE';
const partyNames = [ "erc", "cs", "psc", "pdecat", "catcomu", "pp", "cup"]; // these parties must all be findable in the dataset & have at least some results data, if they are null, the app breaks
const timestamp = d3.timeFormat('%d-%m-%Y')(new Date());

// CHART CONFIG POLLTRACKER
const medChartConfig = {
	frameMaker: chartFrame.webFrameM,
	width: 700,
	height: 650,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -70, top: 145, left: 30, right: 50},
	sourceSizing: {sourcePos: 40},
	title: 'Catalonia polltracker',
  radius: 5,
};
const smallChartConfig = {
	frameMaker: chartFrame.webFrameS,
	width: 300,
	height: 600,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -110, top: 170, left: 20, right: 28},
	sourceSizing: {sourcePos: 45},
	title: 'Catalonia polltracker',
  radius: 3,
};


// CHART CONFIG BARCHART
const medChartConfigBar = {
	frameMaker: chartFrame.webFrameM,
	width: 700,
	height: 650,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -70, top: 145, left: 30, right: 50},
	sourceSizing: {sourcePos: 40},
	title: 'Catalonia independence vote'
};
const smallChartConfigBar = {
	frameMaker: chartFrame.webFrameS,
	width: 300,
	height: 600,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -110, top: 170, left: 20, right: 28},
	sourceSizing: {sourcePos: 45},
	title: 'Catalonia independence vote'
};

loadData().then(data =>{
  const sortedData = sortData(data.data, partyNames);
  const averagedData = averageData(sortedData);

  const chartM = makePolltracker(sortedData, averagedData, medChartConfig);
  const chartS = makePolltracker(sortedData, averagedData, smallChartConfig);

  const barM = makeBarchart(averagedData, medChartConfigBar);
  const barS = makeBarchart(averagedData, smallChartConfigBar);

  writeChartToFile(chartM, 'medium');
  writeChartToFile(chartS, 'small');
  writeChartToFile(barM, 'bar-medium');
  writeChartToFile(barS, 'bar-small');

  writeHoldingPage(timestamp);
}).catch(err => console.error(`MAKING THE CHART FAILED: => `, err));

async function loadData(){
  return bertha.get(spreadsheetKey, ['data'], { republish: true });
};
