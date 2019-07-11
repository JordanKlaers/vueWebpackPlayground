<template>
	<div id="app">
		<svg class="chart"></svg>
	</div>
</template>

<script>
import Container from './components/container'
import { mapGetters } from 'vuex'
import store from './main.js'
import * as d3 from 'd3';
export default {
	name: 'app',
	components: {
		Container
	},
	data() {
		return {
			width: 1000,
			height: 500
		}
	},
	mounted() {
		console.log('earning data', this.earningData, d3);

		let years = {};
		var yearData = [];
		//group the years in the data with their min and max index of the first and last quarter
		this.earningData.forEach((entry, index) => {
			//if there is a value, group the data
			//an empty value at the end of the earningData will cause no bar to render in the far right slot
			if (entry.value) {
				years[entry.year] = years[entry.year] || [];
				years[entry.year].push(index + 1);
				years[entry.year] = d3.extent(years[entry.year]);
			}

		});
		//create an array of the  years and the associated min/max index to be used by the x Axis labels
		//this is similar to th years object, but is in an array format to be used in the xaxis generation
		for (let key in years) {
			let data = {}
			//if the last index of the year is equal to the length of the data, than that means there is a bar in the far right slot
			//which needs its own indices and associated year key to be used in generating the x axis

			//also, if the last value has data and is Q2, Q3 or Q4, that means it is associated with the precious year, but needs its own grouping
			let hasValueAndNewYear = this.earningData[years[key][1]-1].value && this.earningData[years[key][1]-1].quarter !== 'q1';
			if (years[key][1] == this.earningData.length && hasValueAndNewYear) {
				console.log('key, years', key, years[key]);
				data[key] = [...years[key]];
				data[key][1] = data[key][1] - 1
				yearData.push(data)

				let data2 = {}
				data2[key] = [years[key][1], years[key][1]]
				yearData.push(data2)
			} else {
				data[key] = years[key];
				yearData.push(data)
			}
		}

		//these values are used for the intial placement of the yearlabels along the xAxis
		var yearIndexValues = []
		for (let key in yearData) {
			let yearKey = Object.keys(yearData[key])[0]
			let yearObject = yearData[key];
			let corresopndingIndex = Math.max(...yearData[key][yearKey])
			yearIndexValues.push(corresopndingIndex)
		}

		var width = 800,
			height = 400,
			yAxisXposition = 720,
			xAxisYposition = 320;

		var extent = d3.extent(this.earningData.map(entry => entry.value)),
			//extend the min and max to be 10% greater than the values
			//used on the y axis scale
			dataMin = Math.floor(extent[0] * 0.9),
			dataMax = Math.floor(extent[1] * 1.1);

		var yScale = d3.scaleLinear()
			.domain([dataMin, dataMax])
			.range([xAxisYposition, 10]);
		var xScale = d3.scaleLinear()
			.domain([this.earningData.length, 0])
			.range([yAxisXposition, 10])

		//set the size of the svg
		var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", height);

		//append the bars
		var barWidth = 30;
		var bar = chart.selectAll("g")
			.data(this.earningData)
			.enter()
			.append("rect")
			.attr("x", function (d, i) { return xScale(i) + barWidth/2 })
			.attr("y", function(data, i) { return yScale(data.value)})
			//style the far right bar
			.attr("stroke-width", (data, i) => {
				if (i == this.earningData.length-1) {
					return '3';
				}
				return '0';
			})
			.attr("stroke-dasharray", (data, i) => {
				if (i == this.earningData.length-1) {
					//starting from the top left corner, go to the bottom right (width + height), empty on the bottom edge so a gap of width, then border up the left side
					return `${(xAxisYposition - yScale(data.value)) + barWidth} ${barWidth}`;
				}
				return '0';
			})
			.attr('stroke', 'steelblue')
			.attr("width", barWidth)
			.attr("height", function(data) {
				return xAxisYposition - yScale(data.value);
			});

		//append the Y axis
		var yAxisLabels = []
		yAxisLabels.push(dataMax)
		var labelValue = dataMax;
		while (labelValue - 20 > dataMin) {
			labelValue -= 20;
			yAxisLabels.shift(labelValue);
		}
		
		chart.append("g")
			.attr('class', 'y-axis')
			.attr("transform", `translate(${yAxisXposition},0)`)
			.call(d3.axisRight(yScale)
				// .ticks(7)
				// .tickSize(10)
				.tickValues(yAxisLabels)
				.tickFormat(data => {
					console.log('data?', data);
					return `$${data}`;
				})
			);
		d3.select('.y-axis path:first-of-type')
			.attr("opacity", "0")

		//append the dividing y axis line
		var dividingLine = chart.append("g")
			.attr("transform", `translate(0,${xAxisYposition})`)
			.call(d3.axisBottom(xScale)
				.tickValues([this.earningData.length-1])
				.tickSize(-height + (xAxisYposition - height) + 100)
				.tickSizeOuter(0)
				.tickFormat("")
			);
		dividingLine.select(".tick:first-of-type line")
			.attr("opacity", "0.5")

		//append the quarter X axis
		var quarterLabelIndex = [];
		var quarterLabels = this.earningData.map((val, indx) => {
			quarterLabelIndex.push(indx)
			return val.quarter;
		})
		
		chart.append("g")
			.attr("transform", `translate(0,${xAxisYposition})`)
			.attr('class', 'x-axis')
			.call(d3.axisBottom(xScale)
				.tickSize(0)
				.tickValues(quarterLabelIndex)
				.tickFormat((data, indx) => {
					return quarterLabels[indx];
				})
			);

		//append the horizontal lines that group the quarter to the year on the x Axis
		// console.log('yearData', yearData);
		var line = d3.line()
			.x(function(d, i) {
				//custom offset for the start and end of the grouping line between the quarter and year group
				if (i === 0) d += 0.25
				if (i === 1) d -= 0.15
				return xScale(d-1)
			})
			.y(function(d) {
				//the group of these lines has its position transformed the same as the other x Axies, so this is the "padding" to place in vertically between the years and quarters
				return 20;
			});
		// the year data contains the indices used to play the year labels on the xAxis
		// these values can also be used to generate a line above the year label
		yearData.forEach(year => {
			//the data passed should be the first index and the second index should be the range that the year covers
			let indexRangeOfYear = [...year[Object.keys(year)[0]]]
			//the second value is the difference of the original indices plus 1
			indexRangeOfYear[1] = indexRangeOfYear[0] + (indexRangeOfYear[1] - indexRangeOfYear[0]) + 1
			chart.append('path')
				.data([indexRangeOfYear])
				.attr('id', 'path')
				.attr('transform', `translate(0,${xAxisYposition})`)
				.attr('d', line)
				.attr('stroke-width', '1')
				.attr('stroke', 'steelblue')
				.attr('fill', 'transparent')
		})

		//move the quarter labels over so that aling with the center of the bar they represent
		var X_tickGapWidth = Math.abs((xScale(1) - xScale(2))/2);
		var xAxisLables = d3.selectAll('.x-axis g text')
			.attr('transform', `translate(${X_tickGapWidth}, 0)`);


		//append the year X axis label
		var yearAxis = chart.append('g')
			.attr('transform', `translate(0,${xAxisYposition})`)
			.call(d3.axisBottom(xScale)
				.tickPadding(30)
				.tickSize(0)
				//the values (calculated above) are used as the initial placement
				.tickValues(yearIndexValues)
				.tickFormat((data, indx) => {
					//the label is grabbed for the yearData array
					return Object.keys(yearData[indx])[0];
				})
			)

		//move the labels over to be centered with the quarters they represent
		//calculated using the indexs of the quarters that were grouped in the yearData object
		var xAxisYearLabels = yearAxis.selectAll('g text')
			.attr('transform', (data, indx) => {
				let rangeOfYear = yearData[indx][Object.keys(yearData[indx])[0]];
				let offSet = Math.abs((xScale(rangeOfYear[0] -1) - xScale(rangeOfYear[1]))/2)
				return `translate(${-offSet},0)`;
			})
	},
	computed: {
		...mapGetters(['earningData', 'fromStore']),
		// var bar = chart.selectAll("g")
		// 	.data(this.earningData)
		// 	.enter().append("g")
			// .attr("transform", function(d, i) { return `translate(${i * barThickness}, 0)`; });

		// bar.append("rect")
		// 	.attr("x", function (d, i) { return i * barThickness })
		// 	.attr("y", function(data) { return y(data.value) })
		// 	.attr("width", barThickness - 1)
		// 	.attr("height", function(data) { return height - y(data.value); });

		// bar.append('text')
		// 	.attr("x", function (d, i) { return (i * barThickness) + (barThickness / 2) })
		// 	.attr('y', function (d) { return y(d.value) - 10 })
		// 	// .attr('style', 'text-anchor: start;')
		// 	.attr('transform', function (d, i) { return `rotate(45, ${(i * barThickness) + (barThickness / 2)}, ${y(d.value) - 10})` })
		// 	.text(function(d) { return d.name})

	},
	methods: {
	}
};
</script>
<style lang="less">
.chart {
	border: 1px solid gray;
	rect {
		fill: steelblue;
		&:last-of-type {
			fill: transparent;
		}
	}
	text {
		fill: black;
		font: 10px sans-serif;
		// text-anchor: end;
	}
}
</style>