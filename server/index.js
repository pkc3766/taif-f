const express = require('express')
const readLastLines = require('read-last-lines');
const fs = require('fs')
const logFilePath = './logs.txt'
const app = express()
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );
http.listen(8080, "127.0.0.1");
const port = 3000

// setting up templating engine
app.set('views', 'views');
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  // triggers everytime logs.txt is changed
  console.log('user connected')
  fs.watch(logFilePath, { interval: 1000 }, (eventType, filename) => {
    // file changed
    if(eventType == 'change')
    {
      // read the last 10 lines of file
      //TODO re-reading of lines occurs if file contains less than 10 lines
      readLastLines.read(logFilePath, 10)
      .then((lines) => {
        socket.emit("log changes",{'logs':lines})
      });  
    }
  });

});





app.get('/', (req, res) => {
  res.send('Welcome to logs monitor.')
})

app.get('/log', (req, res) => {
  res.render('logs')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})