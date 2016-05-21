var React = require('react');
var $ = require('jquery');
var PlayerStats = require('./PlayerD3');

var TeamNav = React.createClass({
  getInitialState: function() {
    return {teams: this.props.teams['eastern'], heading: 'NBA' , players: false, playerData: false}
  },
  loadTeam: function(index) {
    var team = this.state.teams[index].substring(this.state.teams[index].lastIndexOf(' ') + 1).split(',')[0];
    var url = './team/?team=' + this.state.teams[index].split(',')[1];
    var playersOnTeam = [];
    var that = this;
    $.ajax(url, {teams: {}}).done(function(teams) {
      for (var i=0; i<teams.length; i++) {
        playersOnTeam.push(teams[i]['DISPLAY_FIRST_LAST']+','+teams[i]['PERSON_ID']);
      }; 
      that.setState({heading: team, players: playersOnTeam.sort()});
    });
  },
  getPlayerStats: function(index) {
    var playerId = this.state.players[index].split(',')[1];
    var url = 'http://stats.nba.com/stats/playergamelog?LeagueID=00&' + 
              'PlayerID=' + playerId + '&Season=2015-16&SeasonType=Regular+Season';
    var that = this;
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      crossOrigin: true,
      url,
      success: function(data) {
        var playerData = data['resultSets'][0]['rowSet'];
        var pts = [];
        var reb = [];
        var ast = []
        var matchups = [];
        var count = 0;
        for (i in playerData) {
          var gamePts = {
            x: count,
            y: playerData[i][24]
          }
          var gameReb = {
            x: count,
            y: playerData[i][18]
          }
          var gameAst = {
            x: count,
            y: playerData[i][19]
          }
          var matchup = {
            count: count,
            date: playerData[i][3],
            matchup: playerData[i][4],
          }
          pts.push(gamePts);
          reb.push(gameReb);
          ast.push(gameAst);
          matchups.push(matchup);
        }
        var formattedData = {
          points: pts,
          rebounds: reb,
          assists: ast,
          matchups: matchups
        };
        that.setState({playerData: formattedData});
      }
    });
  },
  east: function() {
    this.setState({heading: 'NBA', teams: this.props.teams['eastern'], players: false});
  },
  west: function() {
    this.setState({heading: 'NBA', teams: this.props.teams['western'], players: false});
  },
  render: function() {
    if (this.state.players) {
      var players = this.state.players.map(function(player, i) {
        var boundClick = this.getPlayerStats.bind(this, i);
        return (
          <li key={i} id={player.split(',')[1]} onClick={boundClick}>{player.split(',')[0]}</li>
        )
      }, this);
    };
    var teams = this.state.teams.map(function(team, i) {
      var boundClick = this.loadTeam.bind(this, i);
      return (
        <li onClick={boundClick} key={i}>{team.split(',')[0]}</li>
      )
    }, this);
    return(
      <div>
        <div className="teamNav">
          <div className="conference">
            <div className="mainNav">{this.state.heading}</div>
            <div className="west" onClick={this.west}>WEST</div>
            <div className="east" onClick={this.east}>EAST</div>

            <ul className="teams">
              {players || teams}
            </ul>
          </div>
        </div>
      <PlayerStats playerData={this.state.playerData} />
      </div>
    );
  }
});

module.exports = TeamNav;
