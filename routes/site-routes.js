const express = require('express');
const router  = express.Router();
const User = require("../models/user")
const multer       = require("multer");
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
router.get('/', (req, res, next) => {
  let currentUser;
  if (req.session) {
    currentUser = req.session.currentUser
  }
  res.render('index', { currentUser });
});
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); // ------------------------
  } else {                          // |
    res.redirect('/login');         // |
  }                                 // |
});                                 // |
                                    // |
//-------------------------------------
// |
// |
router.post('/profile', uploadCloud.single('photo'), (req, res, next) => {
  console.log('body', req.body)
  const { email, dateOfBirth, address, avatar,imgName, imgPath } = req.body;
  console.log(email)
  console.log(dateOfBirth)
  console.log(address)
  console.log(avatar)
  console.log(imgName)
  User.update({"username":req.session.currentUser.username}, { $set: {email, dateOfBirth, address, avatar }})

  .then((user) => {
    console.log(user)
    res.redirect('/profile',);
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/main', (req, res, next) => {
    console.log(req.session.currentUser)
  res.render('auth/main');
});
router.post('/main', (req, res, next) => {
  console.log("I am on post main")
  console.log(req.session.currentUser)
  console.log(req.body.score)
  User.findOne({"username" : req.session.currentUser.username})
  .then(userFound =>{
    if(userFound.highScore<req.body.score){
      User.findOneAndUpdate({username: req.session.currentUser.username},{ $set: {email, dateOfBirth,address, avatar, imgName, imgPath}})
      .then(result => console.log( "Saved on the database",result))
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
  
//res.render('auth/main');
});
 router.get('/profile', (req,res,next)=>{
   console.log("teste")
   currentUser = req.session.currentUser
  //  console.log(currentUser)
   User.findOne({"username": currentUser.username})
   .then(user=>
   {
     console.log(user)
    res.render("auth/profile", {user});
   })
   //res.render('auth/profile', {currentUser})
 })




router.get('/private', (req, res, next) => {
  res.render('private');
});
router.get('/ranking', (req, res, next) => {
  let ranking;
  User.find({ "highScore": { $gt: -1 }},{"highScore":-1,"username":1}).sort({"highScore":-1})
  .then(highScore =>{
    ranking=highScore
    console.log("Ranking from db ",ranking)
    //let index=[]
let count = 0;
let primeiro = ranking
    res.render('ranking',{primeiro:primeiro});
  })
  .catch(err => console.log(err))
  
 
});
module.exports = router;