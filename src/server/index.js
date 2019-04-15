const serve = require('koa-static-server')
var koa = require('koa')
var app = new (koa)()
var http = require('http')
 
app.use(serve({rootDir: 'public'}))


app.use(function* (next) {
  if (this.path !== '/') return yield next
})
 
var server = http.createServer(app.callback())
 

var io = require('socket.io')(server)
var activeroom = null
var usernames = []
io.on('connection', function (socket) {
  socket.on('login', function ({ username, room } ) {
    console.log(`[server] login: ${username + ' -> ' + room}`)
    usernames.push(username)
    socket.join(room)
    activeroom = room 
    socket.username = username
    socket.emit('users.login', { username, room })
  })

  socket.on('message', function ({text}) {
    console.log(`[server] message: ${text}`)
    const message = {
      text,
      username: socket.username,
      room: activeroom,
    }
    io.to(activeroom).emit('messages.new', {message})
  })

  socket.on('logout', function ({username}) {
    if (username) {
      console.log(`[server] logout: ${username}`)
      usernames = usernames.filter(u => u !== username)
      io.to(activeroom).emit('users.logout', { username })
      socket.leave(activeroom)
    }
  })

  socket.on('switchRoom', function ({username}){
    if(username){
      console.log(`[server] Left the room: ${username}`)
      usernames = usernames.filter(u => u !== username)
      socket.leave(activeroom)
      usernames.push(username)
      findRooms()
    }
  })

  function findRooms() {
    var availableRooms = []
    var rooms = io.sockets.adapter.rooms
    if (rooms) {
        for (var room in rooms) {
            if (!rooms[room].hasOwnProperty(room)) {
              if (room.slice(0,2)=='/#') continue
              availableRooms.push({name:room, counts:io.sockets.adapter.rooms[room].length})
            }
        }
    }
    return availableRooms
  }
  socket.on('rooms',function() {
    var rooms = findRooms()
    io.emit('rooms.list', { rooms: rooms })
  })

})

var port = process.env.PORT || 3000
server.listen(port)