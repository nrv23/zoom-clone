const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server,{
    debug: true
});

const routes = require("./routes/");
app.set('view engine','ejs');
app.use('/peerjs', peerServer); // asignarle una url al servidor peer 
app.use(express.static('public')); // esta carpeta debe ser asignada como statica para que ejs la asigne como 
// la carpeta root del cliente
app.use('/', routes());

//const server = http.server(app);
// asignarle la instancia del servidor donde van a correr los sockets
const PORT = process.env.PORT || 3030;

server.listen(PORT || 3030, () => {
    console.log(`SERVIDOR ESCUCHANDO EN PUERTO ${PORT}`);
})
// Eventos del socket

io.on('connection',socket => { //on es un listener que escucha cuando el evento connection notifica
    //que el socket ya esta conectado
    console.log("conectado");
    socket.on('join-room', (room_id,id) => { // escuchar cuando alguien desde el cliente se conecta
        socket.join(room_id); // un usuario se ha unido
        // la variable id es el id del usuario conectado
        socket.to(room_id).broadcast.emit('new-user',id);

        socket.on("message",(message) => {
            io.to(room_id).emit('createMessage', message);
        })
    })
})