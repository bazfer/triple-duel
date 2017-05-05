// Include React
var React = require("react");

class Signup extends React.Component {
  render() {
    return (
      <div className="container">
        	<div className="signup-title">
              <h1 className="sl-form text-orange text-120 outline-yellow">Triple Duel</h1>
          		<form action="/signup" method="post">
            			<div id='input-name' className="form-group">
              				<label className="sl-label text-yellow text-20">Name</label>
              				<input type="text" className="sl-input form-control" name="name" />
            			</div>
            			<div id='input-email' className="form-group">
              				<label className="sl-label text-yellow text-20">Email</label>
              				<input type="text" className="sl-input form-control" name="email" />
            			</div>
            			<div className="form-group">
              				<label className="sl-label text-yellow text-20">Username</label>
              				<input type="text" className="sl-input form-control" name="username" />
            			</div>
            			<div className="form-group">
              				<label className="sl-label text-yellow text-20">Password</label>
              				<input type="password" className="sl-input form-control" name="password" />
            			</div>
            			<button type="submit" className="waves-effect waves-light orange btn login-button">Signup</button>
          		</form>
          		<hr />
          		<p className="text-yellow">Already have an account? <a href="/login">Login</a></p>

        	</div>
      </div>
    );
  }
};

module.exports = Signup;
