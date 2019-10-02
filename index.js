var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 8000;
var esp8266 = io.of('/esp8266');
var web = io.of('/web');
var middleware = require('socketio-wildcard')();
esp8266.use(middleware);
web.use(middleware);
server.listen(port, function() {
    console.log("App is running on port " + port);
});


esp8266.on("connection",function(socket){
  console.log("ketnoi :" + socket.id);
  web.sockets.emit("Server-send-data", "ket noi : "+ socket.id);
esp8266.on("disconnect",function(){
    web.sockets.emit("Server-send-data","ngat ket noi : "+socket.id);
  })

})

app.get("/",function(req,res) {
  res.render("trangchu");
})
