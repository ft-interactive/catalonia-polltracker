const d3 = require('d3');

const {proParties, antiParties, ambigParties} = require('./partyList');

function makeChart(){

  let xScale;
  let yScale;
  let chartHeight;
  let barWidth;
  let nameLabelOffset = 20;
  let partyLabelOffset = 15;
  let voteLabelOffset = 5;
  let nameCleaner;

  function bars(parent){

    const data = parent.datum();


    const barBox = parent.append('g').attr('class','bar-box');
    const labelBox = parent.append('g').attr('class', 'label-box');
    const voteLabelBox = parent.append('g').attr('class', 'vote-label-box');
    const partyLabelBox = parent.append('g').attr('class', 'party-label-box');

    labelBox.attr('transform', `translate(${barWidth/2},0)`);
    partyLabelBox.attr('transform', `translate(${barWidth/2},0)`);
    voteLabelBox.attr('transform', `translate(${barWidth/2},0)`);

    // add bars
    barBox.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth)
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

      // add name labels
      labelBox.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'name-label')
        .text( d => {
          let voteName = Object.keys(d).pop(); //name of category
          let voteAmount = Object.values(d).pop(); // vote value
          return `${nameCleaner(voteName)}`;
        })
        .attr('y', d => {
          let voteAmount = Object.values(d).pop(); // vote value
          return chartHeight - yScale(voteAmount) - nameLabelOffset;
        })
        .attr('x', d => {
          let voteName = Object.keys(d).pop(); //name of category
          return xScale(voteName);
        })

        // add vote labels
        voteLabelBox.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'vote-label')
          .text( d => {
            let voteAmount = Object.values(d).pop(); // vote value
            return `${voteAmount.toFixed(1)}%`;
          })
          .attr('y', d => {
            let voteAmount = Object.values(d).pop(); // vote value
            return chartHeight - yScale(voteAmount) - voteLabelOffset;
          })
          .attr('x', d => {
            let voteName = Object.keys(d).pop(); //name of category
            return xScale(voteName);
          })

        // add composing party labels
        partyLabelBox.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'party-label')
          .text( d => {
            let voteName = Object.keys(d).pop(); //name of category
            if(voteName === 'pro'){
              return proParties.map( party => nameCleaner(party));
             }
            else if(voteName === 'anti'){
              return antiParties.map( party => nameCleaner(party));
            }
            else if(voteName === 'ambig'){
              return ambigParties.map(party => nameCleaner(party));
            }
          })
          .attr('y', d => chartHeight + partyLabelOffset)
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
  bars.setNameCleaner = (x) => {
    nameCleaner = x;
    return bars;
  }
  bars.setBarWidth = (x) =>{
    barWidth = x;
    return bars;
  }

  return bars;
};

module.exports = {makeChart};
