var React = require('react');

var TeamNav = React.createClass({
  getInitialState: function() {
    return {data: this.props.data['eastern']};
  },
  east: function() {
    this.setState({data: this.props.data['eastern']});
  },
  west: function() {
    this.setState({data: this.props.data['western']});
  },
  render: function() {
    var conf_teams = this.state.data.map(function(team) {
      return (
        <li key={team.split(',')[1]}>
        <a href={'./team/?team='+team.split(',')[0].split(' ').pop().toLowerCase()}>{team.split(',')[0]}</a></li>
      );
    });
    return(
      <div className="teamNav">
        <div className="conference">
          <div className="mainNav">NBA</div>
          <div className="west" onClick={this.west}>WEST</div>
          <div className="east" onClick={this.east}>EAST</div>
          <ul className="teams">{conf_teams}</ul>
        </div>
      </div>
    );
  }
});

module.exports = TeamNav;
