if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const {uid} = require('uid')
const mysql = require('mysql2');
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

//Connecting Database
let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'oanh2311',
  database: 'chat_app'
});
connection.connect(function (err) {
  if(err){console.log("Cannot Connect")}
  else{console.log("Connect successfully")};
});
//

app.use( express.json())

const initializePassport = require("./passport-config.js");
const e = require("express");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


app.post( "/login", (req, res)=>{
  const id = uid(11);
  //Check for missing fields
  if(req.body.name == undefined || req.body.password == undefined)
  {
    res.status(400).json({
      status: "NOT OK",
      error:"SOMETHING IS MISSING"
    })
    return;
  }

  const username = req.body.name;
  connection.execute(
    'SELECT `Password` FROM `user` WHERE `Username` = ?',
    [username],
    function(err, results, fields) {
      console.log(err, results);
      //Checking for username
      if(results.length==0)
      {
        res.status(401).json({
          "status":"NOT OK",
          "error": "No username"
        })
        return;
      }

      //Compare password
      if(bcrypt.compareSync(req.body.password, results[0].Password))
      {
        connection.execute('INSERT INTO `session` VALUES (?,?)', [id,username]);
        res.status(200).json(
        {
        "status": "OK",
        "tokenID": `${id}`
        }
        );
      }
      else{res.status(401).json({
        "status":"NOT OK",
        "error": "Wrong password"
      })}

    }    
)});



app.post("/register",  async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const id = uid(6);
  var sql = `INSERT INTO user(ID, Username, Password ) VALUES ('${id}', '${req.body.name}','${hashedPassword}')`;
  connection.query(sql, function (err, result) {
  if (err) {
    if(err.code=="ER_DUP_ENTRY")
    {
      res.send("Username is already exist");
    }
  }
  else
  {
    console.log("1 record inserted");
    res.send("OK");
  }
})});

app.delete("/logout", (req, res) => {
  const ID = req.body.tokenID;
  connection.execute('DELETE FROM `session` WHERE `SessionID` =?',[ID],(err,result,fields)=>{
    res.status(200).json({
      status: "OK",
      respones: "delete tokenID"
    }
    )
  })

});

app.post("/makefriend", (req,res) =>{
  if(req.body.tokenID == undefined || req.body.userB == undefined )
  {
    res.status(400).json({
      status: "NOT OK",
      error: "SOMETHING IS MISSING"
    })
  }

  //Find username using tokenID
  const tokenID = req.body.tokenID;
  let userA = "";
  connection.execute(
    'SELECT `Username` FROM `session` WHERE `SessionID` = ?',
    [tokenID],
    function(err, results, fields) {
      userA = results[0].Username;
      //Update friend list
      const username_1 = userA;
      const username_2 = req.body.userB;

      const today = new Date();
      const datestring = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      connection.execute('INSERT INTO `friendship` VALUES (?,?,?)',[username_1,username_2,datestring],
      (err,results,fields)=>{
        if(err.code == "ER_DUP_ENTRY")
        {
          res.status(400).json({
            status: "NOT OK",
            respones: "Already friend"
          })  
        }
        else {
        res.status(200).json({
        status: "OK",
        respones: "Add friend successfully"
      })}})
    })



})


app.delete("/unfriend",(req,res)=>{
  //Find username using tokenID
  if(req.body.tokenID == undefined || req.body.userB == undefined )
  {
    res.status(400).json({
      status: "NOT OK",
      error: "SOMETHING IS MISSING"
    })
  }
  
  const tokenID = req.body.tokenID;
  let userA = "";
  connection.execute(
    'SELECT `Username` FROM `session` WHERE `SessionID` = ?',
    [tokenID],
    function(err, results, fields) {
      userA = results[0].Username;
      //Update friend list
      const username_1 = userA;
      const username_2 = req.body.userB;

      const today = new Date();
      connection.execute('DELETE FROM `friendship` WHERE `userA` = ? AND `userB` = ?',[username_1,username_2],
      (err,results,fields)=>{
        console.log(err);
        res.status(200).json({
        status: "OK",
        respones: "Delete friend successfully"
      })})
    })
})


app.listen(3000);
