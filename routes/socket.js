var db = require("../models");

var rules = [];
rules.push(['ul_up','up_ur','le_ce','ce_ri','dl_do','do_dr']); // left x right
rules.push(['up_ul','ur_up','ce_le','ri_ce','do_dl','dr_do']); // right x left
rules.push(['ul_le','up_ce','ur_ri','le_dl','ce_do','ri_dr']); // up x down
rules.push(['le_ul','ce_up','ri_ur','dl_le','do_ce','dr_ri']); // down x up

module.exports = function(io) {

    io.sockets.on('connection', function (socket) {

        socket.on('loadrooms', function() {
            db.Room.findAll({
                where: {
                    winner: 0,
                    guest: 0
                },
                include: [db.User]
            }).then(function(result) {
                var arr_rooms = [];
                for(var i=0;i<result.length;i++) {
                    arr_rooms.push({
                        name: result[i].dataValues.name,
                        id: result[i].dataValues.id,
                        guest_id: result[i].dataValues.guest,
                        owner_login: result[i].dataValues.User.login
                    });
                }

                socket.emit('updaterooms', arr_rooms);
                socket.broadcast.emit('updaterooms', arr_rooms);
            });
        });

        socket.on('createroom', function(id, login) {
            console.log(login);
            var d = new Date();
            var r_name = login + ' ' + (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds();
            db.Room.create({
                UserId: id,
                name: r_name
            }).then(function(result) {
                var room_name = result.name;
                socket.username = login;
                socket.room = room_name;
                socket.join(room_name);

                socket.username = login;
                socket.room = room_name + ' chat';
                socket.join(room_name + ' chat');
            });
        });

        socket.on('enterroom', function(id, login, room_name) {
            var n_users = io.sockets.adapter.rooms[room_name].length;

            if(n_users < 2) {
                db.Room.findOne({ where: {
                   name: room_name
                }}).then(function(result_room) {
                    db.Room.update({
                        guest: id
                    }, {
                        where: {
                            id: result_room.id
                        }
                    }).then(function(result_updt) {
                        db.Cards.findAll({}).then(function(result) {
                            var h1 = [];
                            var h2 = [];
                            var brd = [];

                            for(var i=0;i<result.length;i++) {
                                if(i < 5) {
                                    h1.push(result[i].dataValues.powers);
                                } else {
                                    h2.push(result[i].dataValues.powers);
                                }
                            }
                            h1 = JSON.stringify(h1);
                            h2 = JSON.stringify(h2);
                            brd = JSON.stringify(brd);

                            h1 = h1.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");
                            h2 = h2.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");
                            brd = brd.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");

                            db.Ingame.create({
                                hand1: h1,
                                hand2: h2,
                                board: brd,
                                RoomId: result_room.dataValues.id
                            }).then(function(result) {

                                db.Room.update({
                                    winner: -1
                                }, {
                                    where: {
                                        UserId: id,
                                        winner: 0,
                                        guest: 0
                                    }
                                }).then(function(result_updt) {
                                    var plr1 = parseInt(Math.random()*10 + 1) > 5 ? true : false;
                                    var plr2 = plr1 ? false : true;
                                    var owner_login = room_name.split(' ')[0];
                                    socket.username = login;
                                    socket.join(room_name);
                                    socket.emit('game', result.hand1, result.hand2, result.board, 2, plr2, owner_login, false, room_name);
                                    socket.broadcast.to(room_name).emit('game', result.hand1, result.hand2, result.board, 1, plr1, login, false, room_name);

                                    socket.join(room_name + ' chat');
                                });
                            });
                        });
                    });
                });
            } else {
                socket.emit('roomfull', 'This room is already full!');
            }
        });

        socket.on('play', function(h1, h2, board_game, room_name, id, login, index, player, plr_turn) {
            if(plr_turn) {
                var card = board_game[board_game.length-1];
                var pos;
                switch (card.pos) {
                    case 'ul':
                        pos = ['up','le'];
                        break;
                    case 'up':
                        pos = ['ul','ce','ur'];
                        break;
                    case 'ur':
                        pos = ['up','ri'];
                        break;
                    case 'le':
                        pos = ['ul','ce','dl'];
                        break;
                    case 'ce':
                        pos = ['up','le','ri','do'];
                        break;
                    case 'ri':
                        pos = ['ur','ce','dr'];
                        break;
                    case 'dl':
                        pos = ['le','do'];
                        break;
                    case 'do':
                        pos = ['dl','ce','dr'];
                        break;
                    case 'dr':
                        pos = ['do','ri'];
                        break;
                }

                var arr = board_game;
                var position;
                var rule;
                for(var i=0;i<arr.length-1;i++) {
                    var index_arr = pos.indexOf(arr[i].pos);
                    if(index_arr != -1) {
                        position = card.pos + '_' + pos[index_arr];
                        for(var j=0;j<rules.length;j++) {
                            rule = rules[j].indexOf(position);
                            if(rule != -1) {
                                switch (j) {
                                    case 0:
                                        if(card.right - arr[i].left > 0 && card.owner != arr[i].owner) {
                                            arr[i].owner = card.owner;
                                            arr[i].color = card.color;
                                        }
                                        break;
                                    case 1:
                                        if(card.left - arr[i].right > 0 && card.owner != arr[i].owner) {
                                            arr[i].owner = card.owner;
                                            arr[i].color = card.color;
                                        }
                                        break;
                                    case 2:
                                        if(card.down - arr[i].up > 0 && card.owner != arr[i].owner) {
                                            arr[i].owner = card.owner;
                                            arr[i].color = card.color;
                                        }
                                        break;
                                    case 3:
                                        if(card.up - arr[i].down > 0 && card.owner != arr[i].owner) {
                                            arr[i].owner = card.owner;
                                            arr[i].color = card.color;
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }

                if(player === 1) h1[index] = 0;
                else h2[index] = 0;

                db.Room.findOne({ where: {
                   name: room_name
                }}).then(function(result_room) {
                    h1 = JSON.stringify(h1);
                    h2 = JSON.stringify(h2);
                    arr = JSON.stringify(arr);
                    h1 = h1.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");
                    h2 = h2.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");
                    arr = arr.replace(/\\/g, "").replace(/}","{/g, "},{").replace('["', "[").replace('"]', "]");
                    db.Ingame.create({
                        hand1: h1,
                        hand2: h2,
                        board: arr,
                        RoomId: result_room.dataValues.id
                    }).then(function(result) {
                        var start_game = false;
                        var owner_login = room_name.split(' ')[0];

                        var current_player = player;
                        var opponent_player;
                        if(current_player === 1) opponent_player = 2;
                        else opponent_player = 1;

                        h1 = result.hand1;
                        h2 = result.hand2;
                        board = result.board;
                        arr = JSON.parse(arr);
                        if(arr.length >= 9) {
                            var count1 = 0;
                            var count2 = 0;
                            var player_winner;
                            for(var i=0;i<arr.length;i++) {
                                if(arr[i].owner === 1) count1++;
                                else count2++;
                            }
                            if(count1 > count2) {
                                player_winner = result_room.dataValues.UserId;
                                player_lost = result_room.dataValues.guest;
                            } else {
                                player_winner = result_room.dataValues.guest;
                                player_lost = result_room.dataValues.UserId;
                            }

                            db.User_Record.findOne({
                                UserId: player_winner
                            }).then(function(result) {
                                db.User_Record.update({
                                    wins: result.wins + 1
                                }, {
                                    where: {
                                        UserId: player_winner
                                    }
                                });
                            });

                            db.User_Record.findOne({
                                UserId: player_lost
                            }).then(function(result) {
                                db.User_Record.update({
                                    losses: result.losses + 1
                                }, {
                                    where: {
                                        UserId: player_lost
                                    }
                                });
                            });

                            db.Room.update({
                                winner: player_winner
                            }, {
                                where: {
                                    id: result_room.dataValues.id
                                }
                            }).then(function(result_updt) {
                                socket.emit('game', h1, h2, board, current_player, false, owner_login, player_winner, room_name);
                                socket.broadcast.to(room_name).emit('game', h1, h2, board, opponent_player, true, login, player_winner, room_name);
                                socket.leave(room_name);
                            });
                        } else {
                            socket.emit('game', h1, h2, board, current_player, false, owner_login, false, room_name);
                            socket.broadcast.to(room_name).emit('game', h1, h2, board, opponent_player, true, login, false, room_name);
                        }
                    });
                });
            } else {
                board_game.pop();
                socket.emit('game', JSON.stringify(h1), JSON.stringify(h2), JSON.stringify(board_game), player, false, '', false, room_name);
            }
        });

        socket.on('disableCell', function(target, room_name) {
            socket.broadcast.to(room_name).emit('updateDisableCell', target);
        });

        socket.on('autolost', function(id, room_name) {
            db.Room.findOne({ where: {
               name: room_name
            }}).then(function(result_room) {
                var winner;
                var loser;
                if(id == result_room.UserId) {
                    winner = result_room.guest;
                    loser = result_room.UserId;
                } else {
                    winner = result_room.UserId;
                    loser = result_room.guest;
                }

                db.User_Record.findOne({
                    UserId: winner
                }).then(function(result) {
                    db.User_Record.update({
                        wins: result.wins + 1
                    }, {
                        where: {
                            UserId: winner
                        }
                    });
                });

                db.User_Record.findOne({
                    UserId: loser
                }).then(function(result) {
                    db.User_Record.update({
                        disconnects: result.disconnects + 1
                    }, {
                        where: {
                            UserId: loser
                        }
                    });
                });

                db.Room.update({
                    winner: winner
                }, {
                    where: {
                        name: room_name
                    }
                }).then(function(result_updt) {
                    socket.broadcast.to(room_name).emit('autowon');
                    socket.leave(room_name);
                });
            });
        });

        socket.on('chat', function(login, text, room_name) {
            var d = new Date();
            var time = d.getHours() + ':' + d.getMinutes();

            //socket.username = login;
            socket.emit('chat_update', login, text, time);
            //socket.broadcast.emit('chat_update', login, text, time);
            socket.broadcast.to(room_name).emit('chat_update', login, text, time);

            /*var roster = socket.username(room_name);
            roster.forEach(function(username) {
                console.log('Username: ' + username.nickname);
            });*/
        });
    });

};
