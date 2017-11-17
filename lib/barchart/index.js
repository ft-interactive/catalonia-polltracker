const fs = require('fs');
const chartFrame = require('g-chartframe');
const d3 = require('d3');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;

const { colourSelector, nameCleaner, boxSpacer } = require('../helpers.js');
const { makeChart } = require('./barChart');
const {getIndependenceData} = require('./sortBarChartData');

const {proParties, antiParties, ambigParties} = require('./partyList');

function makeBarchart(data, chartConfig){

  const {frameMaker, width, height, chartPadding, chartMargin, sourceSizing, title, barWidth} = chartConfig;

	const dateLastPublished = d3.utcFormat('%H:%M, %b %d %Y')(Date.now()); //assume UK time is one hour ahead of UTC

  // Set up the virtual dom
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.sendTo(console);
  const dom = new JSDOM(fs.readFileSync('scaffold.html'), {virtualConsole});

  // Get the thing we'll be drawing in
  const chartContainer = d3.select(dom.window.document.querySelector('body div.chart'));

  // Set up frame
  const frame = frameMaker({
    title,
    subtitle: `Combined vote of parties for & against |` +
    `According to latest poll average`,
    source: `Source: Various polls, updated ${dateLastPublished} |` +
    `Graphic: Anna Leach, © FT |` +
    `*Catcomu results include Podem results`,
    margin: chartMargin
  });

  // Various amends to make the thing fit on the page
  frame.autoPosition(false);
  frame.sourceY(height - sourceSizing.sourcePos);
  frame.sourceLineHeight(18);

  const chartHeight = frame.dimension().height - chartMargin.top - chartMargin.bottom;
  const chartWidth = frame.dimension().width - chartMargin.left - chartMargin.right;
  const timestamp = Date.now();

  // call the frame function on the svg box in the page
  chartContainer.select('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .call(frame);

    const plot = chartContainer.select('.chart-plot');

    const barData = getIndependenceData(data);

    const categories = Object.keys(barData);

    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 55])
      .range([0, chartHeight]);

    const barChart = makeChart(plot);
    barChart.setXScale(xScale);
    barChart.setYScale(yScale);
    barChart.setChartHeight(chartHeight);
    barChart.setBarWidth(barWidth);
    barChart.setNameCleaner(nameCleaner);

    // draw a plot on the frame, add the data & add the chart
    frame.plot()
    .datum(barData)
    .call(barChart);

    return chartContainer;

}

module.exports = {makeBarchart};
