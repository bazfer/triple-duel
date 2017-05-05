// Include React
var React = require("react");

class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            //  <div id="board_wrapper" className="col s12 m8 l6">
            //    <div id="board" className="col m12">
                  <div id="board" className="board">
                    {/*<div id="row_1" className="row">*/}
                        <div id="11" className={this.props.color[0]} data-position="ul">{this.props.boardState[0][1]}
                        </div>
                        <div id="12" className={this.props.color[1]} data-position="up">{this.props.boardState[1][1]}
                        </div>
                        <div id="13" className={this.props.color[2]} data-position="ur">{this.props.boardState[2][1]}
                        </div>
                    {/*</div>
                    <div id="row_2" className="row">*/}
                        <div id="21" className={this.props.color[3]} data-position="le">{this.props.boardState[3][1]}
                        </div>
                        <div id="22" className={this.props.color[4]} data-position="ce">{this.props.boardState[4][1]}
                        </div>
                        <div id="23" className={this.props.color[5]} data-position="ri">{this.props.boardState[5][1]}
                        </div>
                    {/*</div>
                    <div id="row_3" className="row">*/}
                        <div id="31" className={this.props.color[6]} data-position="dl">{this.props.boardState[6][1]}
                        </div>
                        <div id="32" className={this.props.color[7]} data-position="do">{this.props.boardState[7][1]}
                        </div>
                        <div id="33" className={this.props.color[8]} data-position="dr">{this.props.boardState[8][1]}
                        </div>
                    {/*</div>*/}
                </div>
            // </div>
        );
    }
};

module.exports = Board;
