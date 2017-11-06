const d3 = require('d3');

function electionLineChart() {

  let xScale;
  let yScale;
  let width;
  let colourSelector;
  let nameCleaner;
  let lineWidth = 2;

  function chart(parent) {
    const averageData = parent.datum();
    const allParties = Object.keys(averageData[0].averages);
    const allResults = [];

    //Split results by party
    for (let party in allParties) {
      let holdingArray = [];
      let partyName = allParties[party];

      for (let poll in averageData) {
        let date = averageData[poll].date;
        let partyResult = averageData[poll].averages[partyName];
        if (partyResult !== 0 && partyResult !== NaN) {
          holdingArray.push({
            date: date,
            result: partyResult
          });
        }
      }
      const holdingArrayNumbers = holdingArray.filter(poll => !Number.isNaN(poll.result));

      let partyObject = {
        partyName,
        averageVote: holdingArrayNumbers
      };
      allResults.push(partyObject);
    }

    //Sort parties into order by size of latest average result
    allResults.sort((a, b) => {
      let aLastResult = a.averageVote.slice(-1)[0].result;
      let bLastResult = b.averageVote.slice(-1)[0].result;
      return bLastResult - aLastResult;
    })

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.result));

    const lineChart = parent.append('g')
      .attr('class', 'linechart');

    const backgroundLineBox = lineChart.append('g')
      .attr('class', 'lines-background');

    const foregroundLineBox = lineChart.append('g')
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
    drawLines(foregroundLineBox);

    foregroundLineBox.selectAll('path')
      .attr('stroke-width', lineWidth)
      .attr('stroke', d => colourSelector(d.partyName));


    // Create and position labels and prevent label overlap
    const labelXPos = xScale(averageData.slice(-1)[0].date) + 5;

    let previousLabelPos = 0;
    Object.keys(allResults).forEach((partyKey, index, array) => {
      let latestResult = allResults[partyKey].averageVote.slice(-1)[0].result;
      let partyName = allResults[partyKey].partyName;
      let label = `${partyName} ${Math.round(latestResult)}%`;
      const labelPos = yScale(latestResult);
      console.log("YPos", labelPos);

      parent.select("g.linechart")
        .append('text')
        .attr('class', `label ${partyName}`)
        .attr("text-anchor", "start")
        .attr("x", labelXPos)
        .attr("y", d => {
          if (index === (array.length - 1)) return labelPos + 5; //pull smallest party result down
          else if (index === (array.length - 2)) return labelPos + 5; //pull 2nd smallest party result down
          else if (index === (array.length - 3)) return labelPos + 10; //pull 3rd smallest party result down
          else return Math.max(labelPos, (previousLabelPos + 20));
        })
        .append('tspan')
        .text("▋")
        .style('fill', d => colourSelector(partyName))
        .append('tspan')
        .text(label)
        .style('fill', 'rgb(102, 96, 92)')


        previousLabelPos = labelPos;
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
  return chart;
}

module.exports = {
  electionLineChart
};
