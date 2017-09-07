const express = require('express');
const mysql = require('mysql');
var path = require('path');

const multiparty = require("multiparty");

var formidable = require("formidable");

var multer = require('multer');
var upload = multer({ dest: 'public/' });

var mutipart = require('connect-multiparty');
var mutipartMiddeware = mutipart();
const server = express();
server.use(mutipart({ uploadDir: './linshi' }));

var fs = require("fs");
// const common = require('../libs/common');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student'
});

module.exports = () => {
    const route = express.Router();
    const getHomeStr = `SELECT id,name,pwd FROM user`;
    const getCateNames = `SELECT id,name,pwd FROM user`;
    //get homePage datas

    route.get('/home', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('content-type', 'application/json');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ');
        res.header("Content-Type", "application/json;charset=utf-8");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');


        getHomeDatas(getHomeStr, res);
        //  res.send("data");
    });

    function getHomeDatas(getHomeStr, res) {
        db.query(getHomeStr, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('database err').end();
            } else {
                if (data.length == 0) {
                    res.status(500).send('no datas').end();
                } else {
                    res.send({
                        "data": data,
                        "msg": "success",
                        "methods": "get"
                    });
                    //res.end(JSON.stringify(data));
                }
            }
        });
    } // home end

    route.post("/login", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        //res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        var response = {
                "user": req.body.username,
                "pwd": req.body.userpwd
            }
            // res.end(JSON.stringify(response));
        var loginst = {
            "user": "admin",
            "pwd": "123456"
        }
        isLogin(response, res)
    })

    function isLogin(loginstr, res) {
        const userdata = `SELECT name,pwd FROM user`;

        db.query(userdata, (error, data) => {
            if (error) {
                return res.send("error")
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (loginstr.user == data[i].name && loginstr.pwd == data[i].pwd) {
                        return res.send({
                            "data": { "user": loginstr.user, "pwd": loginstr.pwd },
                            "msg": "success"
                        })
                    } else {
                        return res.send({ "msg": "error" })

                    }

                }
            }

        })
    } // end

    route.post('/upload', upload.single('pics'), function(req, res) {
        var file = req.fieldname;
        console.log(file);
        res.contentType('json'); //返回的数据类型 
        // 获得文件的临时路径
        //var tmp_path = req.files.thumbnail.path;
        res.send(JSON.stringify({
            status: "success",
            "body": req.body.pics,


        })); //给客户端返回一个json格式的数据 


    });

    // 单图上传

    route.post('/busboyload', function(req, res, next) {
        var uploadDir = "public/";
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.uploadDir = uploadDir;
        form.extensions = true;
        form.maxFieldsSize = 200 * 1024 * 1024;
        form.parse(req, function(err, fields, files) {
            var picname = files.pics.name;
            var oldpath = path.normalize(files.pics.path); //返回正确格式的路径
            var uploadDir = "public/" + picname;
            fs.rename(files.pics.path, uploadDir, function(err) {
                if (err) {
                    res.end();
                }
                // res.write("<img src='/upload/" + fName + "' />");
                res.send({
                    msg: "1"
                });
                res.end();
            });

        });

    });































    return route;
}