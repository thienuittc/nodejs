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

server.listen(port, function() {
    console.log("App is running on port " + port);
});


web.on("connection",function(socket){
  console.log("ketnoi :" + socket.id);
  web.sockets.emit("Server-send-data", "ket noi : "+ socket.id);
web.on("disconnect",function(){
    web.sockets.emit("Server-send-data","ngat ket noi : "+socket.id);
  })

})

app.get("/",function(req,res) {
  res.render("trangchu");
})
