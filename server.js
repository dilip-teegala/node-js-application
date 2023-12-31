//express
const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//render ejs


const { render } = require('ejs');
app.set('view engine', 'ejs');

//database
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();




//passwordhash
var passwordHash = require('password-hash');





app.get('/', function (req, res) {
  res.sendFile(__dirname+ "/public/"+"homepage.html")
})


app.get('/login', (req, res) => {
  res.sendFile(__dirname+ "/public/"+"login.html");
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+ "/public/"+"signup.html");
  });






app.post('/signupsubmit', function (req, res) {  
db.collection('userdetails')
.where("email","==",req.body.email)
.get()
.then((docs) => {
    if(docs.size>0){
    res.send("<h1>The account You are trying to Signup already exists , please Login</h1>");
    }
    else{
    db.collection('userdetails').add({

    email:req.body.email,
    password:passwordHash.generate(req.body.password)
}).then(() =>{
res.sendFile( __dirname + "/public/" + "login.html" );
})
}
})
})






app.post('/loginsubmit', function (req, res) {  
    db.collection('userdetails')
    .where("email","==",req.body.email)
    .get()
    .then((docs) => {
      var verified = false;
      docs.forEach((doc) => {
        verified = passwordHash.verify(req.body.password, doc.data().password)
      });
        if(verified){
          res.render("dashboard");
        }
        else{
          res.send("<h1>please signup first or Password was wrong</h1>")
        }
      })
    })


    
app.listen(3001)