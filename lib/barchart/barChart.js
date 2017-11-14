const d3 = require('d3');

function makeChart(){

  let xScale;
  let yScale;
  let chartHeight;
  let nameLabelOffset = 10;
  let proParties;
  let antiParties;
  let ambigParties;

  function bars(parent){

    const data = parent.datum();

    // add bars
    parent.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', 50)
      .attr('height', d => {
        let voteSum = Object.values(d).pop();
        return yScale(voteSum);
      })
      .attr('x', d => {
        let voteName = Object.keys(d).pop(); //name of category
        return xScale(voteName);
      })
      .attr('y', d => {
        let voteSum = Object.values(d).pop();
        return chartHeight - yScale(voteSum);
      });

      // add name & vote labels
      parent.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'name-label')
        .text( d => {
          let voteName = Object.keys(d).pop(); //name of category
          let voteAmount = Object.values(d).pop(); // vote value
          return `${voteName} ${voteAmount.toFixed(1)}%`;
        })
        .attr('y', d => {
          let voteAmount = Object.values(d).pop(); // vote value
          return yScale(voteAmount) - nameLabelOffset
        })
        .attr('x', d => {
          let voteName = Object.keys(d).pop(); //name of category
          return xScale(voteName);
        })

        // add composing party labels
        parent.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'party-label')
          .text( d => {
            let voteName = Object.keys(d).pop(); //name of category
            if(voteName === 'pro'){ return proParties }
            else if(voteName === 'anti'){
              return antiParties
            }
            else if(voteName === 'ambig'){
              return ambigParties;
            }
          })
          .attr('y', d => chartHeight + nameLabelOffset)
          .attr('x', d => {
            let voteName = Object.keys(d).pop(); //name of category
            return xScale(voteName);
          })

  }

  bars.setXScale = (x) => {
    xScale = x;
    return bars;
  }
  bars.setYScale = (x) => {
    yScale = x;
    return bars;
  }
  bars.setChartHeight = (x) =>{
    chartHeight = x;
    return bars;
  }
  bars.setProParties = (x) => {
    proParties = x;
    return bars;
  }
  bars.setAntiParties = (x) => {
    antiParties = x;
    return bars;
  }
  bars.setAmbigParties = (x) =>{
    ambigParties = x;
    return bars;
  }

  return bars;
};

module.exports = {makeChart};
