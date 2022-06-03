const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const username = require('username-generator')
const path = require('path')
const { AwakeHeroku } = require('awake-heroku');



app.use(express.static('./client/build'));

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "client","build","index.html"));
})

const users={}

io.on('connection', socket => {
    //generate username against a socket connection and store it
    const userid=username.generateUsername('-')
     
    //send back username
    socket.emit('socket_id', socket.id)
    socket.emit('yourID', userid)
    io.sockets.emit('allUsers', users)
    
    socket.on('disconnect', ()=>{
        delete users[userid]
    })
    socket.on('callUser', (data)=>{
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall', (data)=>{
        io.to(data.to).emit('callAccepted', data.signal)
    })

    socket.on('close', (data)=>{
        io.to(data.to).emit('close')
    })

    socket.on('rejected', (data)=>{
        io.to(data.to).emit('rejected')
    })
    socket.on('socket_id_reciever', (data)=>{
        console.log('socket_id_reciever')
        io.sockets.emit("socket_id_reciever",data);
    })


    socket.on('video_call_going', (data)=>{
        console.log('ok')
        io.sockets.emit("recieve_message",data);
    })
    socket.on('please_send_stream', (data)=>{
        console.log('ok')
        io.sockets.emit("please_send_stream",data);
    })

    socket.on('my_stream', (data)=>{
        console.log('ok')
        io.sockets.emit("video_stream",data);
    })

    socket.on('callUser1', (data)=>{
        io.to(data.toSocketID).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall1', (data)=>{
        io.sockets.emit('callAccepted', data)
    })

    socket.on('close1', (data)=>{
        io.to(data.to).emit('close')
    })

    socket.on('rejected1', (data)=>{
        io.to(data.to).emit('rejected')
    })

    
})

const port = process.env.PORT || 8000

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})