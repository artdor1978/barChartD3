import * as d3 from "d3";
import * as styles from "../styles/index.css";

let app = () => {
	const chart = d3.select("body").append("svg").attr("id", "chart");
	const url =
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
	const getData = async () => {
		const dataJson = await d3.json(url);
		const data = dataJson.data;
		console.log("Initial data:", data);
		renderChart(data);
	};

	const renderChart = (data) => {
		const areaWidth = window.innerWidth;
		const areaHeight = window.innerHeight;
		const areaPadding = 80;
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("id", "tooltip")
			.style("opacity", 0);
		const barWidth = (areaWidth - 2 * areaPadding) / data.length;
		const formatTime = d3.timeFormat("%Y-%m-%d");
		var xMax = new Date(d3.max(data.map((x) => x[0])));
		xMax.setMonth(xMax.getMonth() + 3);
		chart.attr("width", areaWidth).attr("height", areaHeight);
		const x = d3
			.scaleTime()
			.domain([d3.min(data.map((x) => new Date(x[0]))), xMax])
			.rangeRound([areaPadding, areaWidth - areaPadding]);
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data.map((d) => +d[1]))])
			.range([areaHeight - areaPadding, areaPadding]);
		const xAxis = d3.axisBottom(x);
		const yAxis = d3.axisLeft(y);
		chart
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (areaHeight - areaPadding) + ")")
			.attr("id", "x-axis")
			.call(xAxis);
		chart
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + areaPadding + ",0)")
			.attr("id", "y-axis")
			.call(yAxis);
		chart
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d, i) => areaPadding + i * barWidth)
			.attr("y", (d) => y(+d[1]))
			.attr("width", barWidth)
			.attr("height", (d) => areaHeight - areaPadding - y(d[1]))
			.attr("fill", "steelblue")
			.attr("data-date", (d) => d[0])
			.attr("data-gdp", (d) => d[1])
			.on("mouseover", (d, i) => {
				tooltip.transition().duration(200).style("opacity", 1);
				//console.log("i",i);
				tooltip
					.html(i[0] + "<br/>" + i[1])
					.style("left", event.pageX - 25 + "px")
					.style("top", event.pageY - 45 + "px")
					.attr("data-date", i[0]);
			})
			.on("mouseout", function (d) {
				tooltip.transition().duration(500).style("opacity", 0);
			});
		chart
			.append("text")
			.attr("x", areaWidth / 2)
			.attr("y", areaPadding + 20)
			.attr("id", "title")
			.attr("text-anchor", "middle")
			.text("Gross Domestic Product, Billions of Dollars");
	};

	return getData();
};

// добавляем заголовок в DOM
const root = document.querySelector("#root");
root.appendChild(app());
