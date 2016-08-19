var server = io()
setTimeout(function(){
    server.emit("1", "leave me here")
}, 2000)
server.on("2", function(msg) {
    alert(msg)
})