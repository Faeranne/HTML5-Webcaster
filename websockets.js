var sys = require("sys"),
    ws = require("./ws.js");

var clients = [];

ws.createServer(
	function (websocket) {

		clients.push(websocket);

		websocket.addListener("connect", function (resource) {
			// emitted after handshake
			sys.debug("connect: " + resource);
		}).addListener("data", function (data) {

		// handle incoming data
		// send data to ALL clients whenever ANY client send up data
		for (var i = 0 ; i < clients.length ; i ++ ) {
			clients[i].write(data);
		}

    }).addListener("close", function () {

		// emitted when server or client closes connection
		sys.debug("close");
    });
  }).listen(8080);

  sys.debug("Listening on port 8080");
