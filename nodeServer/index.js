// Node server which will handle socket io connection 
const io=require('socket.io')(8000,{
    cors:{
        origin:'http://127.0.0.1:5500',
        methods:["GET","POST"]
    }
});

const users={};

// events 
const EVENTS={
    NEW_USER_JOINED:'new-user-joined',
    USER_JOINED:'user-joined',
    SEND:'send',
    RECEIVE:'receive',
    DISCONNECT:'disconnect'
};

io.on('connection',(socket)=>{
    // if any new user joins,let other users connected to the server know ! 
    socket.on(EVENTS.NEW_USER_JOINED,(name)=>{
        users[socket.id]=name;

        socket.broadcast.emit(EVENTS.USER_JOINED,name)
    })

    // if someone sends a message,broadcast it to other people 
    socket.on(EVENTS.SEND,(message)=>{
        socket.broadcast.emit(EVENTS.RECEIVE,{message:message,name:users[socket.id]})
    })

    // if someone leaves the chat ,let others know 
    socket.on(EVENTS.DISCONNECT,()=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})