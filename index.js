const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
const chartFrame = require('g-chartframe');

const bertha = require('bertha-client').default();


const sortData = require('./lib/sort-data.js').sortData;
const averageData = require('./lib/average-data.js').averageData;

const spreadsheetKey = '1k0Om8fwwSnxOolpkGGOjBHlffEeMvQwtVM6gQs_AfYE';

const data = await bertha.get(spreadsheetKey, [
   'data',
 ], { republish: true });

console.log("NEW DATA", data);
 
// const { colourSelector, nameCleaner } = require('./lib/helpers.js');
//
// const scatterChart = require('./lib/scatterchart.js').electionScatterChart;
// const lineChart = require('./lib/linechart.js').electionLineChart;
// const chartAxes = require('./lib/chart-axes.js').electionChartAxes;

// CHART CONFIG

const medChartConfig = {
	frameMaker: chartFrame.webFrameM,
	width: 700,
	height: 550,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: 25, top: 145, left: 30, right: 50},
	sourceSizing: {sourcePos: 20},
	title: 'German politics polltracker',
  radius: 2.5,
};
const smallChartConfig = {
	frameMaker: chartFrame.webFrameS,
	width: 300,
	height: 500,
	chartPadding: {bottom: 0, top: 0},
	chartMargin: {bottom: -30, top: 180, left: 20, right: 28},
	sourceSizing: {sourcePos: 25},
	title: 'German federal election |' + '2017: poll of polls',
  radius: 2,
};

// update start and finish dates every day
const dateLatest = new Date();
const currentYear = dateLatest.getFullYear();
const lastYear = currentYear - 1;
const dateEarliest = new Date(dateLatest).setFullYear(lastYear);

const monthsBetweenTicks = 3;
const yAxisMin = 0;
const yAxisMax = 45;
const dotOpacity = 1;
const timestamp = d3.timeFormat('%d-%m-%Y')(new Date());
const dir = './dist';
const s3Dir = 'http://ft-ig-content-prod.s3-website-eu-west-1.amazonaws.com/v2/ft-interactive/germany-2017-polltracker/master/';


// loadData(dataUrl).then(data => {
// 	const cleanData = prepareData(data);
// 	const chartM = makeChart(cleanData, medChartConfig);
// 	const chartS = makeChart(cleanData, smallChartConfig);
// 	writeChartToFile(chartM, 'medium');
// 	writeChartToFile(chartS, 'small');
//   writeHoldingPage(timestamp, dir);
// })
// .catch(err => console.error(`MAKING THE CHART FAILED ${err}`, err));


async function loadData(url) {
	return new Promise((res, rej) => {
		d3.json(url, data => res(data));
	});
}

function prepareData(data) {
	return sortData(data);
}

function makeChart(data, chartConfig) {
  // Create average data
	const lineData = averageData(data);

  // Get chart chartConfig
	const {frameMaker, width, height, chartPadding, chartMargin, titleSizing, sourceSizing, title, radius} = chartConfig;
	const dateLastPublished = d3.utcFormat('%H:%M, %b %d %Y')(Date.now() + 3600); //assume UK time is BST, one hour ahead of UTC

  // Set up the virtual dom
	const virtualConsole = new jsdom.VirtualConsole();
	virtualConsole.sendTo(console);

	const dom = new JSDOM(fs.readFileSync('scaffold.html'), {
		virtualConsole
	});

  // Get the thing we'll be drawing in
	const chartContainer = d3.select(dom.window.document.querySelector('body div.chart'));

  // Set up frame
	const frame = frameMaker({
		title,
		subtitle: 'Lines represent weighted averages |' +
      'Points represent polls | |' +
      'Voting intention, share by party (%)',
		source: `Source: Wahlrecht.de, updated ${dateLastPublished} |` +
      'Graphic: Anna Leach, © FT',
    margin: chartMargin
	});

  // Various amends to make the thing fit on the page
  frame.autoPosition(false);
	frame.sourceY(height - sourceSizing.sourcePos);
  frame.sourceLineHeight(18);

	const chartHeight = frame.dimension().height;
	const chartWidth = frame.dimension().width - chartMargin.left - chartMargin.right;

  // Add scales
	const xScale = d3.scaleLinear()
    .domain([dateEarliest, dateLatest])
    .range([0, chartWidth]);

	const yScale = d3.scaleLinear()
    .domain([yAxisMin, yAxisMax])
    .range([(chartHeight - chartPadding.bottom - chartPadding.top), 0]);


  // Set up svg
	chartContainer.select('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .call(frame);

  // Select chart plot and make the damn thing go down
	const plot = chartContainer.select('.chart-plot');

  // Create chart
	const pollScatterChart = scatterChart(plot);
	pollScatterChart.setRadius(radius);
	pollScatterChart.setXScale(xScale);
	pollScatterChart.setYScale(yScale);
	pollScatterChart.setOpacity(dotOpacity);
	pollScatterChart.setColourSelector(colourSelector);

  // Create axes
	const axes = chartAxes(plot);
	axes.setXScale(xScale);
	axes.setYScale(yScale);
	axes.setHeight(chartHeight);
	axes.setWidth(chartWidth);
	axes.setEarliestDate(dateEarliest);
	axes.setPadding(chartPadding);
	axes.setMonthsBetweenTicks(monthsBetweenTicks);

  // Create line Graph
	const averageLineChart = lineChart(plot);
	averageLineChart.setXScale(xScale);
	averageLineChart.setYScale(yScale);
	averageLineChart.setColourSelector(colourSelector);
	averageLineChart.setNameCleaner(nameCleaner);

  // Add all to frame
	frame.plot()
    .datum(data.filter(d => d['surveyPublished'] > dateEarliest))
    .call(pollScatterChart)
    .call(axes);

	frame.plot()
    .datum(lineData.filter(d => d.date > dateEarliest))
    .call(averageLineChart);

	return chartContainer;
}

function writeChartToFile(chartContainer, size) {
	const doctype = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;
	const markup = doctype + chartContainer.html().trim();

  // Save the resulting SVG
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(`${dir}/germany-2017-latest-${size}.svg`, markup);
	fs.writeFileSync(`${dir}/germany-2017-${timestamp}-${size}.svg`, markup);
}

function writeHoldingPage(timestamp, dir){
  const htmlStart = fs.readFileSync('display-page-start.html');
  const htmlEnd = `</body></html>`;
  const fileList = fs.readdirSync(dir).reverse().filter(file => !file.includes('index') );
  const pictureMarkup = fileList.map((file) => {
    return `<h2>${file.split('-').splice(2).join(" ")}</h2>
            <a href='${s3Dir}${file}'>${s3Dir}${file}</a>
            <object type='image/svg+xml' data='${file}' style="display:block">
            </object>`;
  })
  const markup = htmlStart + pictureMarkup + htmlEnd;

  fs.writeFileSync(`${dir}/index.html`, markup);
}
