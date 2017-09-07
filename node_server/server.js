const express = require('express');
const bodyParser = require('body-parser');
// const indexhtml = require("./index.html");
// const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const mysql = require('mysql');
const server = express();
const path = require('path')
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

//server.use(express.bodyParser());

/*
server.all('/', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    console.log(req)
    res.sendFile(__dirname + "/" + "index.html");
    //return next()
})
*/
const busboy = require('connect-busboy');
server.use(busboy());


server.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        req.method == "OPTIONS" ? res.send(200) : next()

        //res.sendFile(__dirname + "/" + "index.html");
        //return next()
    })
    //server.use(express.static(__dirname))
    //server.use(express.static('public'));
    // server.use(express.static("static"));
    //server.use(express.static(__dirname + "/static"));
server.use('/static', express.static(path.join(__dirname, 'static')));
server.use('/public', express.static(path.join(__dirname, 'public')));

console.log(__dirname + "/static")
server.all("/", (req, res) => {
    res.sendFile(__dirname + "/" + "index.html")
})

// server.use(express.static(path.join(__dirname, 'dist')))


server.listen(3333, () => {
    //var host = server.address()
    console.log("正在监听3333端口");
});



//deal (cookie,session)
/*(() => {
    server.use(cookieParser());
    let keyArr = [];
    for (let i = 0; i < 100000; i++) {
        keyArr[i] = "xsa_" + Math.random() * 100 + i;
    }
    server.use(cookieSession({
        name: "hc",
        keys: keyArr,
        maxAge: 30 * 60 * 1000
    }))
})();*/


//deal router
server.use('/', require('./route/index.js')());