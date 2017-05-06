// Include React
var React = require("react");

var helpers = require("./utils/helpers");

var router = require("react-router");

var hashHistory = router.hashHistory;

//import { hashHistory } from '../config/routes';

//class Login extends React.Component {
var Login = React.createClass({

  getInitialState: function(props) {
    return {
      username: "",
      password: ""
    };
  },

  handleChangeUsername: function(event) {
    this.setState({ username: event.target.value });
  },

  handleChangePassword: function(event) {
    this.setState({ password: event.target.value });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var _this = this;

    helpers.authenticate(
      this.state.username,
      this.state.password
    ).then(function(response) {
      //if(data.user != '') {
      //console.log(response.data.login + ' - ' + response.data.id);
        hashHistory.push({
          pathname: '/game',
          state: {
            login: response.data.login,
            id: response.data.id
          }
        });
      /*} else {
        hashHistory.push('/');
      }*/
    }/*.bind(this)*/);
  },

  render() {
    return (
      <div className="container">
          <div className="signup-title">
              <h1 className="sl-form text-orange text-120 outline-yellow">Triple Duel</h1>
              <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <label className="sl-label text-yellow text-20">Username</label>
                      <input type="text" className="sl-input form-control" id="username" name="username" onChange={this.handleChangeUsername} />
                  </div>
                  <div className="form-group">
                      <label className="sl-label text-yellow text-20">Password</label>
                      <input type="password" className="sl-input form-control" id="password" name="password" onChange={this.handleChangePassword} />
                  </div>
                  <div className="form-group">
                      <label className="sl-label text-yellow text-20"></label>
                      <input type="checkbox" className="sl-input form-control" name="remember" value="yes" />
                  </div>

                  <button type="submit" className="waves-effect waves-light orange btn login-button">Login</button>
              </form>
              <hr />
              {/*<p className="text-yellow">Need an account? <a href="/signup">Signup</a></p>*/}
          </div>
      </div>
    );
  }
});

module.exports = Login;
