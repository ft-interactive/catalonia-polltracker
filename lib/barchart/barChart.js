const d3 = require('d3');

const {proParties, antiParties, ambigParties} = require('./partyList');
const {colourSelector} = require('../helpers');

function makeChart(){

  let xScale;
  let yScale;
  let chartHeight;
  let barWidth;
  let dataMax = 50;
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

    console.log("chartHeight", chartHeight);


    /* TRY THIS */
    const objectToStack = (o, order) => {
      const indyPosition = Object.keys(o).pop();
      const partyList = Object.values(o).pop();
      if (order !== undefined) { /*sort*/ }

      return partyList.reduce((acc, current, index) => {
        acc.position = indyPosition;
        acc.stack.push({
          party: current.party,
          y: acc.start,
          votes: parseFloat(current.vote)
        })
        acc.start = acc.start + current.vote;
        return acc;
      }, {
        stack: [],
        start: 0
      });
    }

    const layout = (data) => {
      let positions = Object.keys(data);
      return positions.map(position => objectToStack({[position]: data[position]}));
    }

    const stacks = layout(data);

    stacks.forEach(stack => console.log("ONE STACK", stack))
    console.log("====================")

    console.log("yscale 0", yScale(0));
    console.log("yscale dataMax", yScale(dataMax));

    barBox.selectAll('g.stack')
      .data(stacks)
      .enter()
      .append('g').attr('class', 'stack')
      .each(function(stackData) {
        const stackPos = stackData.position;
        d3.select(this)
          .attr("id", stackPos)
          .selectAll('rect')
          .data(stackData.stack)
          .enter()
          .append('rect')
          .attr('x', d => xScale(stackPos))
          .attr('y', d =>  {
            console.log("Max minus new block", yScale(dataMax) - yScale(d.y) )
            return Math.abs(yScale(dataMax) - yScale(d.y))
          })
          .attr('height', d => yScale(d.votes))
          .attr('width', d => barWidth)
          .attr('fill', d => colourSelector(d.party))
      });


    //   // add name labels
    //   labelBox.selectAll('text')
    //     .data(data)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'name-label')
    //     .text( d => {
    //       let voteName = Object.keys(d).pop(); //name of category
    //       let voteAmount = Object.values(d).pop(); // vote value
    //       return `${nameCleaner(voteName)}`;
    //     })
    //     .attr('y', d => {
    //       let voteAmount = Object.values(d).pop(); // vote value
    //       return chartHeight - yScale(voteAmount) - nameLabelOffset;
    //     })
    //     .attr('x', d => {
    //       let voteName = Object.keys(d).pop(); //name of category
    //       return xScale(voteName);
    //     })

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
