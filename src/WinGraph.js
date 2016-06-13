var d3 = require("d3");

function drawWinGraph(gameLogs) {

  var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 842 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var data = [], winCount = 0;

  gameLogs.forEach(function(game) { 
    winCount = game[7] === 'W' ? winCount + 1 : winCount;
    data.push({'date': parseDate(game[5]), 'wins': winCount})
  });

  console.log(data);

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(0);

  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(0);

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.wins); });

  var svg = d3.select(".winGraph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, 80]);

  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
}

module.exports = drawWinGraph;
