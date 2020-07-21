var express = require('express');
var router = express.Router();
var Admin=require('../model/Admin');
var validator=require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
 
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);
//const { schema } = require('../model/Admin');

/* GET home page. */
router.get('/',function(req,res){
  var user=req.session.user?req.session.user.name:"unknown";
  console.log(user);
  
  res.render('index',{user:user});
})
router.get("/home",function(req,res){
  res.render("home");
})
router.get('/signup',function(req,res){
  res.render('signup');
})
router.post('/signup',function(req,res){
  var admin=new Admin();
  admin.name=req.body.name;
  admin.email=req.body.email;
  admin.password=req.body.pwd;
  
  admin.save(function(err,rtn){
    if(err)throw err;
    res.redirect('/');
  })
})
router.get('/signin',function(req,res){
  res.render('signin');
})
router.post('/signin',function(req,res){
  Admin.findOne({email:req.body.email},function (err,rtn) {
    if (err) throw err;
    if(rtn !=null){
      req.session.user={name:rtn.name,email:rtn.email};
      res.redirect('/');
    
    }else{
      res.redirect("/signin");
    }
  })
})
router.get('/logout',function(req,res){
  req.session.destroy(function(err,rtn){
    if (err) throw err;
   res.redirect('/');
  })
  
});
router.post("/emaildu",function(req,res){
  Admin.findOne({email:req.body.email},
    function(err,rtn){
      if (err) throw err;
      if(rtn==null && validator.validate(req.body.email)){
        res.json({status:false});
      }else{
        res.json({status:true});
      }
    })
})
router.post("/pwddu",function(req,res){
  console.log(req.body.password)
  res.json({status:schema.validate(req.body.password)});
})

module.exports=router;

