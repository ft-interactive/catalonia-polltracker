const d3 = require('d3');
const { splitResultsByParty } = require('./clean-line-data.js');

function electionLineChart() {

  let xScale;
  let yScale;
  let width;
  let colourSelector;
  let nameCleaner;
  let lineWidth = 2;
  let boxHeight = 22;
  let boxWidth = 95;
  let boxSpacer;

  function chart(parent) {
    const averageData = parent.datum();
    const allParties = Object.keys(averageData[0].averages);
    const allResults = splitResultsByParty(averageData, allParties);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.result));

    const lineChart = parent.append('g')
      .attr('class', 'linechart');

    const lineContainer = lineChart.append('g')
      .attr('class', 'lines-colour')

    //Draw line function
    const drawLines = function(element) {
      element
        .call((pollGroup) => {
          pollGroup.selectAll('path')
            .data(allResults)
            .enter()
            .append('path')
            .attr("d", d => line(d.averageVote))
            .attr('stroke-linecap', "round")
            .attr('stroke-linejoin', "round")
            .attr('fill', 'none')
        })
    }
    drawLines(lineContainer);

    lineContainer.selectAll('path')
      .attr('stroke-width', lineWidth)
      .attr('stroke', d => colourSelector(d.partyName));

    // DOES THIS WORK ???
    // let yPosArray = Object.keys(allResults).map((result) => {
    //   let lastResult = allResults[result].averageVote.slice(0)[0].result;
    //   return yScale(lastResult);
    // });
    //
    // let yPosSpaced = boxSpacer(yPosArray);
    //
    // console.log('Y POS', yPosArray);
    // console.log('Y POS SPACED', yPosSpaced);




    // Create and position labels and prevent label overlap
    const labelXPos = xScale(averageData.slice(0)[0].date) + 8;
    let previousLabelPos = 0;

    Object.keys(allResults).forEach((partyKey, index, array) => {
      let latestResult = allResults[partyKey].averageVote.slice(0)[0].result;
      let partyName = allResults[partyKey].partyName;
      let label = `${Math.round(latestResult)}% ${nameCleaner(partyName)}`;
      const labelPos = yScale(latestResult);

      parent.select("g.linechart")
        .append('rect')
        .attr("x", labelXPos)
        .attr("y", d => setYLabelPos() - 17)
        .attr('class', `label ${partyName}`)
        .attr("height", boxHeight)
        .attr("width", boxWidth)
        .attr("rx", 5)
        .attr("ry", 5)
        .style('fill', d => colourSelector(partyName, 'background'))
        .attr('stroke', colourSelector(partyName))
        .attr('stroke-width', 2)

      parent.select("g.linechart").append('text')
        .attr("x", labelXPos + 5)
        .attr("y", d => setYLabelPos())
        .attr("text-anchor", "start")
        .text(label);

        previousLabelPos = labelPos;

        function setYLabelPos(){
          if (index === (array.length - 1)) return labelPos + 25; //pull smallest party result down
          else if (index === (array.length - 2)) return labelPos + 35; //pull 2nd smallest party result down
          else if (index === (array.length - 3)) return labelPos + 20; //pull 3rd smallest party result down
          else return Math.max(labelPos, (previousLabelPos + 20));
        }

      })
    };

  chart.setYScale = (x) => {
    yScale = x;
    return chart;
  }
  chart.setXScale = (x) => {
    xScale = x;
    return chart;
  }
  chart.setWidth = (x) => {
    width = x;
    return chart;
  }
  chart.setColourSelector = (x) => {
    colourSelector = x;
    return chart;
  }
  chart.setNameCleaner = (x) => {
    nameCleaner = x;
    return chart;
  }
  chart.setBoxSpacer = (x) => {
    boxSpacer = x;
    return chart;
  }
  return chart;
}

module.exports = {
  electionLineChart
};
