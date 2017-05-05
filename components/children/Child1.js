// Include React
var React = require("react");

class Child1 extends React.Component {
//var Child1 = React.createClass({
  render() {
    return (
      <div className="container">
        <div className="col-lg-12">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Child #1</h3>
            </div>
            <div className="panel-body">

              <p>
                <a href="#/Child1/GrandChild1" className="btn btn-warning btn-sm">Show Grandchild #1></a>
                <a href="#/Child1/GrandChild2" className="btn btn-success btn-sm">Show Grandchild #2></a>
              </p>

              {/* This code will allow us to automatically dump the correct GrandChild component */}
              {this.props.children}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

module.exports = Child1;
