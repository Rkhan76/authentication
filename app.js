//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const saltRounds = 10;


const app = express();

console.log(process.env.API_KEY);

//Connection
mongoose
.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=> console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

// Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
  }
);

//Model
const User = new mongoose.model('User', UserSchema);



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res)=>{
    res.render('home');
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", async (req, res)=>{
    try {
        bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
        const savedData = await User.create({
        email: req.body.username,
        password: hash,
       })
        res.render("secrets");
    })
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const results = await User.findOne({ email: username }).exec();
      try {
        bcrypt.compare(password, results.password, function (err, result) {
           if(result===true){
            res.render('secrets')
           }
        })
      } catch (error) {
        console.log(error);
      }      
});



app.listen(3000, (req, res)=>{
    console.log("Server started on port 3000");
});