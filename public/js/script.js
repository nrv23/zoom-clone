const socket = io('/'); // se le pasa la direccion del servidor donde se va conectar, al ser el mismo servidor,tanto para backend como frontend entonces se le pasa / porque es el la ruta root del servidor,
// de otra forma se pasaria una url con protocolo ws
const peer = new Peer(undefined,{
    path: '/peerjs', // esta ruta se asigna en el backend,
    host: '/', //el host donde va enviar la informacion
    port: '3030' // puerto donde escucha el backend
});
const div = document.getElementById("video-grid");
const miVideo = document.createElement("video");
miVideo.muted = true; // esta propiedad indica que si el muted esta en true entonces el video no tiene audio
// de lo contario seria false
let videoStream = null;
navigator.mediaDevices.getUserMedia({ // obtener la funcionalidades del navegador para audio y video
    video: true, // al darle true me permite mostrar el video de mi camara, de lo contrario seria false
    audio: true // al darle true me permite compartir el audio de mi camara, de lo contrario seeria false
    // retorna una promesa
}).then(stream => {
    videoStream = stream;
    agregarVideoStream(miVideo,stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on('stream',userVideoStream => { // cuando reciba una transmisión de video, carga eso y llama la funcion de agregar 
            // la etiqueta de video al html
            agregarVideoStream(video,userVideoStream);
        })
    })

    socket.on('new-user',userId => { // el id del usuario conectado es lo que emite el socket en el servidor al generarse 
        connectToNewUser(userId,stream)
    })

    let msg = $('input');

    $('html').keydown((e) => { // escuchar cuando se teclea algo 
        if(e.which == 13 && msg.val().length !== 0){ // which es el codigo de la tecla, 13 es enter
            // si presiona enter y el campo input tiene al menos un caracter entonces
            // va emitir en el evento socket un mensaje
            socket.emit('message', msg.val());
            msg.val("");
        }
    }) 


    socket.on('createMessage', message => {
        console.log(message);
        $('.messages').append(`<li class="message"><b>user: </b>${message}</li>`);
    })
})

peer.on('open', id => { // el id es generado automaticamente
    // evento cuando se abre la conexion de peer

    socket.emit('join-room', // este evento emite un payload al socket que esta escuchando en el servidor
        ROOM_ID, // esto es el payload que llega al servidor
        id
    );

})

const connectToNewUser = (userId,stream) => { 
    console.log("new user",userId);

    const call = peer.call(userId,stream);
    const video = document.createElement("video");
    call.on('stream',userVideoStream => { // cuando reciba una transmisión de video, carga eso y llama la funcion de agregar 
        // la etiqueta de video al html
        agregarVideoStream(video,userVideoStream);
    })
}


const agregarVideoStream = (videoTag, stream) => {
    // recibe la instancia de la etioqueta HTML video y el stream donde se esta guardando el stream del video
    videoTag.srcObject = stream;
    videoTag.addEventListener('loadedmetadata', () => { // cuando ya el stream del video este cargado
        videoTag.play();  // reproducir video
    })
    div.append(videoTag);
}


