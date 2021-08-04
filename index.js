const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 80;

const server = app.listen(port, () => {
    console.clear();
    console.log('\x1b[33m%s\x1b[0m', "Server Started.");
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log("Ip Link:", '\x1b[36m', 'http://'+ add + ":" + port +"/",'\x1b[0m');
        console.log("Localhost Link:", '\x1b[36m', 'http://localhost:' + port +"/",'\x1b[0m');

        var url = 'http://localhost:'+port;
        var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
        require('child_process').exec(start + ' ' + url);
    });
});

app.use(bodyParser.json());
 
app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/");
});




/* var io = require("socket.io")({
    'port': port,
    'heartbeat interval': 2000,
    'heartbeat timeout' : 3000
});
io.listen(server);

var app_socket = io.of('/');
app_socket.on('connection', function(socket) {

    // connected

    socket.on('disconnect', function(){
        // Disconnected
    });
}); */