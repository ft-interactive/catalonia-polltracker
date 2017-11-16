const d3 = require('d3');

const {proParties, antiParties, ambigParties} = require('./partyList');
const {colourSelector} = require('../helpers');

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


    /* TRY THIS */
    const objectToStack = (o, order) => {
      const indyPosition = Object.keys(o).pop();
      const partyList = Object.values(o).pop();
      if (order !== undefined) { /*sort*/ }

      return partyList.reduce((acc, current, index) => {
        acc.position = indyPosition;
        acc.stack.push({
          party: current.party,
          x: acc.start,
          votes: parseFloat(current.vote)
        })
        acc.start += current.vote // sum up all votes for parties with this position
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

    barBox.selectAll('g.stack')
      .data(stacks)
      .enter()
      .append('g').attr('class', 'stack')
      .each(function(stackData, index) {
        const stackPos = stackData.position;
        d3.select(this)
          .attr("id", stackPos)
          .selectAll('rect')
          .data(stackData.stack)
          .enter()
          .append('rect')
          .attr('x', d => {
            console.log("stackpos", stackPos);
            return xScale(stackPos);
          })
          .attr('y', d => yScale(d.x))
          .attr('width', d => barWidth)
          .attr('height', d => yScale(d.votes))
          .attr('fill', d => colourSelector(d.party))
      });


    /* DONE */


    // add a g for each bar
    // data.forEach( dataset => {
    //
    //   barBox.selectAll('g')
    //    .data(dataset)
    //    .enter()
    //    .append('g');
    //
    //   barBox.selectAll('g')
    //      .data(dataset => {
    //        console.log("Here", dataset)
    //        return dataset;
    //      })
    //      .enter()
    //      .append('rect')
    //      .attr('class', 'bar')
    //      .attr('width', barWidth)
    //      .attr('height', d => {
    //        let voteSum = Object.values(d).pop();
    //        return yScale(voteSum);
    //      })
    //      .attr('x', d => {
    //        let voteName = Object.keys(d).pop(); //name of category
    //        return xScale(voteName);
    //      })
    //      .attr('y', d => {
    //        let voteSum = Object.values(d).pop();
    //        return chartHeight - yScale(voteSum);
    //      });
    //
    // });

    // // add bars
    // barBox.selectAll('g')
    //   .data(data)
    //   .enter()
    //   .append('rect')
    //   .attr('class', 'bar')
    //   .attr('width', barWidth)
    //   .attr('height', d => {
    //     let voteSum = Object.values(d).pop();
    //     return yScale(voteSum);
    //   })
    //   .attr('x', d => {
    //     let voteName = Object.keys(d).pop(); //name of category
    //     return xScale(voteName);
    //   })
    //   .attr('y', d => {
    //     let voteSum = Object.values(d).pop();
    //     return chartHeight - yScale(voteSum);
    //   });
    //
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
