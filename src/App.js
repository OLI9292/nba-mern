var $ = require('jquery');
var d3 = require('d3');
var moment = require('moment');
var drawWinGraph = require('./WinGraph.js');
var gameClips = require('./data/gameClips.json')

var ec_teams = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls", 
  "Cleveland Cavaliers",
  "Detroit Pistons",
  "Indiana Pacers",
  "Miami Heat",
  "Milwaukee Bucks",
  "New York Knicks", 
  "Orlando Magic", 
  "Philadelphia 76ers", 
  "Toronto Raptors",
  "Washington Wizards"
]

var wc_teams = [
  "Dallas Mavericks",
  "Denver Nuggets",
  "Golden State Warriors",
  "Houston Rockets",
  "Los Angeles Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "Oklahoma City Thunder", 
  "Phoenix Suns", 
  "Portland Trail Blazers", 
  "Sacramento Kings", 
  "San Antonio Spurs",
  "Utah Jazz"
]

var team_codes = {
  ATL: "Hawks",
  BKN: "Nets",
  BOS: "Celtics",
  CHA: "Hornets",
  CHI: "Bulls",
  CLE: "Cavaliers",
  DAL: "Mavericks",
  DEN: "Nuggets",
  DET: "Pistons", 
  GSW: "Warriors",
  HOU: "Rockets",
  IND: "Pacers",
  LAC: "Clippers",
  LAL: "Lakers",
  MEM: "Grizzlies",
  MIA: "Heat",
  MIL: "Bucks",
  MIN: "Timberwolves",
  NOP: "Pelicans",
  NYK: "Knicks",
  OKC: "Thunder",
  ORL: "Magic",
  PHI: "76ers",
  PHX: "Suns",
  POR: "Blazers",
  SAC: "Kings", 
  SAS: "Spurs",
  TOR: "Raptors",
  UTA: "Jazz",
  WAS: "Wizards"
}

$(document).ready(function() {

  var ec_teams_html = ec_teams.map(function(team) {
    return '<li>'+team+'</li>';
  }).join().replace(/,/g, '');
  var wc_teams_html = wc_teams.map(function(team) {
    return '<li>'+team+'</li>';
  }).join().replace(/,/g, '');

  function resetNav(conference, team, players) {
    $('.nav-items li').remove();

    if (conference === false) {
      $('.nav-items').append(players);
      $('.nav-items li').click(function() {
        getPlayer(this.innerHTML, this.getAttribute('key'));
      });
    }
    else if (conference == 'west') {
      $('.nav-items').append(wc_teams_html);
      $('.nav-items li').click(function() {
        getTeam(this.innerHTML);
      });
    }
    else {
      $('.nav-items').append(ec_teams_html);
      $('.nav-items li').click(function() {
        getTeam(this.innerHTML);
      });
    }
  };

  function formatPlayerGameLogs(playernName, playerData) {
    var games = [];
    var format = d3.time.format("%b %d, %Y");
    for (i in playerData) {
      var game = {
        player: {
          name: playernName,
          values: null
        },
        matchup: playerData[i][4],
        date: format.parse(playerData[i][3]),
        points: playerData[i][24],
        assists: playerData[i][19],
        rebounds: playerData[i][18]
      }
      games.unshift(game);
    }
    return {
      name: playernName,
      values: games
    }
  }

  function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY
    }
  }

  function loadImage(path, className, styles, width, height, target) {
    $('<img src="./images'+ path +'.png" class="' + className + '" style="' + styles + '">')
      .load(function() {
        $(this).width(width).height(height).appendTo(target);
      });
  }

  function makeWinStream(data) {
    var winStream = data.map(function(game) {
      return '<li style=' + (game[7] === 'W' ? '"color: blue;"' : '"color: red; margin-top:5px"') 
              + '>' + game[7] + '</li>';
    }).join().replace(/,/g, '');
    $('.gameLogs').css('visibility', 'visible');
    $('.winStream').append(winStream);
    $('.winStream li').hover(function() {
      var leftOffset = getOffset(this)['left'];
      $('.gameLogs').append('<p class="miniGameBox" style="left: ' + (leftOffset+26) + 
                            'px">' + moment(data[$(this).index()][5]).format("MMM Do YY") + '<br>' + 
                            '<span class="matchup">' + data[$(this).index()][6] + '</span><br>' + data[$(this).index()][26] + 
                            ' - ' + (data[$(this).index()][26] - data[$(this).index()][27]) + '</p>' + 
                            '<p class="verticalLine" style="left: ' + (leftOffset + 2) + 
                            'px"></p>');
      var team = team_codes[data[$(this).index()][6].split(' ')[0]].toLowerCase();
      var opponent = team_codes[data[$(this).index()][6].split(' ')[2]].toLowerCase();
      var teamStyle = 'left: ' + (leftOffset-15) + 'px';
      var opponentStyle = 'left: ' + 
        ((data[$(this).index()][6].split(' ')[1]==='vs.') ? (leftOffset + 155) : (leftOffset + 130)) + 'px';
      loadImage('/logos/' + team, 'logo', teamStyle, 32, 30, '.gameLogs');
      loadImage('/logos/' + opponent, 'logo', opponentStyle, 32, 30, '.gameLogs');
    },
      function() {
        $('.logo').remove();
        $('.miniGameBox').remove();
        $('.verticalLine').remove();
    });

    $('.winStream li').click(function() {
      $('iframe').remove();
      var abbrMatchupA = (data[$(this).index()][6].split(' ')[0] + '_' + 
                          data[$(this).index()][6].split(' ')[2]).toLowerCase();
      var abbrMatchupB = (data[$(this).index()][6].split(' ')[2] + '_' + 
                          data[$(this).index()][6].split(' ')[0]).toLowerCase();
      var gamesOnThisDate = gameClips[data[$(this).index()][5]];
      for (var i in gamesOnThisDate) {
        if (gamesOnThisDate[i][abbrMatchupA]) { var clip = gamesOnThisDate[i][abbrMatchupA]; break; }
        if (gamesOnThisDate[i][abbrMatchupB]) { var clip = gamesOnThisDate[i][abbrMatchupB]; break; }
      }
      $('#iframe-container').append('<iframe width="546" height="409.5" frameborder="0" allowfullscreen src="' + 
                                    clip.replace('watch?v=', 'embed/') + 
                                    '?color=white&ps=docs&theme=light&modestbranding=1&autoplay=1&showinfo=0&rel=0"></iframe>');
    });
  };

  function getTeamGameLogs(team) {
    var url = 'http://stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&' +
              'PlayerOrTeam=T&Season=2015-16&SeasonType=Regular+Season&Sorter=PTS';
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      crossOrigin: true,
      url,
      success: function(data) {
        var gameLogs = data['resultSets'][0]['rowSet'].filter(function(v) { 
                              return v[3] === team; 
                            })
                           .sort(function(a, b) { 
                              return (parseInt(a[4]) < parseInt(b[4])) ? -1 : 1; 
                            });
        makeWinStream(gameLogs);

        drawWinGraph(gameLogs);
      }
    });
  };
  
  function getTeam(team) {
    $('.winStream li').remove();
    $('svg').remove();
    $('.gameLogs').css('visibility', 'hidden');

    var teamName = team.includes('Portland') ? 'Trail Blazers' : team.split(' ').pop(),
        url = './team/?team=' + teamName,
        playersOnTeam = [];

    $.ajax(url, {teams: {}}).done(function(teams) {
      for (var i=0; i<teams.length; i++) {
        playersOnTeam.push(teams[i]['DISPLAY_FIRST_LAST']+','+teams[i]['PERSON_ID']);
      };
      playersOnTeam = playersOnTeam.sort().map(function(player) {
        return '<li key="' + player.split(',')[1] + '">' + player.split(',')[0] + '</li>'
      }).join().replace(/,/g, '');
      resetNav(false, teamName, playersOnTeam);
    });
    getTeamGameLogs(team);
  };

  function getPlayer(playernName, playerId) {
    var url = 'http://stats.nba.com/stats/playergamelog?LeagueID=00&' + 
                  'PlayerID=' + playerId + '&Season=2015-16&SeasonType=Regular+Season';
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      crossOrigin: true,
      url,
      success: function(data) {
        var formattedData = formatPlayerGameLogs(playernName, data['resultSets'][0]['rowSet']);
        data_array = [];
        data_array.push(formattedData);
      }
    });
  };

  $('.west').click(function() { resetNav('west'); });
  $('.east').click(function() { resetNav('east'); });
  resetNav('west');
});

