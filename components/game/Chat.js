// Include React
var React = require("react");

// production
const socket = io.connect('https://triple-duel.herokuapp.com/');
// backup
// const socket = io.connect('https://triple-duel-backup.herokuapp.com/');
// local
// socket = io.connect('http://localhost:8080');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    console.log('HERE', props);
  }

  // componentDidMount() {
  //   var _this = this;
  //   socket.on('chat_update', function(login, text, time) {
  //     var msg = _this.state.msgs;
  //     msg.push(<li><strong>{login}</strong> ({time})<br />{text}</li>);
  //     _this.setState({msgs: msg});
  //   });
  // }

  // handleKeyPress(event) {
  //   if (event.key === 'Enter') {
  //     /*var msg = this.state.msgs;
  //     msg.push(<li><strong>{this.props.login}</strong> ({time})<br />{event.target.value}</li>);
  //     this.setState({msgs: msg});*/
  //     socket.emit('chat', this.props.login, event.target.value, this.props.roomname + ' chat');
  //     event.target.value = '';
  //     console.log(this.props.roomname + ' chat');
  //   }
  // }

  render() {
    return (
      <div id="chat_wrapper" className="chat-box">
        <ul id="chat" className='chat'>{this.props.msgs}</ul>
        
          <input type="text" 
                id="chat_text" 
                className='chat-input' 
                placeholder="Type text..." 
                onKeyPress={this.props.handleKeyPress.bind(this)}/>
        
      </div>
    );
  }
};

module.exports = Chat;
