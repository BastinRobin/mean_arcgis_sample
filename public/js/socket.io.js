var server = io()
setTimeout(function(){
    server.emit("2", {
        x1: -120,
        y1: 43,
        x2: -110,
        y2: 50
    })
}, 2000)
server.on("2", function(msg) {
    for (var i = msg.length - 1; i != -1; i-=1) {
        console.log(msg[i])
    }
})