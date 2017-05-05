// Include React
var React = require("react");


class Index extends React.Component {


  render() {
    return (
      <div className="container">
          {/*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">*/}
          {/*<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">*/}

          <div className='landing-title'>
            <h3 className='cursive text-beige text-48'> Welcome to</h3>
            <h1 className='text-orange text-120 outline-yellow'> Triple Duel </h1>
            <div className="landing-buttons">
                <a href="#/login" id='btn-1' className="landing-btns waves-effect waves-light orange btn"> Login</a>
                <a href="#/signup" id='btn-2' className="landing-btns waves-effect waves-light orange btn"> Signup</a>
            </div>
            <div className='landing-hand'>
              <div className='card'>
                  {/*<img className='image-card' src={card_01}/>*/}
              </div>
            </div>
        </div>
          
      </div>
    );
  }
};

module.exports = Index;
