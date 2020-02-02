const app = require("express")();
const server = require('http').Server(app);
const io = require ('socket.io')(server);

const bodyParser = require("body-parser");
const user = require("./routes/user");
const InitiateMongoServer = require("./config/db");
const path = require('path');



// Initiate Mongo Server
InitiateMongoServer();


// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, './views'));

app.get("/", (req, res) => {
  //res.json({ message: "API Working" });
  res.sendFile(path.join(__dirname,'/views/index.html'));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/signup.html'));
});



/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

server.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});


//tech namespace
const tech = io.of('/tech');

let msg_id = 0;

tech.on('connection', (socket)=>{
    socket.on('join', (data)=>{
        msg_id += 1;
        socket.join(data.room);
        //tech.in(data.room).emit('message', {msg: `${data.username} joined ${data.room}!`, username: 'system', msg_id: msg_id});
    })
    socket.on('message', (data)=>{
        msg_id += 1;
        tech.in(data.room).emit('message', {msg: data.msg, username: data.username, msg_id: msg_id});
    });
    socket.on('like', (data)=>{
        tech.in(data.room).emit('like', {msg_id: data.msg_id, username: data.username});
    })
    /*socket.on('disconnect', ()=>{
        
        tech.emit('message', 'user disconnect');
    })*/
})