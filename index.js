var express = require("express");
var app = express();
app.use(express.static("./public"));
app.use(express.static("./socket.io-client"));				// Có thể truy cập các file trong node_modules/socket.io-client từ xa
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3484;
var webapp_nsp = io.of('/webapp');				//namespace của webapp
var esp8266_nsp = io.of('/esp8266');				//namespace của esp8266
var middleware = require('socketio-wildcard')();		//Để có thể bắt toàn bộ lệnh!
esp8266_nsp.use(middleware);									//Khi esp8266 emit bất kỳ lệnh gì lên thì sẽ bị bắt
webapp_nsp.use(middleware);									//Khi webapp emit bất kỳ lệnh gì lên thì sẽ bị bắt
server.listen(port, function() {
    console.log("App is running on port " + port);
});
function ParseJson(jsondata) {
    try {
        return JSON.parse(jsondata);
    } catch (error) {
        return null;
    }
}
//database


var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://dbCaulong:31011997@cluster0-y6pqx.mongodb.net/admin?retryWrites=true&w=majority")
//mongoose.Promise = global.Promise;
 var db= mongoose.connection;
 db.on('erro',console.error.bind(console,' mongodb error :'));

var userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

var user = mongoose.model('user',userSchema);



//Bắt các sự kiện khi esp8266 kết nối
esp8266_nsp.on('connection', function(socket) {
	console.log('esp8266 connected');
  var mes = new user({
    name : "thien",
    age : 15
  })
  webapp_nsp.emit("Server-send-data",socket.id);

	socket.on('disconnect', function() {
		console.log("Disconnect socket esp8266");
	})

	//nhận được bất cứ lệnh nào
	socket.on("*", function(packet) {
		console.log("esp8266 rev and send to webapp packet: ", packet.data) //in ra để debug
		var eventName = packet.data[0]
		var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
		webapp_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến webapp
	})
})

//Bắt các sự kiện khi webapp kết nối

webapp_nsp.on('connection', function(socket) {
	console.log('webapp connected')
	//Khi webapp socket bị mất kết nối
	socket.on('disconnect', function() {
		console.log("Disconnect socket webapp")
	})

	socket.on('*', function(packet) {
		console.log("webapp rev and send to esp8266 packet: ", packet.data) //in ra để debug
		var eventName = packet.data[0]
		var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
		esp8266_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến esp8266
	});
})

app.get("/",function(req,res) {
res.render("trangchu");
})
