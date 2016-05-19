var React = require('React');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var TeamNav = require('./TeamNav');
var teams = require('./teams');

var App = React.createClass({
  render: function() {
    return(
      <TeamNav data={teams} />
    );
  }
});

ReactDOM.render(<App />, document.getElementById('main'));
