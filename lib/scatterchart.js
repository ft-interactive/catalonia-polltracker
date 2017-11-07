const d3 = require('d3');

function electionScatterChart(){
  let radius;
  let dotOpacity;
  let xScale;
  let yScale;
  let colourSelector;

  function chart(parent){
    const pollingData = parent.datum();

    parent.selectAll('g')
      .data(pollingData)
      .enter()
      .append('g')
      .attr('transform', (d,i) => {
        return `translate(${checkValidDate(d.surveyPublished) ? xScale(d.surveyPublished) : 0}, 0)`;
      });

    parent.selectAll('g')
      .call(function(pollGroup){
        pollGroup.selectAll('circle')
        .data(d=>{
          return Object.keys(d.parties).map(party => ({ party: party, result: d.parties[party]}))
        })
        .enter()
        .append('circle')
        .attr('r', d => checkValidResult(d.result) ? radius : 0)
        .attr('cy', d => checkValidResult(d.result) ? yScale(d.result) : 0)
        .attr('fill', d => colourSelector(d.party, "dots"))
        .attr('opacity', dotOpacity)
        .attr('stroke', "#fff1e5" )
        .attr('stroke-width', "0.3px")
      })

      function checkValidResult(result){
        return (typeof result === 'number') ? result : null;
      }
      function checkValidDate(date){
        return (typeof date !== 'undefined') ? date : null;
      }

  }
  chart.setRadius = (x) => {
    radius = x;
    return chart;
  }
  chart.setOpacity = (x) => {
    dotOpacity = x;
    return dotOpacity;
  }
  chart.setXScale = (x) => {
    xScale = x;
    return xScale;
  }
  chart.setYScale = (x) => {
    yScale = x;
    return yScale;
  }
  chart.setOpacity = (x) => {
    dotOpacity = x;
    return dotOpacity;
  }
  chart.setColourSelector = (x) =>{
    colourSelector = x;
    return chart;
  }

  return chart;
}

module.exports = {electionScatterChart};
