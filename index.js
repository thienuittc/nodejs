var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 8000;
server.listen(port, function() {
    console.log("App is running on port " + port);
});

io.on("connection",function(socket){
  console.log("ketnoi :" + socket.id);
  io.sockets.emit("Server-send-data", "ket noi");

})

app.get("/",function(req,res) {
  res.render("trangchu");
})
