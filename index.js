//const app = require('express')();
// ECMAscript 6: pretty much is the same as
var express = require('express');    
const app = express();


const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/index2', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
});

app.get('/style', (req, res) => {
    res.sendFile(__dirname + '/public/style.css');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

app.use(express.static('mascot'));


// tech namespace
// each namespace create seperate room
const tech = io.of('/tech');
tech.on('connection', (socket) => {
    

    socket.on('join', (data) =>{
        socket.join(data.room);
        socket.username = data.userName;
        socket.room = data.room;
        console.log(`${socket.username} has connected to ${data.room}`);
        var message = new Object;
        message.msg = `${data.userName} joined ${data.room} room!`
        message.room = data.room;
        tech.in(data.room).emit('message', message);
    })

    socket.on('message', (data) =>{
        console.log(`message from ${data.msg.user}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', ()=> {
        var connectionMessage = socket.username + " has disconnected";
        console.log(connectionMessage);
        tech.in(socket.room).emit('message', `${socket.username} left the room!`);
        socket.leaveAll();

    });
        
 });
