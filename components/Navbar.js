// Include React
var React = require("react");

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  handleClick(e) {
    this.props.handleLittleBoards();
  }

  render() {
    return (
      <div className="nav-wrap">
				<div className="nav-logo">
					<a href="#" className="text-orange text-48 outline-yellow mob-text-24">Triple Duel</a>
				</div>
				<div className="nav-versus">
					<div className="text-yellow mob-text-16"><p>{this.props.player1}</p></div>
					<div className="text-blue"><p className='mob-text-16'>Vs</p></div>
					<div className="text-yellow mob-text-16"><p>{this.props.player2}</p></div>
				</div>
				<div className="nav-links grow 1">			
          <div onClick={this.handleClick.bind(this)}>Little Boards</div>
					<a href="#" className="text-blue">Logout</a>
				</div>
			</div>
    );
  }
};

module.exports = Navbar;

// <div className="navbar-fixed">
//         <nav>
//           <div className="nav-wrapper">
//             <a href="#" className="brand-logo-right">Triple Monster</a>
//             <div id="players">{this.props.player_vs}</div>
//             <div id="nav-mobile" className="text-orange right hide-on-med-and-down">
//             </div>
//             <div onClick={this.handleClick.bind(this)}>Little Boards</div>
//           </div>
//         </nav>
//       </div>