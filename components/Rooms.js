// Include React
var React = require("react");

// production
// const socket = io.connect('http://triple-duel.herokuapp.com');
// backup
const socket = io.connect('https://triple-duel-backup.herokuapp.com/');
// local
//var socket = io.connect('http://localhost:8080');

class Hand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            disable: false
        }
    }

    componentDidMount() {
        var _this = this;

        socket.on('updaterooms', function(rooms) {
            _this.setState({rooms: '', disable: false});
            if (_this.props.mainState.player !== 0) {
                _this.setState({disable: true});
            }
            var r;
            var room_name;
            var build_rooms = [];
            for (var i = 0; i < rooms.length; i++) {
                r = rooms[i].name.split(' ');
                room_name = rooms[i].name;
                if (rooms[i].owner_login == _this.props.mainState.login) {
                    _this.setState({disable: true});
                    build_rooms[i] = (

                        <li className="room-button room-owner text-yellow">
                            {/*<button type="submit" value={room_name}>{r[0]}<br/>{r[1]}<br/>{r[2]}<br/>{r[3]}</button>*/}
                            <button type="button">{r[0].slice(0,3)}</button>
                        </li>

                    );
                } else if (/*rooms[i].guest_id == id || */_this.props.mainState.player !== 0) {
                    _this.setState({disable: true});
                    build_rooms[i] = (

                        <li className="room-button room-guest text-blue" >
                            {/*<button type="submit" value={room_name}>{r[0]}<br/>{r[1]}<br/>{r[2]}<br/>{r[3]}</button>*/}
                            <button type="button">{r[0].slice(0,3)}</button>
                            </li>

                    );
                } else if(_this.props.mainState.player === 0) {
                    build_rooms[i] = (
                        <li className="room-button room-guest text-orange">
                            <button type="submit"  value={room_name} onClick={_this.props.handleClickRoom.bind(this)} data-roomname={room_name}>{r[0].slice(0,3)}</button>
                        </li>
                    );
                }
            }

            _this.setState({rooms: build_rooms});
        });
    }

    /*handleClickRoom(room_name) {
    console.log('Room name: ' + room_name);

    socket.emit('enterroom', this.props.id, this.props.login, room_name);
    socket.emit('loadrooms');
  }*/

  renderNewRoom() {
		return (
			<li
				key='newRoom'
				className='room-button text-yellow'
				/* add onClick */>
				<button
                    id="new_room"
                    onClick={this.props.handleClick}
                    disabled={this.state.disable}>
                        <i className='material-icons icon-yellow plus-icon'>add</i>
                </button>
				<div className='room-status'>New Game</div>
			</li>
		);
	}

    render() {
        return (
            <div className="rooms-bar">
                <ul className='dynamic-rooms rooms'>
                    {this.renderNewRoom()}
                    {this.state.rooms}
                </ul>
            </div>
        );
    }
};

module.exports = Hand;
