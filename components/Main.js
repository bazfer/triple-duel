// Include React
var React = require("react");

var Navbar = require("./Navbar");
var Hand = require("./game/Hand");
var Board = require("./game/Board");
var Chat = require("./game/Chat");
var Rooms = require("./Rooms");
var LittleBoards = require("./LittleBoards");

// production
// const socket = io.connect('http://triple-duel.herokuapp.com');
// backup
const socket = io.connect('https://triple-duel-backup.herokuapp.com/');
// local
// const socket = io.connect('http://localhost:8080');

var Main = React.createClass({
    //class Main extends React.Component {

    getInitialState: function(props) {
        return {
            login: this.props.location.state.login, id: this.props.location.state.id, dragAndDrop: '',
            hand_html: null,
            h1: '',
            h2: '',
            board_game: '',
            board_html: [['ul',''],['up',''],['ur',''],['le',''],['ce',''],['ri',''],['dl',''],['do',''],['dr','']],
            player: 0,
            roomname: '',
            hand: null,
            plr_turn: '',
            //color: ['col m4 cell board pos_ul','col m4 cell board pos_up','col m4 cell board pos_ur','col m4 cell board pos_le','col m4 cell board pos_ce','col m4 cell board pos_ri','col m4 cell board pos_dl','col m4 cell board pos_do','col m4 cell board pos_dr'],
            // replaced by FB on 042617 with
            color: ['cell pos_ul','cell pos_up','cell pos_ur','cell pos_le','cell pos_ce','cell pos_ri','cell pos_dl','cell pos_do','cell pos_dr'],
            // player_vs: '',
            // replaced by FB on 042617 with
            player1: '',
            player2: '',
            little_boards: 0,
            msgs: []
        };
    },

    componentDidMount: function() {
        var _this = this;

        if(_this.state.id == null)
            window.location = '/';

        window.addEventListener("beforeunload", function() {
           if (_this.state.player != 0)
               socket.emit('autolost', _this.state.id, _this.state.roomname);
        });
        // Dragula open
        var dragAndDrop = {
            init: function() {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function() {
                this.dragula.on('drop', this.dropped.bind(this));
            },

            dragula: function() {
                this.dragula = dragula([
                    document.getElementById('11'),
                    document.getElementById('12'),
                    document.getElementById('13'),
                    document.getElementById('21'),
                    document.getElementById('22'),
                    document.getElementById('23'),
                    document.getElementById('31'),
                    document.getElementById('32'),
                    document.getElementById('33'),
                    document.getElementById('hand')
                ], {
                    moves: this.canMove.bind(this),
                    accepts: this.canAccept.bind(this),
                    revertOnSpill: true
                });
            },

            canMove: function() {
                return true;
            },

            canAccept: function() {
                return true;
            },

            disableUsedCell: function(target) {
                //console.log('Element: ' + target);
                let array = this.dragula.containers;
                let indexOfTarget = array.findIndex(element => {
                    return element == target;
                });
                if(indexOfTarget !== -1)
                    array.splice(indexOfTarget, 1);
            },
            // every time a card is attempted to be dropped in a cell and
            dropped: function(el, target) {
                // if the drop target is not 'hand', drops goes thru
                if (target.id != 'hand') {
                    // disable cell from drag n drop
                    this.disableUsedCell(target);
                    // emit action to backend
                    socket.emit('disableCell', target.getAttribute("data-position"), _this.state.roomname);

                    var index = el.getAttribute("data-card");

                    var aux = [];
                    aux = _this.state.board_game;
                    aux.push({
                        pos: target.getAttribute("data-position"),
                        owner: _this.state.player,
                        image_url: _this.state.hand[index].image_url,
                        up: _this.state.hand[index].up,
                        left: _this.state.hand[index].left,
                        right: _this.state.hand[index].right,
                        down: _this.state.hand[index].down
                    });

                    _this.setState({board_game: aux});
                    socket.emit('play', _this.state.h1, _this.state.h2, _this.state.board_game, _this.state.roomname, _this.state.id, _this.state.login, index, _this.state.player, _this.state.plr_turn);
                }
            }

        };

        dragAndDrop.init();

        socket.emit('loadrooms');

        /*socket.on('updateDisableCell', function(target) {
            dragAndDrop.disableUsedCell(document.getElementsByClassName('pos_' + target));
        });*/

        socket.on('game', function(hand1, hand2, board, player_n, turn, opponent, winner, room_name) {
            socket.emit('loadrooms');
            _this.setState({
                h1: JSON.parse(hand1),
                h2: JSON.parse(hand2),
                board_game: JSON.parse(board),
                plr_turn: turn
            });
            if (_this.state.player === 0) {
                if (turn)
                    alert('You start the game!');
                _this.setState({player: player_n});
                //_this.setState({player_vs: _this.state.login + ' x ' + opponent});
                // replaced by FB on 042617 with
                _this.setState({player1: _this.state.login, player2: opponent});

                dragAndDrop.dragula.containers = new Array;
                dragAndDrop.dragula.containers.push(document.getElementById('11'));
                dragAndDrop.dragula.containers.push(document.getElementById('12'));
                dragAndDrop.dragula.containers.push(document.getElementById('13'));
                dragAndDrop.dragula.containers.push(document.getElementById('21'));
                dragAndDrop.dragula.containers.push(document.getElementById('22'));
                dragAndDrop.dragula.containers.push(document.getElementById('23'));
                dragAndDrop.dragula.containers.push(document.getElementById('31'));
                dragAndDrop.dragula.containers.push(document.getElementById('32'));
                dragAndDrop.dragula.containers.push(document.getElementById('33'));
                dragAndDrop.dragula.containers.push(document.getElementById('hand'));
                _this.setState({roomname: room_name});

                var cards = '';
                var color;
                var hand_html = ['', '', '', '', ''];
                //var _class;
                _this.setState({
                    hand: _this.state.player === 1
                        ? _this.state.h1
                        : _this.state.h2
                });
                // roll cards right here
                for (var i = 0; i < 5; i++) {
                    if (_this.state.hand[i] !== 0) {
                        //var _class = "card_wrapper card col m12 c" + _this.state.player;
                        var _class = "card c" + _this.state.player;
                        hand_html[i] = (
                            <div className={_class} data-card={i}>
                                <img className="card-image" src={_this.state.hand[i].image_url}/>
                                <div className='powers'>{_this.state.hand[i].up}</div>
                                <div className='powers'>{_this.state.hand[i].left}</div>
                                <div className='powers'>{_this.state.hand[i].right}</div>
                                <div className='powers'>{_this.state.hand[i].down}</div>
                                
                                {/*<div className="powers">
                                    {_this.state.hand[i].up}<br/>{_this.state.hand[i].left}
                                    + {_this.state.hand[i].right}<br/>{_this.state.hand[i].down}
                                </div>*/}
                                {/*BIG WTF*/}
                                {/*<div className="powers">
                                    <div className="powers-top">{_this.state.hand[i].up}</div>
                                    <div className="powers-middle">
                                        <div>{_this.state.hand[i].left}</div>
                                        <div>{_this.state.hand[i].right}</div>
                                    </div>
                                    <div className="powers-bottom">{_this.state.hand[i].down}</div>
                                </div>*/}
                            </div>
                        );
                    }
                }
                _this.setState({hand_html: hand_html});
            }

            _this.setState({ board_html: [['ul',''],['up',''],['ur',''],['le',''],['ce',''],['ri',''],['dl',''],['do',''],['dr','']] });
            //_this.setState({ color: ['col m4 cell board pos_ul','col m4 cell board pos_up','col m4 cell board pos_ur','col m4 cell board pos_le','col m4 cell board pos_ce','col m4 cell board pos_ri','col m4 cell board pos_dl','col m4 cell board pos_do','col m4 cell board pos_dr'] });
            // replaced by FB on 042617 with
            _this.setState({ color: ['cell pos_ul','cell pos_up','cell pos_ur','cell pos_le','cell pos_ce','cell pos_ri','cell pos_dl','cell pos_do','cell pos_dr'] });
            var board_html = [['ul',''],['up',''],['ur',''],['le',''],['ce',''],['ri',''],['dl',''],['do',''],['dr','']];
            //var color = ['col m4 cell board pos_ul','col m4 cell board pos_up','col m4 cell board pos_ur','col m4 cell board pos_le','col m4 cell board pos_ce','col m4 cell board pos_ri','col m4 cell board pos_dl','col m4 cell board pos_do','col m4 cell board pos_dr'];
            // replaced by FB on 042617 with
            var color = ['cell pos_ul','cell pos_up','cell pos_ur','cell pos_le','cell pos_ce','cell pos_ri','cell pos_dl','cell pos_do','cell pos_dr']
            if (_this.state.board_game.length !== 0) {
                cards = '';
                for (var i = 0; i < _this.state.board_game.length; i++) {
                    for (var j = 0; j < 9; j++) {
                        if (board_html[j][0] == _this.state.board_game[i].pos) {
                            var bcolor = 'color2';
                            if(_this.state.board_game[i].owner == _this.state.player) bcolor = 'color1';
                            color[j] += ' ' + bcolor;
                            var _class = "card_wrapper card c" + _this.state.board_game[i].owner;
                            board_html[j][1] = (
                                <div className={_class} data-card={i}>
                                    <img className="card-image" src={_this.state.board_game[i].image_url}/>
                                    <div className='powers'>{_this.state.board_game[i].up}</div>
                                    <div className='powers'>{_this.state.board_game[i].left}</div>
                                    <div className='powers'>{_this.state.board_game[i].right}</div>
                                    <div className='powers'>{_this.state.board_game[i].down}</div>
                                    
                                    {/*<div className="powers">
                                        {_this.state.hand[i].up}{_this.state.hand[i].left}
                                        {_this.state.hand[i].right}{_this.state.hand[i].down}
                                    </div>*/}
                                    {/*BIG WTF*/}
                                    {/*<div className="powers">
                                        <div className="powers-top">{_this.state.hand[i].up}</div>
                                        <br/>
                                        <div className="powers-middle">
                                            <div>{_this.state.hand[i].left}</div>
                                            <div>{_this.state.hand[i].right}</div>
                                        </div>
                                        <div className="powers-bottom">{_this.state.hand[i].down}</div>
                                    </div>*/}
                                </div>
                            );
                            var disable = document.getElementsByClassName('pos_' + _this.state.board_game[i].pos);
                            dragAndDrop.disableUsedCell(disable[0]);
                            //document.getElementsByClassName('pos_' + _this.state.board_game[i].pos).className += ' color' + _this.state.board_game[i].owner;
                            break;
                        }
                    }
                }
            }
            _this.setState({color: color});
            _this.setState({board_html: board_html});

            if (!turn)
                dragAndDrop.dragula.containers.pop();
            else if (turn && dragAndDrop.dragula.containers.findIndex(element => {
                return element == document.getElementById('hand');
            }) == -1) {
                dragAndDrop.dragula.containers.push(document.getElementById('hand'));
            }

            if (winner !== false && winner == _this.state.id) {
                alert('You WON this match!');
            } else if (winner !== false && winner != _this.state.id) {
                alert('You LOST this match!');
            }

            if(winner !== false) {
                _this.setState({player: 0});
                // _this.setState({player_vs: ''});
                // replaced by FB on 042617 with
                _this.setState({player1: ''});
                _this.setState({player1: ''});
                document.getElementById('hand').innerHTML = '<div></div><div></div><div></div><div></div><div></div>';
                _this.setState({ hand_html: null });
                _this.setState({ board_html: [['ul',''],['up',''],['ur',''],['le',''],['ce',''],['ri',''],['dl',''],['do',''],['dr','']] });
                //_this.setState({ color: ['col m4 cell board pos_ul','col m4 cell board pos_up','col m4 cell board pos_ur','col m4 cell board pos_le','col m4 cell board pos_ce','col m4 cell board pos_ri','col m4 cell board pos_dl','col m4 cell board pos_do','col m4 cell board pos_dr'] });
                // replaced by FB on 042617 with
                _this.setState({color: ['cell pos_ul','cell pos_up','cell pos_ur','cell pos_le','cell pos_ce','cell pos_ri','cell pos_dl','cell pos_do','cell pos_dr']});
            }
    });

    socket.on('chat_update', function(login, text, time) {
            var msg = _this.state.msgs;
            msg.push(<li><strong>{login}</strong> ({time})<br />{text}</li>);
            _this.setState({msgs: msg});
        });

    socket.on('autowon', function() {
           _this.setState({player: 0});
           _this.setState({player_vs: ''});
           document.getElementById('hand').innerHTML = '<div></div><div></div><div></div><div></div><div></div>';
           _this.setState({ hand_html: null });
           _this.setState({ board_html: [['ul',''],['up',''],['ur',''],['le',''],['ce',''],['ri',''],['dl',''],['do',''],['dr','']] });
           _this.setState({ color: ['col m4 cell board pos_ul','col m4 cell board pos_up','col m4 cell board pos_ur','col m4 cell board pos_le','col m4 cell board pos_ce','col m4 cell board pos_ri','col m4 cell board pos_dl','col m4 cell board pos_do','col m4 cell board pos_dr'] });
           socket.emit('loadrooms');
           alert('You WON the game! Your opponent has disconnected.');
       });
    },

    handleClick: function() {
        socket.emit('createroom', this.state.id, this.state.login);
        socket.emit('loadrooms');
    },

    handleClickRoom(event) {
        socket.emit('enterroom', this.state.id, this.state.login, event.target.value);
        socket.emit('loadrooms');
    },

    handleLittleBoards: function() {
        if(this.state.little_boards === 0) {
            this.setState({little_boards: 1});
        } else {
            this.setState({little_boards: 0});
        }
    },

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            socket.emit('chat', this.state.login, event.target.value, this.state.roomname + ' chat');
            event.target.value = '';
        }
    },

    // Here we render the function
    render() {
        if(this.state.little_boards === 0) {
            return (
                <div className="container">
                    {/*<Navbar player_vs={this.state.player_vs} handleLittleBoards={this.handleLittleBoards} />*/}
                    {/*replace by FB on 042617*/}
                    <Navbar player1={this.state.player1} player2={this.state.player2} handleLittleBoards={this.handleLittleBoards} />
                    <div id="main" className="main">
                        <Rooms handleClick={this.handleClick} handleClickRoom={this.handleClickRoom} mainState={this.state}/>
                        <div className='game'>
                            <Hand mainState={this.state.hand_html}/>
                            <Board boardState={this.state.board_html} color={this.state.color}/>
                            <Chat handleKeyPress={this.handleKeyPress} msgs={this.state.msgs}/>
                        </div>
                        <input type="hidden" id="login" value={this.state.login}/>
                        <input type="hidden" id="id" value={this.state.id}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    {/*<Navbar player_vs={this.state.player_vs} handleLittleBoards={this.handleLittleBoards} />*/}
                    {/*replace by FB on 042617*/}
                    <Navbar player1={this.state.player1} player2={this.state.player2} handleLittleBoards={this.handleLittleBoards} />
                    <div id="main" className="main">
                        <Rooms handleClick={this.handleClick} handleClickRoom={this.handleClickRoom} mainState={this.state}/>
                        <LittleBoards />
                        <input type="hidden" id="login" value={this.state.login}/>
                        <input type="hidden" id="id" value={this.state.id}/>
                    </div>
                </div>
            );
        }
    }
});

// Export the componen back for use in other files
module.exports = Main;
