var express=require('express');
var router=express.Router();
const User=require('../../model/User');
var bycrypt=require('bcryptjs');
var checkAuth=require("../middleware/check-auth");
router.get('/list',checkAuth,function(req,res){
    User.find(function(err,rtn){
        if (err) {
            res.status(500).json({
                message:"Internal server error",
            error:err,            });
        }else{
            res.status(200).json({
                users:rtn,
            });
        }
    });

});
router.post('/add',function(req,res){
    User.findOne({email:req.body.email},function(err2,rtn2){
        if (err2) {
            res.status(500).json({
                message:"Internal server error",
            error:err2,            });
        }
        if (rtn2!=null)
        {
            res.status(500).json({
                message:"Duplicate email",
            })
        }else{
            var user=new User();
            user.name=req.body.name;
            user.email=req.body.email;
            user.password=req.body.password;
            user.save(function(err,rtn){
                if(err) {
                    res.status(500).json({
                        message:"Internal server error",
                    })
                }else{
                    res.status(201).json({
                        message:"User account created",
                        user:rtn,
                    })
                }
            })
        }
    })
    
})
router.get("/detail/:id",checkAuth,function(req,res){
    User.findById(req.params.id,function(err,rtn){
        if (err){
            res.status(500).json({message:"internal Server error",
            error:err})
        }else 
        {if (rtn==null){
            res.status(204).json({message:"No content found"})
        }else{
            res.status(200).json({user:rtn})
        }
        }
    })
})
router.patch("/:id",function(req,res){
    var update={
        name:req.body.name,
        email:req.body.email,
        password:bycrypt.hashSync(req.body.password,bycrypt.genSaltSync(8),null)
    };
    User.findByIdAndUpdate(req.params.id,{$set:update},function(err,rtn){
        if(err){
            res.status(500).json({message:"internal Server error",
            error:err})
        }else{
            res.status(200).json({user:rtn })
        }
    })
})
router.delete("/delete/:id",function(req,res){
    User.findByIdAndRemove(req.params.id,function(err,rtn){
        if (err){
            res.status(500).json({
                message:"internal server error",
                error:err
            })
        }else{
            res.status(200).json({
                message:'user delete successful'
            })
        }
    })
})
module.exports=router;