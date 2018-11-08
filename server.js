const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const studentapi = require('./server/routes/studentApi');
const port = 3000;

const app = express();

const hostname = require('os-hostname');
const publicIp = require('public-ip');

let host = '34.222.137.103';
/*
hostname(function (err, hname) {
    console.log('hname', hname) ;
    host = hname ;
})
*/
 
publicIp.v4().then(ip => {
    console.log(ip);
    host = ip ;
});

// For CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//app.use(express.static(path.join(__dirname, 'dist')));

/* Added this so we can make the uploads folder available for viewing pictures in iFrame from web application
 */
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

app.use('/studentapi', studentapi);

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
*/
app.listen(port, function(){
    console.log("Server running on http://"+ host+ ":" + port);
});
