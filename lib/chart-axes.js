const d3 = require('d3');

function electionChartAxes() {
	let xScale;
	let yScale;
	let width;
	let height;
	let earliestDate;
	let padding;
	const election2017 = new Date(2017, 11, 21);
	const referendum2017 = new Date(2017, 09, 1);
	let monthsBetweenTicks;
  const minVoteShareForSeat = 5;

	function axes(parent) {

    const yAxis = d3.axisRight(yScale)
      .tickSize(width)

		const xTicks = d3.timeMonths(earliestDate, new Date(), monthsBetweenTicks);
		xTicks.push(election2017); // 2017 election date
		xTicks.push(referendum2017); // 2017 referendum date
		const specialTicksNumber = 2; //sum of two pushes above

		const xAxis = d3.axisTop(xScale)
        .tickSize(height - padding.top - padding.bottom)
        .tickValues(xTicks)
        .tickFormat((d, i, j) => {
          if (d.getMonth() === 0) {
            return d3.timeFormat('%Y')(d);
          }	else if (d === election2017) {
            return `Election`;
          } else if (d === referendum2017) {
            return `Referendum`;
          } else{
						return d3.timeFormat('%b %y')(d);
					}
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

			// Give special positioning to highlighted tick text
		actualXAxis.selectAll('.highlight text')
        .attr('y', `${-height + padding.top + padding.bottom - 5}`);

		function shouldBeXHighlight(tick) {
			let numberOfNormalTicks = xTicks.length - (specialTicksNumber + 1); //basically find all normal ticks by their position in the tick array
			if(xTicks.indexOf(tick) > numberOfNormalTicks){
				return true;
			} else {
				return false;
			}
		};
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
