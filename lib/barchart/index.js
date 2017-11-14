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

const proParties = ['erc', 'pdecat', 'cup'];
const antiParties = ['pp', 'psc', 'cs'];
const ambigParties = ['catcomu'];


function makeBarchart(data, chartConfig){

  const {frameMaker, width, height, chartPadding, chartMargin, sourceSizing, title} = chartConfig;

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
    subtitle: `Combined vote of parties according according to their position |` +
    `on Catalonian independence. According to latest poll average`,
    source: `Source: Various polls, updated ${dateLastPublished} |` +
    `Graphic: Anna Leach, © FT |`,
    margin: chartMargin
  });

  // Various amends to make the thing fit on the page
  frame.autoPosition(false);
  frame.sourceY(height - sourceSizing.sourcePos);
  frame.sourceLineHeight(18);

  const chartHeight = frame.dimension().height;
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
    const categories = barData.map(bar => Object.keys(bar).pop());
    const values = barData.map(bar => Object.values(bar).pop());

    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(values)])
      .range([0, chartHeight]);

    const barChart = makeChart(plot);
    barChart.setXScale(xScale);
    barChart.setYScale(yScale);
    barChart.setChartHeight(chartHeight);
    barChart.setAmbigParties(ambigParties);
    barChart.setProParties(proParties);
    barChart.setAntiParties(antiParties);

    // draw a plot on the frame, add the data & add the chart
  frame.plot()
    .datum(barData)
    .call(barChart);

    return chartContainer;

}

module.exports = {makeBarchart};
