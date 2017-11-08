const chartFrame = require('g-chartframe');
const d3 = require('d3');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;

const { colourSelector, nameCleaner, boxSpacer } = require('../helpers.js');
const scatterChart = require('./scatterchart.js').electionScatterChart;
const lineChart = require('./linechart.js').electionLineChart;
const chartAxes = require('./chart-axes.js').electionChartAxes;

// POLLTRACKER CONFIG
const dateEarliest = new Date("27 June 2017");
const dateLatest = new Date("1 Jan 2018");
const yAxisMin = 0;
const yAxisMax = 33;
const timestamp = Date.now();
const dotOpacity = 0.7;
const monthsBetweenTicks = 1;


function makePolltracker(data, lineData, chartConfig) {

  const {frameMaker, width, height, chartPadding, chartMargin, titleSizing, sourceSizing, title, radius} = chartConfig;
	const dateLastPublished = d3.utcFormat('%H:%M, %b %d %Y')(Date.now() + 3600); //assume UK time is BST, one hour ahead of UTC

  // Set up the virtual dom
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.sendTo(console);

  const dom = new JSDOM(fs.readFileSync('scaffold.html'), {virtualConsole});

  // Get the thing we'll be drawing in
  const chartContainer = d3.select(dom.window.document.querySelector('body div.chart'));

  // Set up frame
  const frame = frameMaker({
    title,
    subtitle: 'Lines represent weighted averages |' +
    'Points represent polls | |' +
    'Voting intention, share by party (%)',
    source: `Source: Various polls, updated ${dateLastPublished} |` +
    `Graphic: Anna Leach, © FT |` +
    `*After 7th Nov, Catcomu results include Podem results`,
    margin: chartMargin
  });

  // Various amends to make the thing fit on the page
  frame.autoPosition(false);
  frame.sourceY(height - sourceSizing.sourcePos);
  frame.sourceLineHeight(18);

  const chartHeight = frame.dimension().height;
  const chartWidth = frame.dimension().width - chartMargin.left - chartMargin.right;
  const timestamp = Date.now();

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
  averageLineChart.setBoxSpacer(boxSpacer);

  // Add all to frame
	frame.plot()
    .datum(data.filter(d => {
      return d['surveyPublished'] > dateEarliest;
    }))
    .call(pollScatterChart)
    .call(axes);

	frame.plot()
    .datum(lineData.filter(d => d.date > dateEarliest))
    .call(averageLineChart);

	return chartContainer;

}

module.exports = { makePolltracker };
