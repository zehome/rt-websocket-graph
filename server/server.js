var connect = require('connect'),
    socketIO = require('socket.io-connect').socketIO;
var MemoryStore = connect.middleware.session.MemoryStore;

var diskstats = require('./diskstats');

server = connect.createServer(
    connect.cookieParser(),
    connect.session({ secret: 'abcd' }),
    connect.static(__dirname + "/html"),
    socketIO( function() { return server; }, function (client, req, res) {
        console.log("[Socket.IO] New connection received: "+req.session.toString());
        
        client.on('message', function(evt)
        {
            var data;
            /* Parse */
            try {
                data = JSON.parse(evt);
            } catch (e) {
                console.error("[Socket.IO] Unable to parse message: " + e);
            }
            /* Handle */
            if (data) 
            {
                if (data.sensor == "diskstats")
                {
                    client.send(JSON.stringify({sensor: data.sensor, disk: data.disk, data: diskstats.linux_get_diskstats([ data.disk ])}));
                } else {
                    console.log("[Socket.IO] received json data: "+data);
                }
            }
        });
    })
);

server.listen(4000);
