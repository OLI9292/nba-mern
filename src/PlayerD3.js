var React = require('react');
var $ = require('jquery');

var d3 = require("d3"),
    jsdom = require("jsdom");



var document = jsdom.jsdom(),
    svg = d3.select(document.body).append("svg");

console.log(svg)

var PlayerStats = React.createClass({
  render: function() {
    console.log(this.props.playerData)
    return(

      <div className='playerd3'>
        <Chart data='formatedData' />
      </div>
    );
  }
});
var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });
    5
module.exports = PlayerStats;

/*
["SEASON_ID", "Player_ID", "Game_ID", "GAME_DATE", "MATCHUP", "WL", "MIN", 
"FGM", "FGA", "FG_PCT", "FG3M", "FG3A", "FG3_PCT", "FTM", "FTA", "FT_PCT", 
"OREB", "DREB", "REB", "AST", "STL", "BLK", "TOV", "PF", "PTS", "PLUS_MINUS", "VIDEO_AVAILABLE"]
*/
