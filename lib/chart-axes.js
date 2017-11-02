const d3 = require('d3');

function electionChartAxes() {
	let xScale;
	let yScale;
	let width;
	let height;
	let earliestDate;
	let padding;
	const election2017 = new Date(2017, 8, 24);
	const election2013 = new Date(2013, 8, 22);
	let monthsBetweenTicks;
  const minVoteShareForSeat = 5;

	function axes(parent) {

    const yAxis = d3.axisRight(yScale)
      .tickSize(width)

		const xTicks = d3.timeMonths(earliestDate, new Date(), monthsBetweenTicks);
		xTicks.push(election2017); // 2017 election date
		xTicks.push(election2013); // 2013 election date

		const xAxis = d3.axisTop(xScale)
        .tickSize(height - padding.top - padding.bottom)
        .tickValues(xTicks)
        .tickFormat((d, i, j) => {
          if (d.getMonth() === 0) {
            return d3.timeFormat('%Y')(d);
          }					else if (i === j.length - 1) {
            return 'Last election';
          }					else if (i === j.length - 2) {
            return `Election`;
          }

          return d3.timeFormat('%b %y')(d);
        });

		const actualXAxis = parent.append('g')
      .attr('class', 'axes')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - padding.top - padding.bottom})`)
      .call(xAxis);

		const actualYAxis = parent.append('g')
      .attr('class', 'axes')
      .attr('id', 'y-axis')
      .attr('transform', `translate(0,0)`)
      .call(yAxis);

    // Position y axis text
		actualYAxis.selectAll('text')
      .attr('transform', `translate(${0 - (width + 5)},0)`)
      .attr('text-anchor', 'end');

    // Position x axis text
		actualXAxis.selectAll('text')
			.attr('text-anchor', 'end')
			.attr('y', `${20}`);

      // Give special class to highlighted dates on x-axis
		actualXAxis.selectAll('#x-axis .tick')
      .classed('highlight', d => shouldBeXHighlight(d));

      // Assign all others to minor class
		actualXAxis.selectAll('#x-axis .tick')
      .classed('minor', d => !shouldBeXHighlight(d));

      // Give special positioning to highlighted dateLatest
		actualXAxis.selectAll('.highlight text')
        .attr('y', `${-height + padding.top + padding.bottom - 5}`);

      // Give special class to highlighted voteshare y-axis
    actualYAxis.selectAll('#y-axis .tick')
      .classed('highlight', d => shouldBeYHighlight(d));

      // Add label to min vote share x-axis
    const minVoteLabel = actualYAxis.selectAll('#y-axis .highlight')
      .append('text')
      .text("5% vote share needed for seat")
      .attr("y", 22)
      .attr("x", 7)
      .attr("class", "vote-share-label");

    const minVoteLabelArrow = actualYAxis.selectAll('#y-axis .highlight')
      .append('line')
      .attr("x1", 10)
      .attr("y1", 0)
      .attr("x2", 10)
      .attr("y2", 10)
      .attr("stroke-width", 4);

		function shouldBeXHighlight(tick) {
			const tickDate = d3.timeFormat('%d %b %Y')(tick);
			const election2017Formatted = d3.timeFormat('%d %b %Y')(election2017);
			const election2013Formatted = d3.timeFormat('%d %b %Y')(election2013);
			if (tickDate === election2017Formatted) {
				return true;
			}	else if (tickDate === election2013Formatted) {
				return true;
			}
			return false;
		}

    function shouldBeYHighlight(voteshare){
      return voteshare === minVoteShareForSeat;
    }
	}

	axes.setYScale = x => {
		yScale = x;
		return axes;
	};

	axes.setXScale = x => {
		xScale = x;
		return axes;
	};
	axes.setWidth = x => {
		width = x;
		return axes;
	};
	axes.setHeight = x => {
		height = x;
		return axes;
	};
	axes.setEarliestDate = x => {
		earliestDate = x;
		return axes;
	};
	axes.setPadding = x => {
		padding = x;
		return axes;
	};
	axes.setMonthsBetweenTicks = x => {
		monthsBetweenTicks = x;
		return axes;
	};

	return axes;
}

module.exports = {electionChartAxes};
