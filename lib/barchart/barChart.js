const d3 = require('d3');

const {proParties, antiParties, ambigParties} = require('./partyList');
const {colourSelector} = require('../helpers');

function makeChart(){

  let xScale;
  let yScale;
  let chartHeight;
  let barWidth;
  let voteMax = 50;
  let nameLabelOffset = 50;
  let voteLabelOffset = 35;
  let partyLabelOffset = 20;
  let nameCleaner;

  function bars(parent){

    const data = parent.datum();

    const objectToStack = (o, order) => {
      const indyPosition = Object.keys(o).pop();
      const partyList = Object.values(o).pop();
      if (order !== undefined) { /*sort*/ }

      const totalVoteForPosition = partyList.reduce((acc,curr) => {
        return acc += parseFloat(curr.vote);
      }, 0);

      return partyList.reduce((acc, current, index) => {
        acc.position = indyPosition;
        acc.total = totalVoteForPosition;
        acc.stack.push({
          party: current.party,
          y: acc.start,
          votes: parseFloat(current.vote)
        })
        acc.start = acc.start + current.vote;
        return acc;
      }, {
        stack: [],
        start: voteMax - totalVoteForPosition
      });
    }

    const layout = (data) => {
      let positions = Object.keys(data);
      return positions.map(position => objectToStack({[position]: data[position]}));
    }

    const stacks = layout(data);

    parent.selectAll('g.stack')
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
            return yScale(d.y)
          })
          .attr('height', d => yScale(d.votes))
          .attr('width', d => barWidth)
          .attr('fill', d => colourSelector(d.party, "background"))
      });


      // add name labels for position on independence
      parent.selectAll('g.stack')
        .append('g').attr('class', 'name-label')
        .attr('transform', `translate(${barWidth/2},0)`)
        .each( function(stackData){
          const stackPos = stackData.position;
          const stackTotal = stackData.total;
          d3.select(this)
            .selectAll('text')
            .data(stackData.stack)
            .enter()
            .append('text')
            .text( d => nameCleaner(stackPos))
            .attr('y', d => {
              return chartHeight - yScale(stackTotal) - nameLabelOffset;
            })
            .attr('x', d => xScale(stackPos))
            .attr("text-anchor", "middle")
        });

        // add vote % labels
        parent.selectAll('g.stack')
          .append('g').attr('class', 'vote-label')
          .attr('transform', `translate(${barWidth/2},0)`)
          .each( function(stackData){
            const stackPos = stackData.position;
            const stackTotal = stackData.total;
            d3.select(this)
              .selectAll('text')
              .data(stackData.stack)
              .enter()
              .append('text')
              .text( d => `${stackTotal.toFixed(1)}%`)
              .attr('y', d => {
                return chartHeight - yScale(stackTotal) - voteLabelOffset;
              })
              .attr('x', d => xScale(stackPos))
              .attr("text-anchor", "middle")
          });

          //add party name labels placed over rects
          parent.selectAll('g.stack')
            .append('g').attr('class', 'party-label')
            .attr('transform', `translate(${barWidth/2},0)`)
            .each( function(stackData){
              const stackPos = stackData.position;
              const stackTotal = stackData.total;
              d3.select(this)
                .selectAll('text')
                .data(stackData.stack)
                .enter()
                .append('text')
                .text( d => nameCleaner(d.party))
                .attr('y', d => yScale(d.y) + partyLabelOffset)
                .attr('x', d => xScale(stackPos))
                .attr("text-anchor", "middle")
                .attr("font-weight", 500)
                .attr("fill", d => {
                  if(d.party === 'pdecat' || d.party === 'catcomu' || d.party === 'cup'){
                    return "white";
                  } else { return "black" }
                })
            });
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
