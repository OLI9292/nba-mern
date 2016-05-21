var eastern_conf_teams = [], western_conf_teams = [];

function is_eastern_conf(team) { return team['conference'] === 'eastern'; };

for (var i in nba_teams) {
  if (is_eastern_conf(nba_teams[i])) {
    eastern_conf_teams.push(nba_teams[i]['city']+' '+nba_teams[i]['name']+','+i);
  }
  else {
    western_conf_teams.push(nba_teams[i]['city']+' '+nba_teams[i]['name']+','+i);
  }
};

var teams = {eastern: eastern_conf_teams, western: western_conf_teams};

module.exports = teams;
