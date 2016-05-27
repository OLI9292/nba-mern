var express = require('express');
var fs = require('fs');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var nba_db;

app.use(express.static('static'));

app.get('/api/nba_players', function(req, res) {
  nba_db.collection('nba_player_stats').find().toArray(function(err, data){
    res.send(data);
  });
});

app.get('/', function(req, res) {
  res.send('index.html');
});

app.get('/team/*', function(req, res){
  nba_db.collection('nba_player_stats').find( {'TEAM_NAME': req.query['team'] }).toArray(function(err, data){
    res.send(data);
  });
});

MongoClient.connect('mongodb://localhost:27017/nba', function(err, db) {
  nba_db = db;
  var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on PORT', port);
  });
});
