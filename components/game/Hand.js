// Include React
var React = require("react");

class Hand extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="hand" className="hand">
                {this.props.mainState}
            </div>
        );
    }
};

module.exports = Hand;
