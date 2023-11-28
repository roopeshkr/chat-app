const socket=io('http://localhost:8000');

// get DOM elements in a js variable 
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');

// Audio that will play on receiving message 
var audio=new Audio('ting.mp3');

// Function which will apend event info to the container 
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }

}

// Ask users name and let the server know
const userName=prompt("Enter your name to join");
socket.emit('new-user-joined',userName);

// if new user joins ,receive his/her name the event from the server 
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})

// if servers sends a message ,receive it
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left')
})

// if a user leaves the chat ,append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,'right')
})

//if form get submitted,send server message

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value="";
})