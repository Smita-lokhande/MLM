var ENVCALURL = "";
// var ENVCALURL = "https://dev.calendaree.com:55000"
const https = require('https');
var busboy = require('connect-busboy');
const http = require('http');
const mysql = require('mysql');
const express = require('express');//manage servers and routes
var bodyParser = require('body-parser');
const crypto = require ("crypto");
const session = require('express-session');
const { Console, info, error } = require('console');
const { query } = require('express');
const app=express();
// app.use(bodyParser.json());
var up = bodyParser.urlencoded({ extended: false });
const oneDay = 1000 * 60 * 60 * 24;
const {v4 : uuidv4, validate} = require('uuid');
const multer = require("multer");
const fs = require('fs');
const QRCode = require('qrcode');
const base64ToImage = require('base64-to-image');
const base64ToFile = require('base64-to-file');
const { func } = require('assert-plus');
const { resolve } = require('path');
const { execFileSync } = require('child_process');
const { bashCompletionSpecFromOptions } = require('dashdash');
app.use("/static", express.static("static"));
//app.use(fileUpload());
const port = 55000;
const host = 'localhost';
var stats = ""
app.set('views', './views');
app.set('view engine', 'pug');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const csvtojson = require('csvtojson');

// export const isAuthenticated = async (req, res, next) => {
//     res.set('isAuth', true);
//     next();
// }


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay}
  }))

  app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));

//   secret - a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.

// resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.

// saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.

// cookie: { maxAge: oneDay } - this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.

app.get("/1/login",function(req, res){
    req.session.destroy();
    res.render("login.pug")
})
const tempdocstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./userdata/tempfiles");
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
    },    
    filename: (req, file, cb) => {
        const fileExtension = file.originalname
        req.session.filename = fileExtension
        // console.log(req.session.sessionid+ ' file upload ' + req.session.userid)
        cb(null, req.session.userid+"."+fileExtension.split(".").pop());
    },
})
const uploadtemp = multer({
    storage: tempdocstorage,
    limits: { fileSize: 209715200000}
})

app.get('/getattendanceuser/:filename', (req, res) => {
    fname = "./userdata/download/"+ req.params.filename
    //console.log(fname +" Address")

    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
app.post("/1/fileoperations",uploadtemp.single('image'), async (req,res)=>{

//   app.post("/1/fileoperations",uploadtemp.single('video'), async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
    }else if(req.body.action == 'savefile'){
        console.log("save file -")
        res.send("ok")
    }else if(req.body.action == 'retriveimage'){
        console.log("retriv file -")
        retrivefile(req,res)
    }else if(req.body.action == 'replacefile'){
        console.log("replacefile file -")
        replacefile(req,res)
    }else if(req.body.action == 'deletefile'){
        console.log("delete file -")
        deletefile(req,res)
    }
    else{
        console.log("Wrong Choice")
    }
})

//image trtriv
function retrivefile(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        console.log(sql + " retrive query 123")
        //console.log(result)
        if(err) console.log(err)
        else if(result.length>0){
            if (fs.existsSync("./userdata1/" + nameoftempfol)){
                
            }else{
                fs.mkdir("./userdata1/"+nameoftempfol,{ recursive: true }, function(err){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("New directory successfully created.")
                    }
                })
            }
            try {
                let path = "./userdata1/" + nameoftempfol+"/"
                console.log(path+" retrivefile path")
                let filename1 = result[0].filename
                console.log(filename1 +"122")
                let filename = filename1.split(".")
                //  console.log(filename[0])
                //  console.log(filename[1] )
                var optionalObj = {'fileName': filename[0], 'type': filename[1]};
                base64ToImage(result[0].file,path,optionalObj);
                successfun(filename1)
                console.log(filename1)     
            } catch (error){
                successfun("error")
            }
        }else{
            successfun("No Image")
        }
    })
}
//retrivefile1

function retrivefile1(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    // console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        if(err){
            console.log(err)
        }else if(result.length>0){
            var arr=[];
        arr.push(result[0].filename)
        arr.push(result[0].file)
        arr.push(result[0].file.length)
        successfun(arr);
        }else{
            console.log("file not found")
            successfun("File not Found")
        }
    })
}
// video retriv
// function retrivefile(req,res,fileid1,path1,orgid,successfun){
//     //console.log("123456")
//     var fileid = fileid1
//    // console.log(fileid +"  fileid")
//     var nameoftempfol = path1
//     //console.log(nameoftempfol +" nameoftempfol")
//     let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
//     fcon.query(sql,function(err,result){
//        // console.log(sql)
//         //console.log(result)
//         if(err) console.log(err)
//         else if(result.length>0){
//             if (fs.existsSync("./userdata/" + nameoftempfol)){
                
//             }else{
//                 fs.mkdir("./userdata/"+nameoftempfol,{ recursive: true }, function(err){
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("New directory successfully created.")
//                     }
//                 })
//             }
//             try {
//                 let path = "./userdata/" + nameoftempfol+"/"
//                 // console.log(path+" retrivefile path")
//                 let filename1 = result[0].filename
//                 let filename = filename1.split(".")
//                 //console.log(filename[0] +"")
//                 //console.log(filename[1] +"3333")
//                 var optionalObj = {'fileName': filename[0], 'type': filename[1]};
//                 //console.log(optionalObj.fileName + " " + optionalObj.type +" optionalObj")
//                 // base64ToImage(result[0].file,path,optionalObj);
//                 let obj1 = result[0].file.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
//                 obj1 = obj1.replace(/ /g, '+'); // <--- this is important
//                 fs.writeFile(path+filename1, obj1, 'base64', function(err) {
//                    // console.log(err);
//                 });
//                 //  base64ToFile(result[0].file, path, optionalObj);
//                 // base64ToVideo(result[0].file,path,optionalObj);
//                 successfun(filename1)
//                 //console.log(filename1 +"   *filename1")     
//             } catch (error){
//                 console.log(error)
//                 successfun("error")
//             }
//         }else{
//             successfun("No Image")
//         }
//     })
// }

//---------------------------Update Quote Savefiledb, replace file,deletefile,retrivefile---------------------------
function savefiledb(req,res,orgid,successfun){
    let fileid = uuidv4(); 
    console.log(fileid +" --fileid")
    let success = fileid
    // console.log( success +" succ....")
    // console.log(req.session.filename +"  ..filename")
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error while uploading");
    }
    let fileExtension = req.session.filename.split(".").pop()
   console.log( fileExtension +" ...fileExtension")
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    // console.log(file + " - file ***")
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        // console.log(" - bitmap ***")
        let png = "data:image/"+fileExtension+";base64,"
        // console.log(png + " - png ***")
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
    //    console.log(file +"file -" + png+ +"-png")
        if (!file){
            console.log(" - !file ***")
           return successfun("Please upload a file.");
        }
        var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"','"+req.session.filename+"','"+png+"',now())"
        try{
            fcon.query(sql,function(err,result){
                // console.log(  "......"+sql +" .. fcon  1234567890")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                  return successfun(success);
                }else{
                    return successfun("error while uploading");
                }
            }) 
        } catch (error) {
            return successfun("error while uploading");
        }       
    } 
    else{
       return successfun("error while uploading")
    }
}

function savefiledb1(filename,filecontent, orgid, successfun) {
    let fileid = uuidv4();
    console.log(fileid + " --fileid");
    
    let fileExtension = filename.split(".").pop();
    console.log(fileExtension + " ...fileExtension");

    // Convert file content to base64
    let fileBase64 = filecontent.toString('base64');
    let fileurl = "data:image/" + fileExtension + ";base64," + fileBase64;
    // let fileurl = "data:image/" + fileExtension + ";base64,"; 
    var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"', '"+filename+"', '"+fileurl+"', now())";
    try {
      fcon.query(sql,function (err, result) {
        // console.log("......" + sql + " .. fcon");
        if (err) {
          console.log(err);
          return successfun("error while uploading");
        } else if (result.affectedRows > 0) {
          return successfun(fileid); 
        } else {
          return successfun("error while uploading");
        }
      });
    } catch (error) {
      return successfun("error while uploading");
    }
}


function replacefile(req,res,orgid,fileid,successfun){
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error");
    }    
    let fileExtension = req.session.filename.split(".").pop()
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        let png = "data:image/"+fileExtension+";base64,"
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
        if (!file) {
           successfun("Please upload a file.");
        }
        var sql = "update uploadfile set filename='"+req.session.filename+"', file='"+png+"', date=now() where fileid like'"+fileid+"' and orgid like'"+orgid+"'";
        fcon.query(sql,function(err,result){
            //console.log(sql)
            //console.log(result)
            if(err) console.log(err)
            else if(result.affectedRows>0){
                successfun("Updated")
            }else{
                successfun("error")
            }
        })            
    } 
    else{
        successfun("error")
    }
}

function deletefile(req,res,fileid,orgid,successfun){
    if(fileid == null || fileid == undefined || fileid == '' || fileid === 'undefined' || fileid === 'null'){
        successfun("Please send fileid")
    }else{
        var sql ="delete from uploadfile where orgid like'"+orgid+"' and fileid like '"+fileid+"'";
        fcon.query(sql,function(err,result){
            console.log(sql +" file db delet function")
            if(err) {
                console.log(err)
                successfun("err")
            }else if(result.affectedRows>0){
                successfun("file Deleted")
            }else{
                successfun("File Not Existed")
            }
        })
    }
}

app.post("/1/login",up,(req,res)=>{
    if(req.body.action==="loginbutton"){ 
        // console.log("hello")
        var mobileno=req.body.mobileno;
        var password =req.body.password;
        var sql = "select * from usermaster_t.users where mobile like '"+mobileno+"' and password like '"+password+"'"
        //   console.log(sql)
        mcon.query(sql,function(error, results){
        // console.log(sql+"............")     
        st1 = [];
              if (error) {
                console.log(error)
            } else if (results.length > 0) {
                st1.push(results.name)
                //  console.log(st1)
                req.session.userid = results[0].userid;
                //  console.log(req.session.userid +" userid")
                req.session.username = results[0].name;
                req.session.mobileno = results[0].mobileno;
                req.session.password = results[0].password;
                req.session.email = results[0].email;
                req.session.save();
                res.send("yes")
                // console.log(req.session.userid)
                // console.log(req.session.mobileno +"  mobile n")
                // console.log("save")
            }  else {
                 res.send("Invalid username or password.")
             }
        })
    }else if(req.body.action==="saveregister"){
        var username=req.body.username;
        var mobileno=req.body.mobileno;
        var email=req.body.email;
        var password=req.body.password;
        // var compassword=req.body.compassword;
        var userid=uuidv4();
        var sql = "select * from usermaster_t.users where mobile = '"+mobileno+"'";
        var sql1 = "insert into usermaster_t.users(userid,name,password,mobile,email) values('"+userid+"','"+username+"','"+password+"','"+mobileno+"','"+email+"')"
        mcon.query(sql,function(err,result1){
            //   console.log(sql+"register")
            if(err)console.log(err)
            else if(result1.length>0){
                //console.log(res)
                res.send("User Already Exist")
            }
             else{
                mcon.query(sql1,function(err,result){
                    if(err)console.log(err)
                    else if(result.length>0){
                        //  console.log("not")
                        res.send("error")
                    }else{
                        res.send("save")
                         }
                })
            }
        }) 
    }
})
// app.get("/1/menu", (req, res) => {
//     // console.log("here menu page.....")
//     if(!req.session.userid){
//         // confirm.log("asmi")
//         res.redirect("/1/login")
//     }else if(req.session.userid) {
//         username = req.session.username
//         email = req.session.email
//         mobileno = req.session.mobileno
//         console.log(req.session.mobileno + " - req.session.mobileno")
//         // console.log("showing menu for "+username+" "+email+" "+mobileno+"")
//         //mcon.query("select * from modules where is visible like 'yes'")
//         console.log("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//         res.render("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//     }
// });
app.get("/1/menu", (req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }
    if(req.session.userid) {
        username = req.session.username
        email = req.session.email
        mobile = req.session.mobile
        // console.log("showing menu for "+username+" "+email+" "+mobile)
        mcon.query("select * from modules where isvisible like 'yes'")
        res.render("menu.pug",{user: req.session.userid, username: username});
    }
});
app.get("/1/Calendareemainpage",function(req, res){
    req.session.destroy();
    res.render("Calendareemainpage.pug")
})
app.post("/1/Calendareemainpage",up,async (req,res)=>{
    // if(!req.session.userid){
    //     res.send("sessionexpired")
    //     //res.redirect("/1/login")
    // }
})

//--------------------------------My New Project------------------------------------

//task register
const ucon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranalimu$24',
    database: 'user',
    port: 3306
 });

 const fcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'filesdb_t',
    port: 45203
});


const nmcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'mlm_t',
    port: 45203
})

const mcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'usermaster_t',
    port: 45203
});


app.get('/getmlmlogo/:filename', (req, res) => {
    fname = "./userdata/mlmlogo/"+req.session.orgid+"/"+ req.params.filename
    console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        readStream.pipe(res); 
    }
 });
 app.get('/getgymlogo/:filename', (req, res) => {
    fname = "./userdata/gymlogo/"+req.session.orgid+"/"+ req.params.filename
    console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
       readStream.pipe(res); 
    }
 });

 app.get('/getmlmprofilepic/:filename', (req, res) => {
    fname = "./userdata/mlmprofilepic/"+req.session.orgid+"/"+ req.params.filename
    console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
       readStream.pipe(res); 
    }
 });
 function gettotalsize2(subid,orgid,successfun){
    let sql ="SELECT orgid, sum(LENGTH(file)) / 1024 / 1024 as 'Size' FROM uploadfile where orgid = '"+orgid+"';"
    fcon.query(sql,function(err,result){
        // console.log(sql +"  gettotalsizee2")
        if(err) console.log(err)
        else{
            let filesize= parseFloat(result[0].Size).toFixed(2);
            // console.log(filesize +" filesize")
            var sql1 ="update subscriptions set usedquota="+filesize+" where subscriptionid like'"+subid+"'";
            mcon.query(sql1, function(err,result){
                console.log(sql1 +"   mcon update ")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                    successfun("Successful")                  
                }else{
                    successfun("Failed")
                }
            })
        }
    })
}

//////// M.L.M module ////////////////
app.get("/1/mlm",async(req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }else{
            var admin = 0;
            var started = 0;
            var substatus = 0;
             var orgcolor=" ";
            var sqla="select * from usermaster_t.subscriptions where userid='"+req.session.userid+"' and moduleid='21'";
             console.log("sqla     "+sqla)
            mcon.query(sqla,(err,result)=>{
            if(err) console.log(err)
                else if(result.length>0){
                    admin = 1;
                    req.session.admin = admin
                    req.session.subid = result[0].subscriptionid;
                }else{
                    admin= 0;
                }
                    var sql="select * from mlm_t.orginfo where subscriptionid='"+req.session.subid+"' ";
                   console.log("sql......."+sql)
                    nmcon.query(sql, (err, result)=>{
                    if(err) console.log(err)
                    else if (result.length>0) {
                        console.log("one")
                        started = 1;                     
                        req.session.orgid = result[0].orgid;
                        console.log(req.session.orgid  )
                    } else {
                        started = 0;
                       // console.log("two")
                    }
                    nmcon.query("select enddate,subscriptionid from usermaster_t.subscriptions where subscriptionid in (select orginfo.subscriptionid  from mlm_t.orginfo  where orgid like '"+req.session.orgid+"')",function(err,result){
                    if(err)console.log(err)
                    else if(result.length>0){
                        var enddate = result[0].enddate
                        let date1 = new Date()
                        const diffTime = enddate.getTime() - date1.getTime();
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        if(diffDays>0){
                                substatus = 1;
                        }else{
                                substatus = 0;    
                        } 
                    } 
                    var sql="select * from mlm_t.orginfo where orgid='"+req.session.orgid+"' ";
                        console.log("sql......."+sql)
                        nmcon.query(sql, (err, result)=>{
                            if(err) console.log(err)
                            else if (result.length>0) {
                                //console.log("one")
                                req.session.orgcolor = result[0].csscolor;                   
                                orgcolor=req.session.orgcolor;
                                if(orgcolor == 'undefined' || orgcolor == null || orgcolor == 'null' || orgcolor == undefined || orgcolor == 'NaN-aN-aN'){
                                    orgcolor='style'
                                }
                                //console.log(req.session.orgid +"orgid")
                            } else {
                                orgcolor = 0;
                                //console.log("two")
                            }                         
                            res.render("mlm.pug",{userid: req.session.userid,username: req.session.username,admin:admin,started:started,substatus:substatus,orgcolor});
                            console.log("mlm.pug",{userid:req.session.userid,username: req.session.username,admin:admin,started:started,substatus:substatus,orgcolor});           
                    })        
                }) 
            })
        })
    }
});
const mlmmulter = multer.diskStorage({
    destination: (req, file, cb) => {
        if (fs.existsSync("./userdata/mlmuploadcsv/"+req.session.userid)){
            console.log("exists")                
        }
        else{
            fs.mkdir("./userdata/mlmuploadcsv/"+req.session.userid, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            })
        }
        cb(null,"./userdata/mlmuploadcsv/"+req.session.userid);
     },
    filename: (req, file, cb) => {                              
        //const fileExtension = file.originalname;//name of file
        const fileExtension = req.session.userid+'.csv';//name of file
        // console.log(req.session.fileExtension+ ' file upload ' + req.session.userid)
        cb(null, fileExtension);
    },
    })
   const uploadcsv = multer({
    storage: mlmmulter,
    limits: { fileSize: 2097152 }
}).single('csv'); 
app.post("/uploadbankcsv", (req, res) => {
    var admin = 1;
    var started = 1;
    console.log(admin + "-admin " + started + " - started")
    uploadcsv(req, res, (err) => {
        if (err) {
            console.log(err)
            res.send('bigfile')
        } else {
            res.render("mlm.pug", { admin: admin, started: started, userid: req.session.userid });
        }
    });
});
app.post("/1/mlm",up,async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
        // res.redirect("/1/login")
    }else if(req.body.action==="subscribem"){
        var startdate = new Date();
        var subscribeidnew = uuidv4();
        var currentdate = startdate.getFullYear()+'-'+("0" + (startdate.getMonth() + 1)).slice(-2)+'-'+("0" + startdate.getDate()).slice(-2) +" "+startdate.getHours()+':'+startdate.getMinutes()+':'+startdate.getSeconds();
        var days =3;
        let newDate = new Date(Date.now()+days*24*60*60*1000);
        let ndate = ("0" + newDate.getDate()).slice(-2);
        let nmonth = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let nyear = newDate.getFullYear();   
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();       
        let nextdate = nyear+'-'+nmonth+'-'+ndate +" "+hours+':'+minutes+':'+seconds 
        mcon.query("select * from subscriptions where userid='"+req.session.userid+"' and moduleid=21", function(err, result){
            if(err) console.log(err);
            else if(result.length > 0){
                res.send("used")
            }else{
            var sql2 = "insert into subscriptions(userid, subscriptionid, moduleid, startdate, enddate,isprimary ) values('"+req.session.userid+"','"+subscribeidnew+"',21,'"+currentdate+"','"+nextdate+"','yes')"
                    mcon.query(sql2, function(err, data){
                        //console.log(sql2)
                        if (err) throw err;
                        res.send("Saved")
                    });   
            }
        })
    }
    else if(req.body.action==="saveorginfom"){
        var orgid = uuidv4();
        var nameorg = req.body.nameorg
        var phoneno = req.body.phoneno
        var orgaddress = req.body.orgaddress
        var orgaddress2 = req.body.orgaddress2
        var orgcity = req.body.orgcity
        var orgstate = req.body.orgstate
        var orgemail = req.body.orgemail
        var currentdate = new Date();
        currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2)
        var sql = "insert into orginfo (subscriptionid, orgid,orgname, orgmobileno,address,address1,city,state,email,modifiedby,modifieddate,cardstatus) values('"+req.session.subid+"','"+orgid+"','"+nameorg+"', '"+phoneno+"','"+orgaddress+"','"+orgaddress2+"','"+orgcity+"','"+orgstate+"','"+orgemail+"','"+req.session.userid+"','"+currentdate+"','Active')"
        nmcon.query(sql,function(err,result1){
            //console.log(sql    +"  000")
            if(err)console.log(err)
            else if (result1.affectedrows>0)
            {
                res.send("data insert")
            }else{
                res.send("Information saved successfully")
            }   
        })
    }
    else if(req.body.action==="retriveorginfo"){
        var sql="select * from orginfo where subscriptionid='"+req.session.subid+"'";
        nmcon.query(sql,function (err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].orgname)
                arr.push(result[0].orgmobileno)
                arr.push(result[0].address)
                arr.push(result[0].address1)
                arr.push(result[0].city)
                arr.push(result[0].state)
                arr.push(result[0].email)
                res.send(arr)
            }else{
                console.log("error")
            }
        })
    }
    else if(req.body.action==="updateorg"){
        var nameorg = req.body.nameorg
        var phoneno = req.body.phoneno
        var uaddress = req.body.uaddress
        var uaddress1 = req.body.uaddress1
        var ucity = req.body.ucity
        var ustate = req.body.ustate
        var uemail = req.body.uemail
        var sql = "update orginfo set orgname='"+nameorg+"',orgmobileno='"+phoneno+"',address='"+uaddress+"',address1='"+uaddress1+"',city='"+ucity+"',state='"+ustate+"',email='"+uemail+"'  where subscriptionid='"+req.session.subid+"'";
        nmcon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.affectedRows>0){
                res.send("updated successfully")
            }else{
                res.send("error")
            }
        })
    }
    //mlm orgcolor
    else if(req.body.action==="orgcolormlm"){
        var csscolor = req.body.csscolor
        var sql = "update mlm_t.orginfo  set csscolor='"+csscolor+"'  where subscriptionid='"+req.session.subid+"'";
        nmcon.query(sql,function(err,result){
           console.log(sql  +  ">>>>")
            if(err)console.log(err)
            else if(result.affectedRows>0){
               res.send("updated successfully")
            }else{
                res.send("orginfo error")
            }
        })
    }
    else if (req.body.action === 'retrivebgstylecolormlm') {
        var sql = "select * from usermaster_t.bgstyle ";
        mcon.query(sql, function(err, result) {
            // console.log(sql +"   retrivprojectname")
            if (err) console.log(err, req);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"name":"' + result[i].name + '","filename":"' + result[i].filename + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    // else if(req.body.action==="retrivorgcolormlm"){
    //     var sql="select * from mlm_t.orginfo where orgid='"+req.session.orgid+"';"
    //         nmcon.query(sql,function (err,result){
    //         // console.log(sql)
    //         if(err)console.log(err)
    //             else if(result.length>0){
    //                 var arr=[];
    //                 arr.push(result[0].csscolor)
    //             res.send(arr)
    //         }else{
    //             res.send(" ")
    //         }
    //     })
    // }
    //mlm logo upload code 
    else if(req.body.action==='mlmlogou'){
        return new Promise((resolve, reject) => {
            savefiledb(req,res,req.session.orgid,(successfun) => {
                resolve(successfun);
            });
        }).then((data)=>{
            nmcon.query("UPDATE orginfo SET logoid ='"+data+"' where orgid='"+req.session.orgid+"'" , function(err,result){
                if(err) console.log(err);
                else if(result.affectedRows>0){
                    res.send('successful')
                }else{
                    console.log("something went wrong please try after sometime.....")
                }
            })
        })   
    }
    else if(req.body.action === 'getlogomlm'){
        let path ="mlmlogo"+"/"+req.session.orgid
        nmcon.query("select logoid from orginfo where orgid like'"+req.session.orgid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let fileid = result[0].logoid
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,fileid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                    res.send(data)
                })

            }else{
                res.send("no file")
            }
        })    
    }
    // mlm setting //
    else if(req.body.action==="saveplan"){
        var planid = uuidv4();
        var planname = req.body.newplanadd
        var currentdate = new Date();
        currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2)
        var sql1 = "SELECT COUNT(*) AS count FROM plan WHERE orgid='"+req.session.orgid+"' and planname = '" + planname + "'";
        nmcon.query(sql1, function (checkErr, checkResult) {
            console.log(sql1 +"  show plans ")
            if (checkErr) {
            
                res.send("error");
            } else {
                var plannametCount = checkResult[0].count;

                if (plannametCount > 0) {
                    res.send("Plan name already exists. Please choose a different name.");
                } else {
                var sql = "insert into plan (orgid, planname,createddate, createdby,planid) values('"+req.session.orgid+"','"+planname+"','"+currentdate+"', '"+req.session.userid+"','"+planid+"')";
                nmcon.query(sql,function(err,result1){
                    //console.log(sql    +"  sql")
                    if(err)console.log(err)
                        else if (result1.affectedrows>0)
                        {
                            res.send("Information saved successfully")
                        }else{
                            res.send("Information saved successfully")
                        }   
                    })
                }
            }
        })
    }
    else if(req.body.action==='retrivplan'){
        var sql="select * from plan where orgid = '"+req.session.orgid+"';"
        nmcon.query(sql,function(err,result){
            if(err)console.log(err,req)
            else if(result.length>0){
                r = []
                for(i=0;i<result.length;i++){
                    r.push('{"planname":"'+result[i].planname+'","planid":"'+result[i].planid+'"}')
                }
                res.send(r)
            }else{
                res.send("retrive status error")
            }
        })
    }
    else if (req.body.action === 'retriveplanname') {
        mobileno=req.body.mobileno;
        var sql = "select * from plan where orgid = '"+req.session.orgid+"';"
        nmcon.query(sql, function(err, result) {
            if (err) console.log(err,);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"planname":"' + result[i].planname + '","planid":"' + result[i].planid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if (req.body.action === 'retriveplanname1') {
        var sql = "select * from plan where orgid = '"+req.session.orgid+"';"
        nmcon.query(sql, function(err, result) {
            if (err) console.log(err,);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"planname":"' + result[i].planname + '","planid":"' + result[i].planid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if (req.body.action === 'retriveplanname2') { 
        var sql = "select * from plan where orgid = '"+req.session.orgid+"';"
        nmcon.query(sql, function(err, result) {
            if (err) console.log(err,);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"planname":"' + result[i].planname + '","planid":"' + result[i].planid + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if(req.body.action === "savelevelvalues") {
        var level = req.body.level;
        var share = req.body.share;
        var planid = req.body.planid;
        if (!level || !share || level === 'Select Level' || planid === 'Plan Name') {
            res.send("Please provide values for all required fields");
            return;
        }
        var sql1 = "SELECT * FROM plandetails WHERE planid ='"+planid+"' AND levels ='"+level+"' AND orgid ='"+req.session.orgid+"'";
        nmcon.query(sql1, function(err, results) {
            if (err) {
                console.error(err);
                res.send("Error occurred while checking existing values");
                return;
            }
            if (results.length > 0) {
                res.send("This Level Already Has Share Values");
            } else {
                var sql = "INSERT INTO plandetails (orgid, planid, levels, share) VALUES ('"+req.session.orgid+"','"+planid+"','"+level+"','"+share+"')";
                nmcon.query(sql,function(err, result) {
                    if (err) {
                        console.error(err);
                        res.send("Error occurred while inserting data");
                        return;
                    }
                    if (result.affectedRows > 0) {
                        res.send("Information saved successfully");
                    } else {
                        res.send("Failed to Insert Data");
                    }
                });
            }
        });
    }
    else if(req.body.action==="searchmember"){
        var mobileno = req.body.mobileno
        var sql="select * from usermaster_t.users where mobile='"+mobileno+"'";
        mcon.query(sql,function(err,result){
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].mobileno)
                arr.push(result[0].name)
                arr.push(result[0].email)
                arr.push(result[0].userid)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if (req.body.action === "savemember") {
        var refrenceid = req.body.userid2;
        var membername1 = req.body.membername1;
        var memberemail = req.body.memberemail;
        var bankname = req.body.bankname;
        var ifsccode = req.body.ifsccode;
        var bankaccountno = req.body.bankaccountno;
        var membernumber = req.body.membernumber;
        var showplan = req.body.showplan;
        var invoiceno = req.body.invoiceno;
        var refrencename = req.body.refrencename;
        var refrenceemail = req.body.refrenceemail;
        var refrenceno = req.body.refrenceno;
        var amount = req.body.amount;
        console.log(refrenceid+" refrenceid" + membername1+" membername1" +memberemail+" memberemail" + bankname+ " bankname" + ifsccode+ " ifsccode" +bankaccountno + " bankaccountno" + membernumber + " membernumber" + showplan + " showplan" +invoiceno + " invoiceno" + refrencename + " refrencename" + refrenceemail+" refrenceemail" + refrenceno + " refrenceno"+ amount+" amount")
        if (!refrenceid || !membername1 || !memberemail || !bankname || !ifsccode || !bankaccountno || !membernumber || !showplan ||  showplan === 'Plan Name' || !invoiceno || !refrencename || !refrenceemail || !refrenceno || !amount) {
            res.send("Please provide values for all required fields");
            return;
            }
            var cdate = new Date();
            cdate = cdate.getFullYear() + '-' + ('0' + (cdate.getMonth() + 1)).slice(-2) + '-' + ('0' + cdate.getDate()).slice(-2) + ' ' + ('0' + cdate.getHours()).slice(-2) + ':' + ('0' + cdate.getMinutes()).slice(-2) + ':' + ('0' + cdate.getSeconds()).slice(-2);
            // Check if the reference ID is present in the memberid column
            var sql = "SELECT * FROM member WHERE orgid='"+req.session.orgid+"' and memberid = '" + refrenceid + "'";
            nmcon.query(sql, function (err, existingResult) {
                console.log( sql +" ..checkExistingSQL")
                if (err) {
                    console.log(err);
                } else if (existingResult.length > 0) {
                    // If reference ID is present, check if the user is registered
                    var sql1 = "SELECT * FROM users WHERE mobile = '" + membernumber + "'";
                    mcon.query(sql1, function (err, userResult) {
                    if (err) {
                        console.log(err);
                    } else if (userResult.length > 0) {
                        var userid = userResult[0].userid;
                        var sqlCheck = "SELECT * FROM mlm_t.member WHERE orgid=? AND memberid=?";
                        nmcon.query(sqlCheck, [req.session.orgid, userResult[0].userid], function(err, result) {
                            console.log(sqlCheck + " vvvvvvvvv");
                            if (err) {
                                console.log(err);
                                res.send("An error occurred");
                            } else {
                                if (result.length > 0) {
                                    res.send("User already exists in this organization");
                                } else {
                                    var sqlInsert = "INSERT INTO member (membername, memberid, orgid, membermobileno, referenceid, memberemailid, bankname, ifsccode, bankaccountno, planid, createddatetime, amount, invoicenumber, invoicedate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                    var values = [membername1, userResult[0].userid, req.session.orgid, membernumber, refrenceid, memberemail, bankname, ifsccode, bankaccountno, showplan, cdate, amount, invoiceno, cdate];
                                    nmcon.query(sqlInsert, values, function(err, result1) {
                                        console.log(sqlInsert + "  ....sql4444");
                                        if (err) {
                                            console.log(err);
                                            res.send("An error occurred");
                                        } else {
                                            res.send("Information saved successfully");
                                        }
                                    });
                                }
                            }
                        })
                       // If user is registered, insert into member table
                                                        
                    } else {
                        var userid3 = uuidv4();
                        var sql4 = "INSERT INTO users (userid, name, password, mobile, email) VALUES ('" + userid3 + "','" + membername1 + "','" + membernumber + "','" + membernumber + "','" + memberemail + "')";
                        mcon.query(sql4, function (err, result7) {
                            console.log(sql4 + "  000sql1");
                            if (err) {
                                console.log(err);
                            } else if (result7.affectedRows > 0) {
                                // Once user is registered, insert into member table
                                var userid = userid3;
                                var sql5 = "INSERT INTO member (membername, memberid, orgid, membermobileno, referenceid, memberemailid, bankname, ifsccode, bankaccountno, planid, createddatetime,amount, invoicenumber, invoicedate) VALUES ('" + membername1 + "','" + userid + "','" + req.session.orgid + "','" + membernumber + "','" + refrenceid + "','" + memberemail + "','" + bankname + "','" + ifsccode + "','" + bankaccountno + "','" + showplan + "','" + cdate + "','"+amount+"','" + invoiceno + "','" + cdate + "')";
                                nmcon.query(sql5, function (err, result8) {
                                    console.log(sql5 + "  8998sql");
                                    if (err) {
                                        console.log(err);
                                    } else if (result8.affectedRows > 0) {
                                        res.send("Information saved successfully");
                                    } else{
                                        res.send("Information saved successfully");
                                    } 
                                });
                            }
                        });
                    }
                });
            } else {
                console.log(req.session.userid + "admin")
                if(req.session.userid==refrenceid)
                {
                // If reference ID is not present, insert into member table and check if user is registered
                var sql6 = "INSERT INTO member (membername, memberid, orgid, membermobileno,memberemailid,createddatetime) VALUES ('" + refrencename + "','" + refrenceid + "','" + req.session.orgid + "','" + refrenceno + "','" + refrenceemail + "','" + cdate + "')";
                nmcon.query(sql6, function (err, result3) {
                    console.log(sql6 + "  ....sql3333");
                    if (err) {
                    console.log(err);
                    }else if (result3.affectedRows > 0) {
                        // Check if user is registered
                        var sql7 = "SELECT * FROM users WHERE mobile = '" + membernumber + "'";
                        mcon.query(sql7, function (err, userResult) {
                            if (err) {
                                console.log(err);
                            } else if (userResult.length > 0) {
                                var userid = userResult[0].userid;
                                // If user is registered and not in the current organization, insert into member table
                                var sql9 = "INSERT INTO member (membername, memberid, orgid, membermobileno, referenceid, memberemailid, bankname, ifsccode, bankaccountno, planid, createddatetime,amount, invoicenumber, invoicedate) VALUES ('" + membername1 + "','" + userResult[0].userid + "','" + req.session.orgid + "','" + membernumber + "','" + refrenceid + "','" + memberemail + "','" + bankname + "','" + ifsccode + "','" + bankaccountno + "','" + showplan + "','" + cdate + "','"+amount+"','" + invoiceno + "','" + cdate + "')";
                                nmcon.query(sql9, function (err, result1) {
                                    console.log(sql9 + "  ....sql4444");
                                    if (err) {
                                        console.log(err);
                                        res.send("Error inserting data");
                                    } else if (result1.affectedRows > 0) {
                                        res.send("Information saved successfully");
                                    }else{
                                        res.send("Information saved successfully");
                                    }  
                                });
                            } else {
                                // res.send("First User Register Please")
                                // If user is not registered, insert into users table first
                                var userid4 = uuidv4();
                                var sql10 = "INSERT INTO users (userid, name, password, mobile, email) VALUES ('" + userid4 + "','" + membername1 + "','" + membernumber + "','" + membernumber + "','" + memberemail + "')";
                                mcon.query(sql10, function (err, result7) {
                                    console.log(sql10 + "  000sql1");
                                    if (err) {
                                        console.log(err);
                                    } else if (result7.affectedRows > 0) {
                                        // Once user is registered, insert into member table
                                        var userid = userid4;
                                        var sql11 = "INSERT INTO member (membername, memberid, orgid, membermobileno, referenceid, memberemailid, bankname, ifsccode, bankaccountno, planid, createddatetime,amount, invoicenumber, invoicedate) VALUES ('" + membername1 + "','" + userid + "','" + req.session.orgid + "','" + membernumber + "','" + refrenceid + "','" + memberemail + "','" + bankname + "','" + ifsccode + "','" + bankaccountno + "','" + showplan + "','" + cdate + "','"+amount+"','" + invoiceno + "','" + cdate + "')";
                                        nmcon.query(sql11, function (err, result8) {
                                            console.log(sql11 + "  8998sql");
                                            if (err) {
                                                console.log(err);
                                            } else if (result8.affectedRows > 0) {
                                                res.send("Information saved successfully");
                                            }else{
                                                res.send("Information saved successfully");
                                            }  
                                        });
                                    }
                                });
                            }
                        });
                    }
                    
                });
            }else{
                res.send("Please Select Correct Refrance Number")
            }
            }
        });
    }
    //profilepic save mlm
    else if(req.body.action==='uploadprofilepic'){
        var userid3=req.body.userid3;
        return new Promise((resolve, reject) => {
            savefiledb(req,res,req.session.orgid,(successfun) => {
                resolve(successfun);
            });
        }).then((data)=>{
            var sql = "update member SET memberpicid ='"+data+"' where orgid='"+req.session.orgid+"' and memberid='"+userid3+"'";
            nmcon.query(sql , function(err,result){
                console.log(sql + " upload pic")
                if(err) console.log(err);
                else if(result.affectedRows>0){
                    res.send('successful')
                }else{
                    res.send("something went wrong please try after sometime.....")
                }
            })
        })   
    }

    else if(req.body.action === 'getprofilepicmlm'){
        var userid3= req.body.userid3;
        let path ="mlmprofilepic"+"/"+req.session.orgid
        nmcon.query("select memberpicid from member where orgid='"+req.session.orgid+"' and memberid='"+userid3+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let fileid = result[0].memberpicid
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,fileid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                    res.send(data)
                })
    
            }else{
                res.send("no file")
            }
        })    
    }

    else if(req.body.action==="searcrefrence"){
        var mobileno = req.body.mobileno
        var sql="select * from usermaster_t.users where mobile='"+mobileno+"'";
        mcon.query(sql,function(err,result){
            // console.log(sql + " -search refranse ")
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].mobileno)
                arr.push(result[0].name)
                arr.push(result[0].email)
                arr.push(result[0].userid)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if(req.body.action==="showmemberreport"){
        var planid = req.body.planid
        var refrenceid =req.body.refrenceid;
        var tbltext ="";
        var sql ="SELECT * FROM mlm_t.member  WHERE  memberid='"+refrenceid+"' and orgid='"+req.session.orgid+"';"
        //    var sql ="SELECT * FROM mlm_t.member a, plan b, plandetails c WHERE a.planid=b.planid and b.planid=c.planid AND memberid='"+refrenceid+"' and c.levels = '1';" 
        nmcon.query(sql,async  function (err,result){
            console.log(sql +" 111..........")
            if(err)console.log(err)
            else if(result.length>0){ 
                var thread1 = "<table id='report' style='width:100%;  align-self: center;'><tr><th style='width:180px'>Name</th><th style='width:150px'>Contact No</th><th> Levels</th><th>Amount</th><th>share %</th><th>share</th></tr>"
                var totalAmount=0;
                for(var i=0;i<result.length;i++){
                        var membername =result[i].membername;
                        if(membername == 'undefined' || membername == undefined || membername == 'null' || membername == null){
                            membername = ''
                        }
                        var membermobileno = result[i].membermobileno;
                        if(membermobileno == 'undefined' || membermobileno == undefined || membermobileno == 'null' || membermobileno == null){
                            membermobileno = ''
                        }
                        var memberid = result[i].memberid;
                        
                        var planid=result[i].planid;
                        
                        var orgid=req.session.orgid;
                        var amount =result[i].amount;
                        if(amount == 'undefined' || amount == undefined || amount == 'null' || amount == null){
                            amount = ''
                        }
                        var totalIncome = 0;
                        var amt=0;
                        
                        tbltext="<tr><td  style='text-align: left;'>"+membername+"</td><td>"+membermobileno+"</td><td>Admin</td><td>"+amount+"</td><td></td><td></td></tr>"
                    // console.log(tbltext +"  @@@")
                    var { tbltext, amt: totalAmount } = await getchildlevel(tbltext, memberid, req.session.orgid, "&nbsp;&nbsp;&nbsp;&nbsp;", 1, totalIncome, amt);
                            
                    }
                    tbltext += "<tr><td colspan='4' style='text-align: right; font-size:17px;'>Total:</td><td  id='totalamountid'  colspan='2'>" + totalAmount + "</td><input type='hidden' id='refidHidden' value='" + refrenceid + "'></tr>";
                    var sql1="update member set totalshare='"+totalAmount+"' where memberid='"+refrenceid+"' and orgid='"+req.session.orgid+"'";
                    nmcon.query(sql1, function(err,result1){
                    // console.log(sql1 +" data update")
                    if(err)console.log(err)
                    else if (result1.affectedRows > 0) {
                        tbltext = thread1 + tbltext;
                        res.send(tbltext);
                        //res.send("Data update.");
                    }else{
                        res.send("Insert failed.");
                    }
                
                })
                }else{
                    res.send("No Record")
                }
        })
    }
    else if(req.body.action==="serchmember"){
        var mobileno = req.body.mobileno
        var sql="select * from usermaster_t.users where mobile='"+mobileno+"'";
        mcon.query(sql,function(err,result){
            console.log(sql +"  search member")
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].mobileno)
                arr.push(result[0].name)
                arr.push(result[0].email)
                arr.push(result[0].userid)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("User is not registered") 
            }
        })
    }
    else if(req.body.action==="showplaninfo"){
        var planid = req.body.planid
        var tbltext = ""
        var sql="select * from mlm_t.plandetails where orgid='"+req.session.orgid+"' and planid='"+planid+"' ";
        nmcon.query(sql,async  function (err,result){
            console.log(sql + " show all plans ")
            if(err)console.log(err)
            else if(result.length>0){ 
                var tbltext = "<table id='report'><tr><th style='width:150px'>Levels</th><th style='width:150px'>share</th></tr>"
                for(var i=0;i<result.length;i++){
                        var share =result[i].share;
                        var levels = result[i].levels;
                        tbltext=tbltext+"<tr><td style='text-align: left;'>"+levels+"</td><td>"+share+"</td></tr>"
                    }
                    tbltext=tbltext+"</table>"
                    res.send(tbltext)
                }else{
                    res.send("No Record")
                }
            })
        }
    else if(req.body.action==="searchpayourm"){
        var membernumber = req.body.membernumber
        var sql="select * from mlm_t.member  where orgid='"+req.session.orgid+"' And membermobileno='"+membernumber+"'";
        nmcon.query(sql,function(err,result){
            console.log(sql  +"  search member")
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].memberid)
                arr.push(result[0].membername)
                arr.push(result[0].amount)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("Member is not registered") 
            }
        })
    }
    else if(req.body.action==="payoutbutton"){
        var refrenceid = req.body.refrenceid
        var sql="select * from mlm_t.member  where orgid='"+req.session.orgid+"' And memberid='"+refrenceid+"'";
        nmcon.query(sql,function(err,result){
            console.log(sql  +"  search member")
            if(err)console.log(err)
            else if(result.length>0){
                var arr=[];
                arr.push(result[0].amount)
                res.send(arr)
            }else{
                //res.send(arr)
            res.send("Member is not registered") 
            }
        })
    }
    else if (req.body.action === 'savepayout') {
        var memberid = req.body.refrenceid;
        var currentdate1 = req.body.payoutdate;
        var totalshare = req.body.totalshare;
        var totalpayout = req.body.totalpayout;
        var balancePayout = req.body.balancePayout;
        var transactionid = uuidv4();
        var amount = req.body.amount;
        var cdate = new Date();
        cdate = cdate.getFullYear() + '-' + ('0' + (cdate.getMonth() + 1)).slice(-2) + '-' + ('0' + cdate.getDate()).slice(-2) + ' ' + ('0' + cdate.getHours()).slice(-2) + ':' + ('0' + cdate.getMinutes()).slice(-2) + ':' + ('0' + cdate.getSeconds()).slice(-2);
        var ccdate = new Date();
        ccdate = ccdate.getFullYear() + '-' + ('0' + (ccdate.getMonth() + 1)).slice(-2) + '-' + ('0' + ccdate.getDate()).slice(-2);
        var sqlcheck = "SELECT * FROM payout WHERE memberid='" + memberid + "' AND orgid='" + req.session.orgid + "' AND DATE(currentdate) = DATE('" + ccdate + "')";
        //var sqlcheck = "SELECT * FROM payout WHERE memberid='" + memberid + "' AND orgid='" + req.session.orgid + "' AND currentdate='" + ccdate + "'";
        nmcon.query(sqlcheck, function (err, result1) {
            console.log(sqlcheck + " -check condition payout")
            if (err) {
                console.log(err);
            } else if (result1.length > 0) {
                res.send("This member has already been paid today.");
            } else {
                var sql = "INSERT INTO payout (orgid, memberid, transactiondate, amount, createdby, transactionid, currentdate) VALUES ('" + req.session.orgid + "','" + memberid + "','" + currentdate1 + "','" + amount + "','" + req.session.userid + "','" + transactionid + "','" + cdate + "')";
                nmcon.query(sql, function (err, result) {
                    console.log(sql + " -insert payout")
                    if (err) {
                        console.log(err);
                        res.send("An error occurred while inserting the status.");
                    } else if (result.affectedRows > 0) {
                        
                        var sql1 = "UPDATE member SET totalpayout='" + totalpayout + "', balancepayout='" + balancePayout + "'  WHERE memberid='" + memberid + "' AND orgid='" + req.session.orgid + "'";
                        nmcon.query(sql1, function (err, result1) {
                            console.log(sql1 + " -update Member")
                            if (err) {
                                console.log(err);
                            } else if (result1.affectedRows > 0) {
                                res.send("Data inserted.");
                            } else {
                                res.send("Insert failed.");
                            }
                        })
                    }
                })
            }
        })
    }
    // else if(req.body.action==="showpayoutreportinfo"){
    //     var refrenceid=req.body.refrenceid;
    //     var tbltext = ""
    //     var sql1="select * from member where orgid='"+req.session.orgid+"'";
    //     var sql="SELECT m.membername,m.membermobileno,p.amount,p.transactiondate  FROM member m JOIN payout p ON m.memberid = p.memberid  WHERE m.memberid = '"+refrenceid+"' and m.orgid='"+req.session.orgid+"';"
    //     nmcon.query(sql,function (err,result){
    //          console.log(sql)
    //         if(err)console.log(err)
    //         else if (result.length > 0) {
    //             tbltext = "<table id='report'><tr><th style='width:150px'>Member Name</th><th style='width:150px'>PayOut Date</th><th style='width:150px'>Amount</th></tr>";
    //             for (var i = 0; i < result.length; i++) {
    //                 var membername = result[i].membername;
    //                 var membermobileno = result[i].membermobileno;
    //                 var amount = result[i].amount;
    //                 var transactiondate = result[i].transactiondate; // Corrected this line
            
    //                 if (transactiondate == 'undefined' || transactiondate == null || transactiondate == 'null' || transactiondate == undefined || transactiondate == 'NaN-aN-aN') {
    //                     transactiondate = '';
    //                 } else {
    //                     var date = new Date(transactiondate); // Parse the transactiondate to Date object
    //                     transactiondate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
    //                 }
    //                 tbltext = tbltext + "<tr><td>" + membername + "</td><td>" + transactiondate + "</td><td>" + amount + "</td></tr>";
    //             }
    //             tbltext = tbltext + "</table>";
    //             res.send(tbltext);
    //         } else {
    //             res.send("No Record");
    //         }
    //     })
    // } 
    else if(req.body.action === "showpayoutreportinfo") {
        var refrenceid = req.body.refrenceid;
        var tbltext = "";
    
        // Query to retrieve member data based on member id
        var sql1 = "SELECT * FROM member WHERE memberid = '" + refrenceid + "' AND orgid = '" + req.session.orgid + "'";
    
        // Query to retrieve payout data based on member id
        var sql2 = "SELECT amount, transactiondate FROM payout WHERE orgid = '" + req.session.orgid + "' and memberid = '" + refrenceid + "'";
    
        // Execute first query to retrieve member data
        nmcon.query(sql1, function (err, memberResult) {
            if (err) {
                console.log(err);
                res.send("Error occurred while fetching member data");
            } else if (memberResult.length > 0) {
                var membername = memberResult[0].membername;
                var membermobileno = memberResult[0].membermobileno;
    
                // Execute second query to retrieve payout data
                nmcon.query(sql2, function (err, payoutResult) {
                    console.log(sql2)
                    if (err) {
                        console.log(err);
                        res.send("Error occurred while fetching payout data");
                    } else {
                        if (payoutResult.length > 0) {
                            tbltext = "<table id='report'><tr><th style='width:150px'>Member Name</th><th style='width:150px'>Member Mobile No</th><th style='width:150px'>PayOut Date</th><th style='width:150px'>Amount</th></tr>";
                            for (var i = 0; i < payoutResult.length; i++) {
                                var amount = payoutResult[i].amount;
                                var transactiondate = payoutResult[i].transactiondate;
    
                                if (transactiondate == 'undefined' || transactiondate == null || transactiondate == 'null' || transactiondate == undefined || transactiondate == 'NaN-aN') {
                                    transactiondate = '';
                                } else {
                                    var date = new Date(transactiondate);
                                    transactiondate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
                                }
                                tbltext += "<tr><td>" + membername + "</td><td>" + membermobileno + "</td><td>" + transactiondate + "</td><td>" + amount + "</td></tr>";
                            }
                            tbltext += "</table>";
                            res.send(tbltext);
                        } else {
                            res.send("No Data");
                        }
                    }
                });
            } else {
                res.send("No Record");
            }
        });
    }
    
    
    else if (req.body.action === 'payouttotalamount') {
        var refrenceid = req.body.refrenceid;
        var sql = "SELECT * FROM payout WHERE memberid='" + refrenceid + "' AND orgid = '" + req.session.orgid + "';";
        nmcon.query(sql, function(err, result) {
            console.log(sql)
            if (err) {
                console.log(err);
                res.send("error");
            } else if (result.length > 0) {
                var payoutamount = 0;

                for (var i = 0; i < result.length; i++) {
                    payoutamount += result[i].amount;
                }

                res.send({ payoutamount: payoutamount });
            } else {
                res.send("error");
            }
        });
    }
    else if(req.body.action === "memberreportsearch") {
        var membernumber = req.body.membernumber;
        var fromdatereport = req.body.fromdatereport;
        var todatereport = req.body.todatereport;
        var tbltext = "";
        var sql = "SELECT m.orgid,m.membername, m.memberid, m.membermobileno, p.transactiondate, p.amount,m.bankname,m.ifsccode,m.bankaccountno FROM  member m JOIN  payout p ON m.memberid = p.memberid AND m.orgid = p.orgid WHERE  m.orgid = '"+req.session.orgid+"' and 1=1"; 
        if (membernumber) {
            sql += " AND m.membermobileno = '" + membernumber + "'";
        }
        if (fromdatereport) {
            sql += " AND p.transactiondate >= '" + fromdatereport + "'";
        }
        if (todatereport) {
            sql += " AND p.transactiondate <= '" + todatereport + "'";
        }
        nmcon.query(sql, function (err, result) {
            console.log(sql + " ********")
            if (err) {
                console.log(err);
            } else if (result.length > 0) { 
                tbltext = "<table id='report'style='width:100%' ><tr><th style='width:150px'>Member Name</th><th>Contact No</th><th style='width:150px'>PayOut Date</th><th style='width:150px'>Amount</th><th>Bank Name</th><th>Bank Account no</th><th>ifsccode</th></tr>";
                for (var i = 0; i < result.length; i++) {
                    var membername = result[i].membername;
                    var bankaccountno=result[i].bankaccountno;
                    var ifsccode =result[i].ifsccode;
                    var bankname = result[i].bankname;
                    var membermobileno = result[i].membermobileno;
                    var amount = result[i].amount;
                    var startdate = new Date();
                    var crdate = result[i].transactiondate;
                    if(crdate == 'undefined' || crdate == null || crdate == 'null' || crdate == undefined || crdate == 'NaN-aN-aN'){
                        crdate=''
                    }else{
                        crdate = crdate.getFullYear()+'-'+("0" + (crdate.getMonth() + 1)).slice(-2)+'-'+("0" + crdate.getDate()).slice(-2);     
                    }
                    tbltext = tbltext + "<tr><td>" + membername + "</td><td>"+membermobileno+"</td><td>" + crdate + "</td><td>" + amount + "</td><td>" + bankname + "</td><td>" + bankaccountno + "</td><td>" + ifsccode + "</td></tr>";
            
                }
                tbltext = tbltext + "</table>";
                
                res.send(tbltext);
            } else {
                res.send("No Record");
            }
        });
    }
    else if(req.body.action === "currontpayoitreport") {
        var membernumber = req.body.membernumber;
        var tbltext = "";
        var sql = "SELECT *  "+
                " FROM member " +
                " WHERE orgid='"+req.session.orgid+"' and 1=1 "; 
        if (membernumber) {
            sql += " AND membermobileno = '" + membernumber + "'";
        }
        sql += " AND referenceid IS NOT NULL AND referenceid <> ''";
    // sql +=" And memberid is not refranseid";
        nmcon.query(sql, function (err, result) {
            console.log(sql + " ********")
            if (err) {
                console.log(err);
            } else if (result.length > 0) { 
                tbltext = "<table id='report' style='width:100%'><tr><th style='width:150px'>Name</th><th> contactno </th><th>TotalEarning</th><th>PayoutDone</th><th>PendingPayOut</th><th>Bank Name</th><th>BankAccountno</th><th>ifsccode</th><th>Action</th></tr>";
                for (var i = 0; i < result.length; i++) {
                    var membername = result[i].membername;
                    if(membername == 'undefined' || membername == undefined || membername == 'null' || membername == null){
                        membername = ''
                    }
                    var bankaccountno=result[i].bankaccountno;
                    if(bankaccountno == 'undefined' || bankaccountno == undefined || bankaccountno == 'null' || bankaccountno == null){
                        bankaccountno = ''
                    }
                    var ifsccode =result[i].ifsccode;
                    if(ifsccode == 'undefined' || ifsccode == undefined || ifsccode == 'null' || ifsccode == null){
                        ifsccode = ''
                    }
                    var bankname = result[i].bankname;
                    if(bankname == 'undefined' || bankname == undefined || bankname == 'null' || bankname == null){
                        bankname = ''
                    }
                    var balancepayout =result[i].balancepayout;
                    if(balancepayout == 'undefined' || balancepayout == undefined || balancepayout == 'null' || balancepayout == null){
                        balancepayout = ''
                    }
                    var memberid=result[i].memberid;
                    var totalpayout =result[i].totalpayout;
                    if(totalpayout == 'undefined' || totalpayout == undefined || totalpayout == 'null' || totalpayout == null){
                        totalpayout = ''
                    }
                    var totalshare =result[i].totalshare;
                    if(totalshare == 'undefined' || totalshare == undefined || totalshare == 'null' || totalshare == null){
                        totalshare = ''
                    }
                    var membermobileno = result[i].membermobileno;
                    if(membermobileno == 'undefined' || membermobileno == undefined || membermobileno == 'null' || membermobileno == null){
                        membermobileno = ''
                    }
                    tbltext = tbltext + "<tr><td>" + membername + "</td><td>"+membermobileno+"</td><td>" + totalshare + "</td><td>" + totalpayout + "</td><td>" + balancepayout + "</td><td>" + bankname + "</td><td>" + bankaccountno + "</td><td>" + ifsccode + "</td><td> <button onclick=payonpendingpayOut('"+memberid+"');setmemberid('"+memberid +"');>Pay</button></td></tr>";
            
                }
                tbltext = tbltext + "</table>";
                
                res.send(tbltext);
            } else {
                res.send("No Record");
            }
        });
    }
    // else if(req.body.action==="retrivpayout"){
    //     var memberid = req.body.memberid
    //     var sql="select * from mlm_t.member where memberid='"+memberid+"' And orgid='"+req.session.orgid+"'";
    //     nmcon.query(sql,function(err,result){
    //         if(err)console.log(err)
    //         else if(result.length>0){
    //             var arr=[];
    //             arr.push(result[0].balancepayout)
    //             arr.push(result[0].totalshare)
    //             arr.push(result[0].totalpayout)
    //             arr.push(result[0].balancepayout)
    //             res.send(arr)
    //             console.log(arr)
    //         }else{
    //             //res.send(arr)
    //         res.send("User is not registered") 
    //         }
    //     })
    // }
    else if(req.body.action === "retrivpayout") {
        var memberid = req.body.memberid;
        var orgid = req.session.orgid;
        var sql1="select * from mlm_t.member where memberid='"+memberid+"' and orgid='"+req.session.orgid+"';"
        nmcon.query(sql1,function(err,result){
            console.log(sql1 + " - member payout")
            if(err){
                console.log(err)
            }
            else if(result.length > 0){
                var totalshare=result[0].totalshare;
                var sql= "select amount,COALESCE(amount, 0) from  payout where memberid='"+memberid+"' and orgid='"+req.session.orgid+"';"
                nmcon.query(sql,function(err,result){
                    console.log(sql + " -payout")
                    if (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    } else if (result.length > 0) {
                        var totalAmount = 0;
                        for (var i = 0; i < result.length; i++) {
                            totalAmount += result[i].amount;
                        }
                        console.log( totalshare +" -totalShare" + totalAmount + "- totalAmount")
                        res.send({ totalshare: totalshare, totalAmount: totalAmount });
                        
                    } else {
                        res.send({ totalshare: totalshare, totalAmount: totalAmount })
                        // res.status(404).send("User is not registered");
                    }   
                })
            }
        })
        // var sql ="SELECT m.totalshare, COALESCE(p.amount, 0) AS amount FROM mlm_t.member m  LEFT JOIN mlm_t.payout p ON m.memberid = p.memberid  AND p.orgid = '"+req.session.orgid+"' WHERE m.memberid = '"+memberid+"'; ";
        // nmcon.query(sql, function(err, result) {
        //     console.log(sql +" retriv")
        //     if (err) {
        //         console.log(err);
        //         res.status(500).send("Internal Server Error");
        //     } else if (result.length > 0) {
        //         var totalShare = result[0].totalshare;
        //         var totalAmount = 0;
        //         for (var i = 0; i < result.length; i++) {
        //             totalAmount += result[i].amount;
        //         }
        //         console.log( totalShare +" -totalShare" + totalAmount + "- totalAmount")
        //         res.send({ totalShare: totalShare, totalAmount: totalAmount });
                
        //     } else {
        //         res.status(404).send("User is not registered");
        //     }
        // });
    }
    
    // Server-side code
else if (req.body.action === "uploadbcsv") {
    let foldadd = "./userdata/mlmuploadcsv/" + req.session.userid + "/";
    let filename = req.session.userid + '.csv';
    let fn = foldadd + filename;
    csvtojson().fromFile(fn).then(async source => {
        for (let i = 0; i < source.length; i++) {
            let transactionno = source[i].transactionno.trim();
            let contactno = source[i].contactno;
            if (!transactionno) {
                console.log("Skipping row with blank transactionno");
                continue;
            }

            let sqlUpdate = "UPDATE member SET transactionno = '" + transactionno + "' WHERE orgid = '" + req.session.orgid + "' and membermobileno ='" + contactno + "' AND referenceid IS NOT NULL AND referenceid <> '' ";
            try {
                await new Promise((resolve, reject) => {
                    nmcon.query(sqlUpdate, function (err, result) {
                        console.log(sqlUpdate + ".- -- sqlUpdate");
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log(`Updated transactionno for members with orgid ${req.session.orgid}`);
                            resolve(result);
                        }
                    });
                });
            } catch (error) {
                console.error("Error updating transactionno:", error);
                res.send("error");
                return; // Ensure the function stops execution upon error
            }
        }
        res.send("success"); // Send success response after all updates are done
    }).catch(error => {
        console.error("Error processing CSV file:", error);
        res.send("error");
    });
}

    //mlm account status
    else if(req.body.action === "getaccountdetailsmlm"){
        mcon.query("select * from subscriptions where userid='" + req.session.userid + "' and moduleid=21", function(err, results){
            if(err) console.log(err)  
            else{
                var date_ob = new Date();
                let acc=[];
                let date = new Date(results[0].enddate)
                var diff = date.getTime() - date_ob.getTime()  
                var daydiff = diff / (1000 * 60 * 60 * 24)
                if(daydiff>0){
                    acc.push("Active")
                    let days = Math.round(daydiff)
                    acc.push(days)
                }
                else{
                    acc.push("deactive")
                    let days = 0
                    acc.push(days)
                }
                acc.push(results[0].startdate);
                acc.push(results[0].enddate);
                res.send(acc);
            }       
        })
    }
    //tree diagram
    // else if(req.body.action === "showansmemberlevel") {
    //     var searchmemberlevel = req.body.searchmemberlevel;
    //     var tbltext = "";
    
    //     var chwcksql = "SELECT * FROM mlm_t.member WHERE membermobileno = '"+searchmemberlevel+"' AND orgid ='"+req.session.orgid+"'";
    //     nmcon.query(chwcksql,function(err, result) {
    //         console.log(chwcksql +" chwcksql")
    //         if(err) {
    //             console.log(err);
    //             return res.status(500).send('Internal Server Error');
    //         }
    //         if(result.length > 0) { 
    //             var refrenceid = result[0].memberid;
    //             var sql = "SELECT * FROM mlm_t.member WHERE memberid = ? AND orgid = ?";
    //             nmcon.query(sql, [refrenceid, req.session.orgid], async function(err, result) {
    //                 if(err) {
    //                     console.log(err);
    //                     return res.status(500).send('Internal Server Error');
    //                 }
    //                 if(result.length > 0) { 
                       
    //                     var thread1 = "<table id='report' style='width:100%;  align-self: center;'><tr><th style='width:180px'>Name</th><th style='width:150px'>Contact No</th><th> Levels</th><th>Amount</th><th>share %</th><th>share</th></tr>";
    //                     var totalAmount = 0;
    
    //                     for(var i = 0; i < result.length; i++) {
    //                         var membername = result[i].membername || '';
    //                         var membermobileno = result[i].membermobileno || '';
    //                         var memberid = result[i].memberid;
    //                         var planid = result[i].planid;
    //                         var orgid = req.session.orgid;
    //                         var amount = result[i].amount || '';
    
    //                         var { tbltext: updatedTblText, amt: updatedTotalAmount } = await getchildlevel1(tbltext, memberid, orgid, "&nbsp;&nbsp;&nbsp;&nbsp;", 1, 0, 0);
    //                         tbltext = updatedTblText;
    //                         totalAmount += updatedTotalAmount;
    //                     }
    
    //                     tbltext += "<tr><td colspan='4' style='text-align: right; font-size:17px;'>Total:</td><td id='totalamountid' colspan='2'>" + totalAmount + "</td><input type='hidden' id='refidHidden' value='" + refrenceid + "'></tr>";
    //                     var sql1 = "UPDATE member SET totalshare = ? WHERE memberid = ? AND orgid = ?";
    //                     nmcon.query(sql1, [totalAmount, refrenceid, req.session.orgid], function(err, result1) {
    //                         if(err) {
    //                             console.log(err);
    //                             return res.status(500).send('Internal Server Error');
    //                         }
    //                         if(result1.affectedRows > 0) {
    //                             tbltext = thread1 + tbltext;
    //                             res.send(tbltext);
    //                         } else {
    //                             res.send("Insert failed.");
    //                         }
    //                     });
    //                 } else {
    //                     res.send("No Record");
    //                 }
    //             });
    //         } else {
    //             res.send("No Record");
    //         }
    //     });
    // }

    else if (req.body.action === "showansmemberlevel") {
        var searchmemberlevel = req.body.searchmemberlevel;
        
        var chwcksql = "SELECT * FROM mlm_t.member WHERE membermobileno = '" + searchmemberlevel + "' AND orgid ='" + req.session.orgid + "'";
        nmcon.query(chwcksql, async function (err, result) {
            if (err) {
                console.log(err);
                res.send("Error occurred.");
            } else if (result.length > 0) {
                var treeHtml = "<div class='tree' ><ul>";
                for (var i = 0; i < result.length; i++) {
                    var member = result[i];
                    var memberName = member.membername || '';
                    var memberMobileNo = member.membermobileno || '';
                    var memberId = member.memberid;
    
                    // Generate HTML for current member
                    treeHtml += "<li>" + memberName + " <br> " + memberMobileNo;
    
                    // Recursively call getChildLevels for each child
                    var childTreeHtml = await getChildLevels1(treeHtml,memberId, req.session.orgid);
                    
                    // Append child tree HTML
                    treeHtml += childTreeHtml;
    
                    treeHtml += "</li>";
                }
                treeHtml += "</ul>";
    
                // Send the complete tree HTML
                res.send(treeHtml);
            } else {
                res.send("No Records.");
            }
        });
    }
    
}); 

// async function getChildLevels1(treeHtml,parentId, orgId) {
//     return new Promise((resolve, reject) => {
//         var sql = "SELECT * FROM mlm_t.member WHERE referenceid='" + parentId + "' and orgid='" + orgId + "'";
//         nmcon.query(sql, async function (err, result) {
//             if (err) {
//                 console.log(err);
//                 resolve("");
//             } else if (result.length > 0) {
//                 var childTreeHtml = "<ul>";
//                 for (var i = 0; i < result.length; i++) {
//                     var member = result[i];
//                     var memberName = member.membername || '';
//                     var memberMobileNo = member.membermobileno || '';
//                     var memberId = member.memberid;
//                     var memberpicid =member.memberpicid 

//                     // Generate HTML for current member
//                     childTreeHtml += "<li><div class='treediv'><a href='#'><img src='/static/image/membertree.png' class='treeimg'><span class='bgcolorli'>" + memberName + " <br> " + memberMobileNo +"</span></div>";

//                     // Recursively call getChildLevels for each child
//                     var subChildTreeHtml = await getChildLevels1(treeHtml,memberId, orgId);
                    
//                     // Append sub-child tree HTML
//                     childTreeHtml += subChildTreeHtml;

//                      childTreeHtml += "</li>";
//                 }
//                 childTreeHtml +="</ul>";
//                 resolve(childTreeHtml);
//             } else {
//                 resolve("");
//             }
//         });
//     });
// }

async function getChildLevels1(treeHtml, parentId, orgId) {
    return new Promise(async (resolve, reject) => {
    var sql = "SELECT * FROM mlm_t.member WHERE referenceid='"+parentId+"' AND orgid='"+orgId+"'";
    console.log(sql + " ;;;;;;;;;;;;;;")
            nmcon.query(sql, async function (err, result){
            if (result.length > 0) {
                let childTreeHtml = "<ul>";
                for (let i = 0; i < result.length; i++) {
                    const member = result[i];
                    const memberName = member.membername || '';
                    const memberMobileNo = member.membermobileno || '';
                    const memberId = member.memberid;
                    const memberpicid = member.memberpicid;

                    // Get the filename for the member's image
                    const filename = await getFilename(orgId, memberpicid);
                    const imgTag = filename ? `<img src='/getmlmprofilepic/${filename}' class='treeimg'>` : "<img src='/static/image/membertree.png' class='treeimg'>";
                    console.log(imgTag +" ////////////")
                    // Generate HTML for current member
                    childTreeHtml += `<li><div class='treediv'><a href='#'>${imgTag}<span class='bgcolorli'>${memberName}<br>${memberMobileNo}</span></div>`;
                    // Recursively call getChildLevels for each child
                    const subChildTreeHtml = await getChildLevels1(treeHtml, memberId, orgId);

                    // Append sub-child tree HTML
                    childTreeHtml += subChildTreeHtml;
                    childTreeHtml += "</li>";
                }
                childTreeHtml += "</ul>";
                resolve(childTreeHtml);
            } else {
                // If no members are found, resolve with an empty string
                resolve("");
            }
        
        })
    });
}

async function getFilename(orgId, fileid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT filename FROM uploadfile WHERE orgid='" + orgId + "' AND fileid='" + fileid + "'";
        console.log(sql + " ............");
        fcon.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else if (result.length > 0) {
                resolve(result[0].filename);
                console.log(result[0].filename + " result[0].filename")
            } else {
                console.log("No filename found for fileid:", fileid);
                resolve('');
            }
        });
    });
}

session.totalIncome=0; 
//console.log(session.totalIncome +"  session.totalIncome")
async function getchildlevel(tbltext1, memberid1, orgid1, cspace1, level = 1, totalCal1, cal, amt1 = 0) {
    return new Promise(async (resolve, reject) => {
        var memberid = memberid1;
        var orgid=orgid1;
        session.totalIncome = +totalCal1;
        var sessioncal = session.totalIncome
        var tbltext = tbltext1;
        var cspace = cspace1;
        //var planid1 = planid;
        var amt = amt1;
        var sql = "SELECT * FROM mlm_t.member a, plan b, plandetails c WHERE a.planid=b.planid and b.planid=c.planid and a.orgid='"+orgid+"' and  referenceid='" + memberid + "' and c.levels ='" + level + "'";
        nmcon.query(sql, async function (err, result) {
            console.log(sql +"  sql getchild")
            if (err) {
                console.log(err);
                resolve({ tbltext, amt });
            } else if (result.length > 0) {
                var abc = session.totalIncome;
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    var cmemberid = result[i].memberid;
                    var membername = result[i].membername;
                    if(membermobileno == 'undefined' || membermobileno == undefined || membermobileno == 'null' || membermobileno == null){
                        membermobileno = ''
                    }
                    var membermobileno = result[i].membermobileno;
                    if(membermobileno == 'undefined' || membermobileno == undefined || membermobileno == 'null' || membermobileno == null){
                        membermobileno = ''
                    }
                    var amount = result[i].amount;
                    if(amount == 'undefined' || amount == undefined || amount == 'null' || amount == null){
                        amount = ''
                    }
                    var cplanid = result[i].planid;
                    var share = result[i].share;
                    if(share == 'undefined' || share == undefined || share == 'null' || share == null){
                        share = ''
                    }
                    var cal = ((amount / 100) * share).toFixed(2);;

                    tbltext += "<tr><td style='text-align: left;'>" + cspace + membername + "</td><td>" + membermobileno + "</td><td>" + level + "</td><td>" + amount + "</td><td>" + share + "</td><td>" + cal + "</td></tr>";
                    amt = parseFloat(amt) + parseFloat(cal);
                    var { tbltext: tbl1, amt: subamt } = await getchildlevel(tbltext, cmemberid, orgid, cspace + "&nbsp;&nbsp;&nbsp;&nbsp;", level + 1, cal, amt);

                    
                    if (tbl1 != 'undefined' && tbl1 != undefined && tbl1 != null && tbl1 != 'null') {
                        tbltext = tbl1;
                    }
                    amt =amt+ subamt;
                }
                resolve({ tbltext, amt });
            } else {
                resolve({ tbltext, amt });
            }
        });
    });
}

app.listen(port,()=>{
    console.log('Server started at  port ${port}')
})


// const optionsssl = {
//     key: fs.readFileSync("/home/cal100/certs/25feb23/cal25feb23.pem"),
//     cert: fs.readFileSync("/home/cal100/certs/25feb23/hostgator.crt"),
// };
// app.listen(55556, () => {
//      console.log(`Server started at  port ${55000}`);
// })
// https.createServer(optionsssl, app).listen(port);

